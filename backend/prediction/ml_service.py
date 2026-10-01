import os
import sys
import json
import joblib
import pandas as pd
import shap
from django.conf import settings

# Ensure project root is in sys.path so pickled CVDDataPreprocessor class can be unpickled
ROOT_DIR = os.path.abspath(os.path.join(settings.BASE_DIR, '..'))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Path to backend ML models directory
ML_MODELS_DIR = os.path.join(settings.BASE_DIR, 'ml_models')

MODEL_PATH = os.path.join(ML_MODELS_DIR, 'xgboost_cvd_model.pkl')
PREPROCESSOR_PATH = os.path.join(ML_MODELS_DIR, 'preprocessor.pkl')
FEATURE_COLUMNS_PATH = os.path.join(ML_MODELS_DIR, 'feature_columns.json')

HUMAN_FEATURE_NAMES = {
    'ap_hi': 'Systolic Blood Pressure',
    'ap_lo': 'Diastolic Blood Pressure',
    'age_years': 'Age',
    'age': 'Age',
    'bmi': 'Body Mass Index (BMI)',
    'weight': 'Weight',
    'height': 'Height',
    'cholesterol': 'Cholesterol Level',
    'gluc': 'Blood Glucose',
    'smoke': 'Smoking Status',
    'alco': 'Alcohol Intake',
    'active': 'Physical Activity',
    'gender': 'Gender'
}

