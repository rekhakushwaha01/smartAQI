"""
Demo risk category / score logic, ported from frontend/src/utils/riskCalculator.js.

This is the same heuristic the main app already uses for assessments.
It does not require a trained model.
"""


def _num(value, default=0):
    try:
        if value is None or value == "":
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def _list(value):
    return value if isinstance(value, list) else []


def get_risk_level(score):
    if score <= 30:
        return {
            "label": "Low",
            "color": "#22C55E",
            "advice": "Stay active outdoors with basic precautions.",
        }
    if score <= 60:
        return {
            "label": "Moderate",
            "color": "#F59E0B",
            "advice": "Limit long outdoor exposure; monitor symptoms.",
        }
    if score <= 80:
        return {
            "label": "High",
            "color": "#F97316",
            "advice": "Avoid outdoor exertion; use N95 and indoor air purifiers.",
        }
    return {
        "label": "Severe",
        "color": "#EF4444",
        "advice": "Stay indoors if possible and consult a doctor promptly.",
    }


def category_for(score):
    return get_risk_level(score)


def calculate_risk_score(aqi, profile):
    profile = profile or {}
    aqi = _num(aqi, 0)
    score = min(70, round((aqi / 300) * 50))

    if not profile.get("noMedicalHistory"):
        if profile.get("asthma"):
            score += 12
        if profile.get("copd"):
            score += 14
        if profile.get("lungDisease"):
            score += 12
        if profile.get("heartDisease"):
            score += 10
        if profile.get("allergies"):
            score += 5
        custom_med = _list(profile.get("customMedical"))
        if custom_med:
            score += min(12, len(custom_med) * 4)

    smoking = profile.get("smoking")
    if smoking == "regular":
        score += 15
    if smoking == "occasional":
        score += 8

    outdoor_hours = _num(profile.get("outdoorHours"), 0)
    if outdoor_hours >= 6:
        score += 10
    elif outdoor_hours >= 3:
        score += 5

    if profile.get("exerciseFrequency") == "daily":
        score += 4
    if profile.get("maskUsage") == "never":
        score += 8
    if profile.get("maskUsage") == "sometimes":
        score += 4

    age = _num(profile.get("age"), 30)
    if age >= 65:
        score += 8
    if age <= 12:
        score += 8

    if not profile.get("noSymptoms"):
        if profile.get("cough"):
            score += 5
        if profile.get("breathingDifficulty"):
            score += 10
        if profile.get("chestTightness"):
            score += 8
        if profile.get("eyeIrritation"):
            score += 3
        custom_sym = _list(profile.get("customSymptoms"))
        if custom_sym:
            score += min(10, len(custom_sym) * 3)

    return int(min(100, max(0, score)))


def get_risk_factors(aqi, profile, pollutants):
    profile = profile or {}
    pollutants = pollutants or {}
    factors = []
    aqi = _num(aqi, 0)

    if _num(pollutants.get("pm25")) > 35:
        factors.append({"label": "High PM2.5", "severity": "high", "modifiable": False})
    if _num(pollutants.get("pm10")) > 50:
        factors.append({"label": "Elevated PM10", "severity": "medium", "modifiable": False})
    if _num(pollutants.get("no2")) > 53:
        factors.append({"label": "High NO₂", "severity": "medium", "modifiable": False})
    if _num(pollutants.get("o3")) > 70:
        factors.append({"label": "High Ozone", "severity": "medium", "modifiable": False})

    if not profile.get("noMedicalHistory"):
        if profile.get("asthma"):
            factors.append({"label": "Asthma", "severity": "high", "modifiable": False})
        if profile.get("copd"):
            factors.append({"label": "COPD", "severity": "high", "modifiable": False})
        if profile.get("heartDisease"):
            factors.append({"label": "Heart Disease", "severity": "medium", "modifiable": False})
        for item in _list(profile.get("customMedical")):
            factors.append({"label": str(item), "severity": "medium", "modifiable": False})

    if profile.get("smoking") and profile.get("smoking") != "never":
        factors.append({"label": "Smoking", "severity": "high", "modifiable": True})
    if _num(profile.get("outdoorHours")) >= 4:
        factors.append({"label": "Outdoor Exposure", "severity": "medium", "modifiable": True})
    if aqi > 150:
        factors.append({"label": "Poor Air Quality", "severity": "high", "modifiable": False})

    if not profile.get("noSymptoms"):
        if profile.get("breathingDifficulty"):
            factors.append({"label": "Breathing Difficulty", "severity": "high", "modifiable": False})
        for item in _list(profile.get("customSymptoms")):
            factors.append({"label": str(item), "severity": "medium", "modifiable": False})

    if not factors:
        factors.append({
            "label": "No major personal risk factors",
            "severity": "low",
            "impactPct": 0,
            "modifiable": False,
        })
    return factors


