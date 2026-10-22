"""
Train the respiratory-risk model.

    python train.py            -> train on synthetic data only
    python train.py --mongo    -> synthetic data + real assessments from MongoDB

TARGET: probability that the person experiences respiratory symptoms
(cough, breathing difficulty or chest tightness) at a given AQI + profile.

IMPORTANT - READ BEFORE PUBLISHING ANYTHING:
  * The SYNTHETIC rows are generated from assumed effect sizes (see synth_logit).
    They are directionally informed by general epidemiology but are NOT fitted to
    patient data. Replace the coefficients with values from papers you cite.
  * REAL rows come from your own users' saved assessments (self-reported symptoms).
    As they accumulate, they get higher weight and the model increasingly learns
    from reality. Re-run `python train.py --mongo` periodically.
"""
import argparse
import os
from datetime import datetime, timezone

import joblib
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import brier_score_loss, roc_auc_score
from sklearn.model_selection import train_test_split

from features import FEATURES, MONOTONIC, build_row

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.joblib")
REAL_WEIGHT = 5.0          # one real record counts as 5 synthetic ones
MIN_REAL_FOR_EVAL = 100
rng = np.random.default_rng(42)


# --------------------------------------------------------------------------- #
# 1. Synthetic data (assumption-based)
# --------------------------------------------------------------------------- #
def synth_logit(d: pd.DataFrame) -> np.ndarray:
    """ASSUMED effect sizes on the log-odds scale. Edit/cite these."""
    eff_aqi = d.aqi * (1 - 0.30 * (d["mask"] == 2) - 0.12 * (d["mask"] == 1))
    dose = (eff_aqi / 100.0) * (0.5 + 0.1 * d.outdoor_hours)   # exposure proxy

    z = -3.3 + 0.9 * dose
    z += d.asthma * (0.90 + 0.35 * dose)          # pollution hits asthmatics harder
    z += d.copd * (1.10 + 0.40 * dose)
    z += d.lung_disease * (0.90 + 0.30 * dose)
    z += d.heart_disease * (0.35 + 0.10 * dose)
    z += d.allergies * (0.40 + 0.10 * dose)
    z += np.select([d.smoking == 2, d.smoking == 1], [0.75, 0.35], 0.0)
    z += np.where(d.age >= 65, 0.40, 0.0) + np.where(d.age <= 12, 0.45, 0.0)
    z += np.where(d.bmi >= 30, 0.20, 0.0)
    z += (d.exercise == 2) * 0.10 * dose           # more ventilation outdoors
    z += rng.normal(0, 0.4, len(d))                # unobserved individual variation
    return z


def make_synthetic(n: int) -> pd.DataFrame:
    aqi = np.clip(rng.lognormal(np.log(120), 0.6, n), 15, 500)
    smoking = rng.choice([0, 1, 2], n, p=[0.78, 0.10, 0.12])
    age = np.clip(rng.normal(35, 18, n), 3, 90)
    d = pd.DataFrame({
        "aqi": aqi,
        "pm25": aqi * rng.uniform(0.45, 0.75, n),
        "age": age,
        "bmi": np.clip(rng.normal(24.5, 4.5, n), 14, 45),
        "asthma": rng.binomial(1, 0.08, n),
        "copd": rng.binomial(1, np.where((smoking == 2) | (age > 60), 0.07, 0.015)),
        "lung_disease": rng.binomial(1, 0.03, n),
        "heart_disease": rng.binomial(1, np.where(age > 55, 0.15, 0.04)),
        "allergies": rng.binomial(1, 0.20, n),
        "smoking": smoking,
        "outdoor_hours": np.clip(np.round(rng.normal(3, 2, n)), 0, 12),
        "mask": rng.choice([0, 1, 2], n, p=[0.40, 0.40, 0.20]),
        "exercise": rng.choice([0, 1, 2], n, p=[0.25, 0.50, 0.25]),
    })
    p = 1 / (1 + np.exp(-synth_logit(d)))
    d["label"] = rng.binomial(1, p)
    d["source"] = "synthetic"
    return d