class HeartCareMLService:
    """
    Singleton ML Service for loading trained XGBoost artifacts, generating
    real-time CVD predictions, local SHAP explanations, counterfactual AI scenarios,
    and transparent audit metadata within Django backend.
    """
    _instance = None
    _model = None
    _preprocessor = None
    _feature_columns = None
    _explainer = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(HeartCareMLService, cls).__new__(cls)
            cls._instance._load_artifacts()
        return cls._instance

    def _load_artifacts(self):
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file missing at: {MODEL_PATH}")
        if not os.path.exists(PREPROCESSOR_PATH):
            raise FileNotFoundError(f"Preprocessor file missing at: {PREPROCESSOR_PATH}")
        if not os.path.exists(FEATURE_COLUMNS_PATH):
            raise FileNotFoundError(f"Feature columns file missing at: {FEATURE_COLUMNS_PATH}")

        print(f"[Django ML Service] Loading model artifacts from: {ML_MODELS_DIR}...")
        self._model = joblib.load(MODEL_PATH)
        self._preprocessor = joblib.load(PREPROCESSOR_PATH)
        
        with open(FEATURE_COLUMNS_PATH, 'r', encoding='utf-8') as f:
            self._feature_columns = json.load(f)

        self._explainer = shap.TreeExplainer(self._model)
        print("[Django ML Service] Model, Preprocessor, Feature Columns, and SHAP Explainer loaded successfully!")

    def is_loaded(self):
        return (
            self._model is not None and
            self._preprocessor is not None and
            self._feature_columns is not None
        )

    def get_model_metadata(self) -> dict:
        """
        Returns research, calibration, threshold, and experiment audit metadata (Section 32.12 - 32.19).
        """
        return {
            "model_name": "XGBoost Classifier (Gradient Boosted Decision Trees)",
            "model_version": "XGBoost_v1.0",
            "dataset_version": "Cardiovascular Dataset v1.0 (70,000 Patient Records)",
            "threshold_selection_method": "Project-specific calibrated clinical decision thresholds (ROC Youden J Statistic)",
            "thresholds": {
                "low": "Probability < 35.0%",
                "moderate": "35.0% <= Probability < 65.0%",
                "high": "65.0% <= Probability < 85.0%",
                "very_high": "Probability >= 85.0%"
            },
            "calibration_status": "Calibrated Model Estimate",
            "brier_score": 0.1784,
            "training_date": "2026-08-20",
            "metrics": {
                "accuracy": 0.7346,
                "roc_auc": 0.8007,
                "precision": 0.7553,
                "recall": 0.6935,
                "f1_score": 0.7231,
                "sensitivity": 0.6935,
                "specificity": 0.7742
            },
            "global_feature_importance": [
                {"feature": "ap_hi", "display_name": "Systolic Blood Pressure", "importance": 0.38},
                {"feature": "age_years", "display_name": "Age", "importance": 0.22},
                {"feature": "cholesterol", "display_name": "Cholesterol Level", "importance": 0.14},
                {"feature": "weight", "display_name": "Weight / Body Mass Index", "importance": 0.09},
                {"feature": "ap_lo", "display_name": "Diastolic Blood Pressure", "importance": 0.07},
                {"feature": "gluc", "display_name": "Blood Glucose", "importance": 0.04},
                {"feature": "active", "display_name": "Physical Activity", "importance": 0.03},
                {"feature": "smoke", "display_name": "Smoking Status", "importance": 0.03}
            ]
        }

    def generate_counterfactual_scenario(self, norm_data: dict, current_proba: float) -> dict:
        """
        Generates actionable counterfactual AI scenario (Section 32.5 & 32.6).
        Modifies ONLY actionable/changeable variables (BP, BMI, Smoke, Activity, Cholesterol, Glucose)
        while holding immutable variables (Age, Gender, Height) strictly constant.
        """
        hypo_data = norm_data.copy()
        changed_variables = []

        # Actionable Factor 1: Systolic & Diastolic Blood Pressure
        current_sys = float(norm_data.get('ap_hi', 120))
        current_dia = float(norm_data.get('ap_lo', 80))
        if current_sys > 120 or current_dia > 80:
            hypo_data['ap_hi'] = 120.0
            hypo_data['ap_lo'] = 80.0
            changed_variables.append({
                'variable': 'Blood Pressure',
                'feature_key': 'ap_hi',
                'current': f"{int(current_sys)}/{int(current_dia)} mmHg",
                'hypothetical': "120/80 mmHg",
                'direction': 'Improved (Normal Range)'
            })

        # Actionable Factor 2: BMI / Weight
        current_bmi = float(norm_data.get('bmi', 24))
        current_weight = float(norm_data.get('weight', 70))
        height_m = float(norm_data.get('height', 165)) / 100.0
        if current_bmi > 24.9:
            hypo_bmi = 24.2
            hypo_weight = round(hypo_bmi * (height_m ** 2), 1)
            hypo_data['bmi'] = hypo_bmi
            hypo_data['weight'] = hypo_weight
            changed_variables.append({
                'variable': 'BMI / Weight',
                'feature_key': 'bmi',
                'current': f"{current_bmi:.1f} kg/m² ({int(current_weight)} kg)",
                'hypothetical': f"{hypo_bmi:.1f} kg/m² ({int(hypo_weight)} kg)",
                'direction': 'Improved (Healthy BMI)'
            })

        # Actionable Factor 3: Smoking
        current_smoke = int(norm_data.get('smoke', 0))
        if current_smoke == 1:
            hypo_data['smoke'] = 0
            changed_variables.append({
                'variable': 'Smoking Status',
                'feature_key': 'smoke',
                'current': 'Smoker',
                'hypothetical': 'Non-Smoker',
                'direction': 'Improved (Cessation)'
            })

        # Actionable Factor 4: Physical Activity
        current_active = int(norm_data.get('active', 1))
        if current_active == 0:
            hypo_data['active'] = 1
            changed_variables.append({
                'variable': 'Physical Activity',
                'feature_key': 'active',
                'current': 'Inactive',
                'hypothetical': 'Regular Activity',
                'direction': 'Improved (Active Lifestyle)'
            })

        # Actionable Factor 5: Cholesterol
        current_chol = int(norm_data.get('cholesterol', 1))
        if current_chol > 1:
            hypo_data['cholesterol'] = 1
            chol_labels = {2: 'Above Normal', 3: 'High'}
            changed_variables.append({
                'variable': 'Cholesterol Level',
                'feature_key': 'cholesterol',
                'current': chol_labels.get(current_chol, 'Elevated'),
                'hypothetical': 'Normal (< 200 mg/dL)',
                'direction': 'Improved (Optimal)'
            })

        # Actionable Factor 6: Fasting Glucose
        current_gluc = int(norm_data.get('gluc', 1))
        if current_gluc > 1:
            hypo_data['gluc'] = 1
            gluc_labels = {2: 'Above Normal', 3: 'High'}
            changed_variables.append({
                'variable': 'Blood Glucose',
                'feature_key': 'gluc',
                'current': gluc_labels.get(current_gluc, 'Elevated'),
                'hypothetical': 'Normal (< 100 mg/dL)',
                'direction': 'Improved (Optimal)'
            })

        # Run XGBoost model on hypothetical input vector
        X_hypo_df = self._preprocessor.transform(hypo_data)
        hypo_proba = float(self._model.predict_proba(X_hypo_df)[0][1])
        hypo_risk_percentage = round(hypo_proba * 100.0, 2)

        if hypo_proba < 0.35:
            hypo_level = "LOW"
        elif hypo_proba < 0.65:
            hypo_level = "MODERATE"
        elif hypo_proba < 0.85:
            hypo_level = "HIGH"
        else:
            hypo_level = "VERY HIGH"

        current_risk_percentage = round(current_proba * 100.0, 2)
        risk_delta = round(current_risk_percentage - hypo_risk_percentage, 2)

        return {
            "current_risk_percentage": current_risk_percentage,
            "hypothetical_risk_percentage": hypo_risk_percentage,
            "hypothetical_risk_level": hypo_level,
            "hypothetical_probability": round(hypo_proba, 4),
            "risk_delta_percentage": risk_delta if risk_delta > 0 else 0.0,
            "changed_variables": changed_variables,
            "safety_disclaimer": "Hypothetical model scenario — not a medical prescription. Discuss health changes with a qualified doctor."
        }

    def predict_patient_risk(self, patient_data: dict) -> dict:
        if not self.is_loaded():
            self._load_artifacts()

        norm_data = {}
        
        # Age
        if 'age_years' in patient_data:
            norm_data['age_years'] = float(patient_data['age_years'])
        elif 'age' in patient_data:
            age_val = float(patient_data['age'])
            norm_data['age_years'] = age_val / 365.25 if age_val > 100 else age_val
        else:
            raise ValueError("Age field is required.")

        norm_data['gender'] = int(patient_data.get('gender', 1))
        norm_data['height'] = float(patient_data.get('height', 165))
        norm_data['weight'] = float(patient_data.get('weight', 70))
        
        if 'bmi' in patient_data and patient_data['bmi']:
            norm_data['bmi'] = float(patient_data['bmi'])
        else:
            height_m = norm_data['height'] / 100.0
            norm_data['bmi'] = round(norm_data['weight'] / (height_m ** 2), 2)

        if 'ap_hi' in patient_data:
            norm_data['ap_hi'] = float(patient_data['ap_hi'])
        elif 'blood_pressure' in patient_data:
            norm_data['ap_hi'] = float(patient_data['blood_pressure'])
        else:
            norm_data['ap_hi'] = 120.0

        if 'ap_lo' in patient_data:
            norm_data['ap_lo'] = float(patient_data['ap_lo'])
        else:
            norm_data['ap_lo'] = round(norm_data['ap_hi'] * 0.65, 0)

        norm_data['cholesterol'] = int(patient_data.get('cholesterol', 1))
        norm_data['gluc'] = int(patient_data.get('gluc', 1))
        if norm_data['gluc'] == 0:
            norm_data['gluc'] = 1

        norm_data['smoke'] = int(patient_data.get('smoke', 0))
        norm_data['alco'] = int(patient_data.get('alco', 0))
        norm_data['active'] = int(patient_data.get('active', 1))

        # Transform using loaded preprocessor
        X_df = self._preprocessor.transform(norm_data)

        # Generate model prediction & probability
        pred_class = int(self._model.predict(X_df)[0])
        pred_proba = float(self._model.predict_proba(X_df)[0][1])
        risk_percentage = round(pred_proba * 100.0, 2)

        if pred_proba < 0.35:
            risk_level = "LOW"
        elif pred_proba < 0.65:
            risk_level = "MODERATE"
        elif pred_proba < 0.85:
            risk_level = "HIGH"
        else:
            risk_level = "VERY HIGH"

        # Generate SHAP local explanation
        shap_vals = self._explainer.shap_values(X_df)[0]
        
        shap_explanation = []
        for idx, feature_name in enumerate(self._feature_columns):
            val = float(shap_vals[idx])
            patient_val = float(X_df[feature_name].iloc[0])
            direction = "increases_risk" if val > 0 else "decreases_risk"
            human_name = HUMAN_FEATURE_NAMES.get(feature_name, feature_name)
            
            shap_explanation.append({
                "feature": feature_name,
                "human_name": human_name,
                "patient_value": patient_val,
                "contribution": round(val, 4),
                "importance": round(abs(val), 4),
                "direction": direction
            })

        shap_explanation.sort(key=lambda x: x['importance'], reverse=True)
        top_risk_factors = [item for item in shap_explanation if item['direction'] == 'increases_risk'][:5]

        # Generate Counterfactual Scenario
        counterfactual = self.generate_counterfactual_scenario(norm_data, pred_proba)

        # Retrieve Model Metadata
        metadata = self.get_model_metadata()

        return {
            "prediction": pred_class,
            "risk_level": risk_level,
            "risk_probability": round(pred_proba, 4),
            "risk_percentage": risk_percentage,
            "top_risk_factors": top_risk_factors,
            "shap_explanation": shap_explanation,
            "counterfactual_scenario": counterfactual,
            "model_metadata": metadata,
            "model_features_used": self._feature_columns
        }
