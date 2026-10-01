import os
import json
import joblib
import pandas as pd
from ml_training.src.config import (
    MODEL_SAVE_PATH,
    PREPROCESSOR_SAVE_PATH,
    FEATURE_COLUMNS_SAVE_PATH,
    METRICS_SAVE_PATH,
    SHAP_SUMMARY_PATH,
    FEATURE_COLUMNS,
    TARGET_COLUMN
)
from ml_training.src.data_loader import load_raw_dataset, inspect_dataset_summary
from ml_training.src.train_model import train_cvd_xgboost_model
from ml_training.src.evaluate_model import evaluate_cvd_model
from ml_training.src.explain_model import generate_shap_summary_plot, explain_patient_prediction

def run_full_ml_pipeline():
    """
    Executes the entire end-to-end ML pipeline:
    1. Data Loading & Validation
    2. Preprocessing & XGBoost Model Training
    3. Model Evaluation (Metrics & Visual plots)
    4. SHAP Explainability (Summary plot & Individual explainability)
    5. Independent Saved Model Verification
    """
    print("==========================================================================")
    print("      HEARTCARE AI - ML TRAINING & EVALUATION PIPELINE RUNNER            ")
    print("==========================================================================")
    
    # STEP 1: DATA LOADING
    print("\n--- STEP 1: DATA LOADING & VALIDATION ---")
    df_raw = load_raw_dataset()
    data_summary = inspect_dataset_summary(df_raw)
    print(f"Dataset Loaded Successfully!")
    print(f"Raw Dataset Shape : {df_raw.shape[0]} rows, {df_raw.shape[1]} columns")
    print(f"Raw Columns       : {data_summary['column_names']}")
    print(f"Missing Values    : {sum(data_summary['missing_values'].values())}")
    print(f"Duplicates        : {data_summary['duplicate_records']}")
    print(f"Target Distribution: {data_summary['target_distribution']}")
    print(f"OutlierCounts     : {data_summary['invalid_outliers']}")
    
    # STEP 2 & 3: PREPROCESSING & TRAINING
    print("\n--- STEP 2 & 3: PREPROCESSING & XGBOOST MODEL TRAINING ---")
    model, preprocessor, X_train, X_test, y_train, y_test = train_cvd_xgboost_model()
    
    # STEP 4: MODEL EVALUATION
    print("\n--- STEP 4: MODEL EVALUATION ---")
    metrics = evaluate_cvd_model(model, X_test, y_test)
    
    # STEP 5: SHAP EXPLAINABILITY
    print("\n--- STEP 5: SHAP EXPLAINABILITY GENERATION ---")
    explainer = generate_shap_summary_plot(model, X_train)
    
    # STEP 6: TEST SAVED MODEL INDEPENDENTLY
    print("\n--- STEP 6: TEST SAVED MODEL INDEPENDENTLY ---")
    print("Loading saved model artifacts from disk...")
    loaded_model = joblib.load(MODEL_SAVE_PATH)
    loaded_preprocessor = joblib.load(PREPROCESSOR_SAVE_PATH)
    with open(FEATURE_COLUMNS_SAVE_PATH, 'r', encoding='utf-8') as f:
        loaded_features = json.load(f)
        
    # Take one real record from test set
    sample_raw_record = X_test.iloc[[0]].to_dict(orient='records')[0]
    print(f"Testing on sample real patient record:\n  {sample_raw_record}")
    
    # Preprocess through loaded preprocessor
    processed_df = loaded_preprocessor.transform(sample_raw_record)
    
    # Predict
    pred_class = int(loaded_model.predict(processed_df)[0])
    pred_prob = float(loaded_model.predict_proba(processed_df)[0][1])
    
    # Generate SHAP explanation
    shap_explanation = explain_patient_prediction(loaded_model, processed_df)
    
    print("\n--- VERIFICATION TEST RESULT ---")
    print(f"Predicted Class       : {pred_class} ({'CVD Present' if pred_class == 1 else 'No CVD'})")
    print(f"Risk Probability Score: {pred_prob:.4f} ({pred_prob * 100:.2f}%)")
    print("Top 5 Risk Factors (SHAP Explanation):")
    for item in shap_explanation[:5]:
        print(f"  - Feature: {item['feature']:<12} | Patient Val: {item['patient_value']:<6} | SHAP: {item['shap_value']:>7.4f} | Direction: {item['direction']}")
        
    print("\n==========================================================================")
    print("                 ML TRAINING PIPELINE COMPLETED SUCCESSFULLY               ")
    print("==========================================================================")
    
    # Print Final Summary Block requested by user
    print("\nFINAL SUMMARY REPORT:")
    print(f"Dataset shape              : ({df_raw.shape[0]}, {df_raw.shape[1]})")
    print(f"Final feature list ({len(loaded_features)}): {loaded_features}")
    print(f"Target distribution        : {data_summary['target_distribution']}")
    print(f"Number of training samples : {X_train.shape[0]}")
    print(f"Number of testing samples  : {X_test.shape[0]}")
    print(f"Accuracy                   : {metrics['accuracy']:.4f} ({metrics['accuracy']*100:.2f}%)")
    print(f"Precision                  : {metrics['precision']:.4f}")
    print(f"Recall                     : {metrics['recall']:.4f}")
    print(f"F1-score                   : {metrics['f1_score']:.4f}")
    print(f"ROC-AUC                    : {metrics['roc_auc']:.4f}")
    print(f"Model file path            : {MODEL_SAVE_PATH}")
    print(f"Preprocessor file path     : {PREPROCESSOR_SAVE_PATH}")
    print(f"Feature columns file path  : {FEATURE_COLUMNS_SAVE_PATH}")
    print(f"SHAP result path           : {SHAP_SUMMARY_PATH}")

if __name__ == '__main__':
    run_full_ml_pipeline()
