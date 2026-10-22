"""
Feature definitions shared by training (train.py) and serving (app.py).
Keeping this in ONE place guarantees the model sees identical inputs in both.
"""
import math

FEATURES = [
    "aqi", "pm25", "age", "bmi",
    "asthma", "copd", "lung_disease", "heart_disease", "allergies",
    "smoking", "outdoor_hours", "mask", "exercise",
]

# +1: predicted risk may never DEcrease when this feature increases
# -1: predicted risk may never INcrease when this feature increases
#  0: unconstrained (age: both children and the elderly are more sensitive)
# This keeps the model medically sensible even when real data is small/noisy.
MONOTONIC = {
    "aqi": 1, "pm25": 1, "age": 0, "bmi": 0,
    "asthma": 1, "copd": 1, "lung_disease": 1, "heart_disease": 1, "allergies": 1,
    "smoking": 1, "outdoor_hours": 1, "mask": -1, "exercise": 0,
}

SMOKING = {"never": 0, "occasional": 1, "regular": 2}
MASK = {"never": 0, "sometimes": 1, "always": 2}
EXERCISE = {"none": 0, "moderate": 1, "daily": 2}


def _num(value, default):
    try:
        x = float(value)
        return default if math.isnan(x) else x
    except (TypeError, ValueError):
        return default


def estimate_pm25(aqi):
    """Rough PM2.5 (ug/m3) from AQI, used only when the AQI API gives no PM2.5."""
    return aqi * 0.6


def build_row(aqi, pollutants, profile):
    """Convert the frontend's AQI + profile payload into one model-input row."""
    profile = profile or {}
    pollutants = pollutants or {}
    no_med = bool(profile.get("noMedicalHistory"))

    def flag(key):
        return 0 if no_med else int(bool(profile.get(key)))

    aqi = _num(aqi, 100.0)
    pm25 = _num(pollutants.get("pm25"), estimate_pm25(aqi))

    bmi = _num(profile.get("bmi"), float("nan"))
    if math.isnan(bmi):
        h = _num(profile.get("height"), 0)
        w = _num(profile.get("weight"), 0)
        bmi = w / ((h / 100) ** 2) if h > 0 and w > 0 else 23.0

    return {
        "aqi": aqi,
        "pm25": pm25,
        "age": _num(profile.get("age"), 30.0),
        "bmi": min(max(bmi, 12.0), 50.0),
        "asthma": flag("asthma"),
        "copd": flag("copd"),
        "lung_disease": flag("lungDisease"),
        "heart_disease": flag("heartDisease"),
        "allergies": flag("allergies"),
        "smoking": SMOKING.get(profile.get("smoking"), 0),
        "outdoor_hours": min(max(_num(profile.get("outdoorHours"), 3.0), 0.0), 16.0),
        "mask": MASK.get(profile.get("maskUsage"), 1),
        "exercise": EXERCISE.get(profile.get("exerciseFrequency"), 1),
    }