# --------------------------------------------------------------------------- #
# 2. Real data from MongoDB (your saved assessments)
# --------------------------------------------------------------------------- #
def load_real() -> pd.DataFrame:
    from pymongo import MongoClient

    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "Backend", ".env"))
    uri = os.getenv("MONGO_URL")
    if not uri:
        print("  ! MONGO_URL not found in Backend/.env - skipping real data")
        return pd.DataFrame()

    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    try:
        db = client.get_default_database()
    except Exception:
        db = client["test"]                 # Mongoose's default when URI has no db name
    docs = list(db["healthassessments"].find({}, {"profile": 1, "aqi": 1}))
    return rows_from_docs(docs)


def rows_from_docs(docs) -> pd.DataFrame:
    """Saved assessments -> training rows. Label = user reported >=1 respiratory symptom."""
    rows = []
    for doc in docs:
        profile = doc.get("profile") or {}
        if doc.get("aqi") is None:
            continue
        row = build_row(doc["aqi"], {}, profile)
        symptomatic = (not profile.get("noSymptoms")) and any(
            profile.get(k) for k in ("cough", "breathingDifficulty", "chestTightness")
        )
        row["label"] = int(symptomatic)
        row["source"] = "real"
        rows.append(row)
    return pd.DataFrame(rows)


# --------------------------------------------------------------------------- #
# 3. Train + evaluate + save
# --------------------------------------------------------------------------- #
def evaluate(model, df, name):
    if df.empty or df.label.nunique() < 2:
        print(f"  {name}: not enough variety to evaluate")
        return None
    p = model.predict_proba(df[FEATURES])[:, 1]
    auc, brier = roc_auc_score(df.label, p), brier_score_loss(df.label, p)
    print(f"  {name}: ROC-AUC={auc:.3f}  Brier={brier:.3f}  (n={len(df)}, positive rate={df.label.mean():.1%})")
    return {"roc_auc": round(float(auc), 4), "brier": round(float(brier), 4), "n": int(len(df))}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mongo", action="store_true", help="also train on saved MongoDB assessments")
    ap.add_argument("--n-synthetic", type=int, default=30000)
    args = ap.parse_args()

    print("Generating synthetic data ...")
    synth = make_synthetic(args.n_synthetic)
    real = pd.DataFrame()
    if args.mongo:
        print("Loading real assessments from MongoDB ...")
        real = load_real()
        print(f"  found {len(real)} real records")

    s_train, s_test = train_test_split(synth, test_size=0.2, random_state=1)
    if len(real) >= MIN_REAL_FOR_EVAL and real.label.nunique() > 1:
        r_train, r_test = train_test_split(real, test_size=0.2, random_state=1, stratify=real.label)
    else:
        r_train, r_test = real, pd.DataFrame()

    train = pd.concat([s_train, r_train], ignore_index=True)
    weights = np.where(train.source == "real", REAL_WEIGHT, 1.0)

    model = HistGradientBoostingClassifier(
        max_depth=4, learning_rate=0.06, max_iter=250,
        monotonic_cst=[MONOTONIC[f] for f in FEATURES],
        l2_regularization=1.0, random_state=7,
    )
    model.fit(train[FEATURES], train.label, sample_weight=weights)

    print("Evaluation (held-out):")
    metrics = {"synthetic": evaluate(model, s_test, "synthetic")}
    if not r_test.empty:
        metrics["real"] = evaluate(model, r_test, "real     ")
    else:
        print("  real: fewer than %d real records -> no real-world evaluation yet" % MIN_REAL_FOR_EVAL)

    joblib.dump({
        "model": model,
        "features": FEATURES,
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "n_synthetic": int(len(s_train)),
        "n_real": int(len(r_train)),
        "metrics": metrics,
    }, MODEL_PATH)
    print(f"Saved model -> {MODEL_PATH}")


if __name__ == "__main__":
    main()
