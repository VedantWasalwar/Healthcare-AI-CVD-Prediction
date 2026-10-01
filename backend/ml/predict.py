import os
import sys
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from ml.preprocessing import CVDDataPreprocessor

MODEL_PATH = os.path.join(BASE_DIR, 'ml', 'model', 'cardiovascular_model.pkl')
PREPROCESSOR_PATH = os.path.join(BASE_DIR, 'ml', 'model', 'preprocessor.pkl')

_model = None
_preprocessor = None

def load_artifacts():
    global _model, _preprocessor
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    if _preprocessor is None:
        _preprocessor = joblib.load(PREPROCESSOR_PATH)
    return _model, _preprocessor

def predict_cvd_risk(patient_dict: dict) -> dict:
    """
    Inference function for prediction API.
    Receives raw patient parameters dictionary, preprocesses using CVDDataPreprocessor,
    runs XGBoost model inference, and returns risk prediction metadata.
    """
    model, preprocessor = load_artifacts()

    # Preprocess patient dictionary
    df_single = preprocessor.preprocess_dict(patient_dict)

    # Inference
    prob = float(model.predict_proba(df_single)[0, 1])
    pct = round(prob * 100, 2)
    prediction_class = int(prob >= 0.5)

    if pct < 25.0:
        level = "LOW"
    elif pct < 50.0:
        level = "MODERATE"
    elif pct < 75.0:
        level = "HIGH"
    else:
        level = "VERY HIGH"

    return {
        "prediction": prediction_class,
        "risk_probability": prob,
        "risk_percentage": pct,
        "risk_level": level,
        "features": df_single.to_dict(orient='records')[0]
    }