def get_recommendations(score, aqi, profile):
    profile = profile or {}
    recs = []
    aqi = _num(aqi, 0)
    outdoor_hours = _num(profile.get("outdoorHours"), 0)

    if aqi > 100 or score > 40:
        recs.append({
            "icon": "😷",
            "title": "Wear N95 Mask",
            "desc": "Use N95/KN95 masks when stepping outdoors.",
        })
    if aqi > 150 or outdoor_hours >= 4:
        recs.append({
            "icon": "🏠",
            "title": "Reduce Outdoor Activities",
            "desc": "Limit strenuous outdoor exercise during peak pollution hours.",
        })
    recs.append({
        "icon": "💧",
        "title": "Stay Hydrated",
        "desc": "Drink plenty of water to help your respiratory system.",
    })
    if aqi > 100:
        recs.append({
            "icon": "🌬️",
            "title": "Air Purifier Recommended",
            "desc": "Use HEPA air purifiers indoors, especially in bedrooms.",
        })
    if (
        profile.get("breathingDifficulty")
        or profile.get("chestTightness")
        or score > 70
        or _list(profile.get("customSymptoms"))
    ):
        recs.append({
            "icon": "🏥",
            "title": "Consult Doctor",
            "desc": "Seek medical advice if symptoms increase or persist.",
        })
    if aqi <= 50 and score <= 30:
        recs.append({
            "icon": "✅",
            "title": "Safe to Exercise Outdoors",
            "desc": "Air quality is good — enjoy outdoor activities safely.",
        })
    return recs


def get_ai_explanation(score, aqi, profile):
    profile = profile or {}
    category = category_for(score)
    aqi = round(_num(aqi, 0))
    conditions = []

    if not profile.get("noMedicalHistory"):
        if profile.get("asthma"):
            conditions.append("asthma")
        if profile.get("copd"):
            conditions.append("COPD")
        if profile.get("lungDisease"):
            conditions.append("lung disease")
        for item in _list(profile.get("customMedical")):
            conditions.append(str(item).lower())

    if profile.get("smoking") and profile.get("smoking") != "never":
        conditions.append("smoking history")

    text = (
        f"Based on the current AQI of {aqi} and your health profile, "
        f"your respiratory health risk is {category['label'].lower()} ({score}%). "
    )
    if conditions:
        text += (
            f"Key contributing factors include {', '.join(conditions)} "
            "combined with local air pollution levels. "
        )
    if aqi > 150:
        text += (
            "PM2.5 and PM10 levels are elevated, which can penetrate deep into "
            "the lungs and aggravate respiratory conditions."
        )
    elif aqi > 100:
        text += (
            "Moderate pollution levels may cause discomfort for sensitive "
            "individuals during prolonged outdoor exposure."
        )
    else:
        text += "Current air conditions are relatively favorable for most outdoor activities."
    return text


def get_health_score(risk_score):
    return max(0, 100 - risk_score)


def get_exposure_index(outdoor_hours, aqi, mask_usage):
    index = round((_num(outdoor_hours) / 8) * 40 + (_num(aqi) / 300) * 60)
    if mask_usage == "always":
        index = round(index * 0.6)
    elif mask_usage == "sometimes":
        index = round(index * 0.8)
    return min(100, int(index))


def build_prediction(aqi, profile, pollutants=None):
    """Return the payload the UI / backend already expect from /predict."""
    profile = profile or {}
    pollutants = pollutants or {}
    score = calculate_risk_score(aqi, profile)
    category = category_for(score)
    return {
        "modelSource": "demo",
        "riskProbability": round(score / 100, 4),
        "riskScore": score,
        "riskCategory": category,
        "healthScore": get_health_score(score),
        "exposureIndex": get_exposure_index(
            profile.get("outdoorHours"), aqi, profile.get("maskUsage")
        ),
        "riskFactors": get_risk_factors(aqi, profile, pollutants),
        "recommendations": get_recommendations(score, aqi, profile),
        "aiExplanation": get_ai_explanation(score, aqi, profile),
        "overrides": [],
        "modelInfo": {
            "source": "demo",
            "logic": "frontend/src/utils/riskCalculator.js",
        },
    }
