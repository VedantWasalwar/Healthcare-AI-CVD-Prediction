"""
HeartCare AI - Feature Mapping Specification

This module defines the explicit mapping between the raw Kaggle Cardiovascular Disease Dataset
columns (`ml_training/dataset/cardiovascular_dataset.csv`) and the legitimate ML feature set
used for training the XGBoost Model.

CRITICAL POLICY:
- NO synthetic patient data or fabricated values.
- NO artificial mapping of 'cholesterol' to HDL, LDL, or Triglycerides.
- NO artificial mapping of 'gluc' to HbA1c.
- NO fabricated 'family_history' field.
- The model is trained ONLY on features actually present or legitimately derived from the original dataset.
"""

# Raw dataset column names
RAW_COLUMNS = [
    'id', 'age', 'gender', 'height', 'weight',
    'ap_hi', 'ap_lo', 'cholesterol', 'gluc',
    'smoke', 'alco', 'active', 'cardio'
]

# Legitimate Model Features (12 features + 1 target)
LEGITIMATE_FEATURES = [
    'age_years',       # age in days / 365.25
    'gender',          # 1: female, 2: male
    'height',          # height in cm
    'weight',          # weight in kg
    'bmi',             # weight / (height/100)^2
    'ap_hi',           # Systolic Blood Pressure (mm Hg)
    'ap_lo',           # Diastolic Blood Pressure (mm Hg)
    'cholesterol',     # 1: normal, 2: above normal, 3: well above normal
    'gluc',            # 1: normal, 2: above normal, 3: well above normal
    'smoke',           # 0: non-smoker, 1: smoker
    'alco',            # 0: no alcohol, 1: alcohol intake
    'active'           # 0: non-active, 1: physical activity
]

TARGET_COLUMN = 'cardio' # 0: absence of CVD, 1: presence of CVD

# Feature mapping metadata
FEATURE_MAPPING = {
    'age_years': {
        'raw_source': 'age',
        'transformation': 'age / 365.25',
        'type': 'float',
        'unit': 'years',
        'description': 'Age in years derived from age in days'
    },
    'gender': {
        'raw_source': 'gender',
        'transformation': 'direct',
        'type': 'int',
        'unit': 'categorical (1=female, 2=male)',
        'description': 'Gender of patient'
    },
    'height': {
        'raw_source': 'height',
        'transformation': 'direct',
        'type': 'float',
        'unit': 'cm',
        'description': 'Height in centimeters'
    },
    'weight': {
        'raw_source': 'weight',
        'transformation': 'direct',
        'type': 'float',
        'unit': 'kg',
        'description': 'Weight in kilograms'
    },
    'bmi': {
        'raw_source': ['weight', 'height'],
        'transformation': 'weight / ((height / 100.0) ** 2)',
        'type': 'float',
        'unit': 'kg/m²',
        'description': 'Body Mass Index calculated dynamically'
    },
    'ap_hi': {
        'raw_source': 'ap_hi',
        'transformation': 'direct (filtered for invalid outliers <70 or >240)',
        'type': 'float',
        'unit': 'mm Hg',
        'description': 'Systolic Blood Pressure'
    },
    'ap_lo': {
        'raw_source': 'ap_lo',
        'transformation': 'direct (filtered for invalid outliers <40 or >160)',
        'type': 'float',
        'unit': 'mm Hg',
        'description': 'Diastolic Blood Pressure'
    },
    'cholesterol': {
        'raw_source': 'cholesterol',
        'transformation': 'direct',
        'type': 'int',
        'unit': 'categorical (1: normal, 2: above normal, 3: well above normal)',
        'description': 'Cholesterol category level'
    },
    'gluc': {
        'raw_source': 'gluc',
        'transformation': 'direct',
        'type': 'int',
        'unit': 'categorical (1: normal, 2: above normal, 3: well above normal)',
        'description': 'Glucose category level'
    },
    'smoke': {
        'raw_source': 'smoke',
        'transformation': 'direct',
        'type': 'int',
        'unit': 'binary (0=No, 1=Yes)',
        'description': 'Smoking status'
    },
    'alco': {
        'raw_source': 'alco',
        'transformation': 'direct',
        'type': 'int',
        'unit': 'binary (0=No, 1=Yes)',
        'description': 'Alcohol intake status'
    },
    'active': {
        'raw_source': 'active',
        'transformation': 'direct',
        'type': 'int',
        'unit': 'binary (0=No, 1=Yes)',
        'description': 'Physical activity status'
    }
}

EXCLUDED_UNAVAILABLE_FEATURES = [
    'HDL',
    'LDL',
    'Triglycerides',
    'HbA1c',
    'Family History'
]
