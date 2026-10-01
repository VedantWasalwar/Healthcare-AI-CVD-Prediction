import os

# Base Directories
SRC_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(SRC_DIR, '..'))

DATASET_PATH = os.path.join(BASE_DIR, 'dataset', 'cardiovascular_dataset.csv')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
RESULTS_DIR = os.path.join(BASE_DIR, 'results')

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

MODEL_SAVE_PATH = os.path.join(MODELS_DIR, 'xgboost_cvd_model.pkl')
PREPROCESSOR_SAVE_PATH = os.path.join(MODELS_DIR, 'preprocessor.pkl')
FEATURE_COLUMNS_SAVE_PATH = os.path.join(MODELS_DIR, 'feature_columns.json')

METRICS_SAVE_PATH = os.path.join(RESULTS_DIR, 'metrics.json')
CONFUSION_MATRIX_PATH = os.path.join(RESULTS_DIR, 'confusion_matrix.png')
ROC_CURVE_PATH = os.path.join(RESULTS_DIR, 'roc_curve.png')
SHAP_SUMMARY_PATH = os.path.join(RESULTS_DIR, 'shap_summary.png')

# Model Features & Target
FEATURE_COLUMNS = [
    'age_years',
    'gender',
    'height',
    'weight',
    'bmi',
    'ap_hi',
    'ap_lo',
    'cholesterol',
    'gluc',
    'smoke',
    'alco',
    'active'
]

TARGET_COLUMN = 'cardio'

# Outlier filtering rules for data cleaning
OUTLIER_BOUNDS = {
    'ap_hi': (70, 240),
    'ap_lo': (40, 160),
    'height': (100, 220),
    'weight': (30, 250)
}
