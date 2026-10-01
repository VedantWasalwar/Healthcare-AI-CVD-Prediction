import json
import joblib
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from ml_training.src.config import (
    MODEL_SAVE_PATH,
    PREPROCESSOR_SAVE_PATH,
    FEATURE_COLUMNS_SAVE_PATH,
    FEATURE_COLUMNS
)
from ml_training.src.data_loader import load_raw_dataset
from ml_training.src.preprocessing import clean_and_preprocess_training_data

def train_cvd_xgboost_model(drop_outliers=True, test_size=0.2, random_state=42):
    """
    Trains the XGBoost Classifier on the 12 legitimate dataset features.
    Saves xgboost_cvd_model.pkl, preprocessor.pkl, and feature_columns.json.
    """
    print("Loading raw CSV dataset...")
    df_raw = load_raw_dataset()
    
    print("Preprocessing data and filtering extreme physiological outliers...")
    X, y, preprocessor = clean_and_preprocess_training_data(df_raw, drop_outlier_rows=drop_outliers)
    
    print(f"Dataset after outlier cleaning: {X.shape[0]} rows, {X.shape[1]} features.")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=y
    )
    
    print(f"Training split: {X_train.shape[0]} samples. Testing split: {X_test.shape[0]} samples.")
    
    print("Training XGBoost Classifier...")
    model = XGBClassifier(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=random_state,
        eval_metric='logloss'
    )
    
    model.fit(X_train, y_train)
    
    print("Saving model artifacts...")
    joblib.dump(model, MODEL_SAVE_PATH)
    joblib.dump(preprocessor, PREPROCESSOR_SAVE_PATH)
    
    with open(FEATURE_COLUMNS_SAVE_PATH, 'w', encoding='utf-8') as f:
        json.dump(FEATURE_COLUMNS, f, indent=4)
        
    print(f"Artifacts successfully saved to:\n  - Model: {MODEL_SAVE_PATH}\n  - Preprocessor: {PREPROCESSOR_SAVE_PATH}\n  - Feature Columns: {FEATURE_COLUMNS_SAVE_PATH}")
    
    return model, preprocessor, X_train, X_test, y_train, y_test

if __name__ == '__main__':
    train_cvd_xgboost_model()
