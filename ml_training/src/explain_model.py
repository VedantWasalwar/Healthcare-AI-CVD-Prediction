import shap
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from ml_training.src.config import SHAP_SUMMARY_PATH, FEATURE_COLUMNS

def generate_shap_summary_plot(model, X_train):
    """
    Computes SHAP values across a representative sample of training data
    and generates the global feature summary plot (shap_summary.png).
    """
    print("Computing SHAP TreeExplainer for summary plot...")
    explainer = shap.TreeExplainer(model)
    
    # Take a representative sample (e.g. 1000 records) for faster, clean plot generation
    X_sample = X_train.sample(n=min(1000, len(X_train)), random_state=42)
    shap_values = explainer.shap_values(X_sample)
    
    plt.figure(figsize=(10, 6))
    shap.summary_plot(shap_values, X_sample, feature_names=FEATURE_COLUMNS, show=False)
    plt.title('SHAP Feature Importance Summary - HeartCare AI Model', fontsize=12, pad=15)
    plt.tight_layout()
    plt.savefig(SHAP_SUMMARY_PATH, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Saved SHAP summary plot to: {SHAP_SUMMARY_PATH}")
    return explainer

def explain_patient_prediction(model, input_df):
    """
    Computes individual SHAP explanations for a single patient input row.
    Returns structured feature contribution dictionaries.
    NOTE: SHAP values represent statistical feature contributions to the AI risk score
    and must NOT be interpreted as a clinical medical diagnosis.
    """
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(input_df)
    
    if len(shap_values.shape) == 2:
        patient_shap = shap_values[0]
    else:
        patient_shap = shap_values[0]
        
    explanations = []
    for i, col in enumerate(FEATURE_COLUMNS):
        val = float(patient_shap[i])
        raw_val = float(input_df[col].iloc[0])
        direction = "increases_risk" if val > 0 else "decreases_risk"
        
        explanations.append({
            "feature": col,
            "patient_value": raw_val,
            "shap_value": round(val, 4),
            "importance": round(abs(val), 4),
            "direction": direction
        })
        
    # Sort features by absolute importance (highest influence first)
    explanations.sort(key=lambda x: x['importance'], reverse=True)
    return explanations
