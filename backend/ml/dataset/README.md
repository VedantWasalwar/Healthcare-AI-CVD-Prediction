# Cardiovascular Disease Dataset

## Dataset Details
- **Dataset Name**: Kaggle Cardiovascular Disease Dataset
- **Exact Path**: `backend/ml/dataset/cardiovascular_dataset.csv`
- **Rows**: 70,000 patient records
- **Columns**: 13 (12 features + 1 target)
- **Missing Values**: 0
- **Duplicate Rows**: 0

## Schema & Features

| Feature Name | Type | Unit / Encoding | Description |
|---|---|---|---|
| `id` | Integer | ID | Patient unique identifier (Dropped from model training) |
| `age` | Integer | Days | Patient age in days (Transformed to `age_years = age / 365.25`) |
| `gender` | Categorical | 1: Female, 2: Male | Patient biological sex |
| `height` | Continuous | cm | Patient height in centimeters |
| `weight` | Continuous | kg | Patient weight in kilograms |
| `bmi` | Derived | kg/m² | Body Mass Index calculated as `weight / (height / 100)^2` |
| `ap_hi` | Continuous | mmHg | Systolic blood pressure |
| `ap_lo` | Continuous | mmHg | Diastolic blood pressure |
| `cholesterol` | Categorical | 1: Normal, 2: Above Normal, 3: Well Above Normal | Serum cholesterol level category |
| `gluc` | Categorical | 1: Normal, 2: Above Normal, 3: Well Above Normal | Fasting glucose level category |
| `smoke` | Binary | 0: No, 1: Yes | Current smoking status |
| `alco` | Binary | 0: No, 1: Yes | Regular alcohol intake |
| `active` | Binary | 0: No, 1: Yes | Regular physical activity |
| **`cardio`** | **Binary (Target)** | **0: Absence, 1: Presence** | **Cardiovascular disease target variable** |

## Target Distribution
- **Class 0 (No CVD)**: 35,021 samples (50.03%)
- **Class 1 (CVD Present)**: 34,979 samples (49.97%)

## Model Preprocessing & Features
Training uses 12 validated features:
`['age_years', 'gender', 'height', 'weight', 'bmi', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active']`

## Disclaimer & Limitations
This dataset and model are developed strictly for educational decision-support research. They do not constitute a clinical medical diagnosis.
