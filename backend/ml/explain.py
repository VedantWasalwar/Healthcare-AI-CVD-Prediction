import os
import sys
import shap
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from ml.predict import load_artifacts

_explainer = None

FEATURE_NAME_MAP = {
    'age_years': 'Age (Years)',
    'gender': 'Biological Sex',
    'height': 'Height (cm)',
    'weight': 'Weight (kg)',
    'bmi': 'Body Mass Index (BMI)',
    'ap_hi': 'Systolic BP (mmHg)',
    'ap_lo': 'Diastolic BP (mmHg)',
    'cholesterol': 'Serum Cholesterol Level',
    'gluc': 'Fasting Glucose Level',
    'smoke': 'Smoking Habit',
    'alco': 'Alcohol Consumption',
    'active': 'Physical Activity'
}

def get_explainer():
    global _explainer
    if _explainer is None:
        model, _ = load_artifacts()
        _explainer = shap.TreeExplainer(model)
    return _explainer

def explain_prediction(df_single: pd.DataFrame) -> dict:
    """
    Computes exact SHAP values for single sample inference using TreeExplainer.
    Returns full feature contributions and sorted top positive risk drivers.
    """
    explainer = get_explainer()
    shap_values = explainer.shap_values(df_single)

    if isinstance(shap_values, list):
        vals = shap_values[1][0]
    elif len(shap_values.shape) == 2:
        vals = shap_values[0]
    else:
        vals = shap_values[0]

    feature_cols = list(df_single.columns)
    sample_row = df_single.iloc[0].to_dict()

    explanation_list = []
    for col, sv in zip(feature_cols, vals):
        readable = FEATURE_NAME_MAP.get(col, col)
        raw_val = sample_row.get(col, 0)

        if col == 'gender':
            fmt_val = 'Male' if int(raw_val) == 2 else 'Female'
        elif col in ['cholesterol', 'gluc']:
            c_map = {1: 'Normal', 2: 'Above Normal', 3: 'Well Above Normal'}
            fmt_val = c_map.get(int(raw_val), str(raw_val))
        elif col in ['smoke', 'alco', 'active']:
            fmt_val = 'Yes' if int(raw_val) == 1 else 'No'
        elif col in ['age_years', 'weight', 'bmi']:
            fmt_val = f"{float(raw_val):.1f}"
        else:
            fmt_val = str(int(raw_val) if isinstance(raw_val, (int, float)) and raw_val == int(raw_val) else raw_val)

        explanation_list.append({
            "feature": col,
            "readableFeatureName": readable,
            "shap_value": round(float(sv), 4),
            "feature_value": raw_val,
            "formattedValue": fmt_val,
            "direction": "increases_risk" if sv > 0 else "decreases_risk"
        })

    # Sort positive drivers by descending magnitude
    top_drivers = sorted(
        [item for item in explanation_list if item['shap_value'] > 0],
        key=lambda x: x['shap_value'],
        reverse=True
    )

    return {
        "shap_explanation": explanation_list,
        "top_risk_factors": top_drivers
    }
