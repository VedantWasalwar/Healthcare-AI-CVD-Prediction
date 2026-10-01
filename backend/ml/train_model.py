import os
import sys
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.neural_network import MLPClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

# Add backend directory to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from ml.preprocessing import CVDDataPreprocessor

def train_and_evaluate():
    print("==========================================================================")
    print("      HEARTCARE AI — ML/DL MODEL COMPARISON & TRAINING PIPELINE           ")
    print("==========================================================================")

    # 1. Locate Dataset
    possible_paths = [
        os.path.join(BASE_DIR, 'ml', 'dataset', 'cardiovascular_dataset.csv'),
        os.path.join(os.path.dirname(BASE_DIR), 'ml_training', 'dataset', 'cardiovascular_dataset.csv'),
    ]

    dataset_path = None
    for p in possible_paths:
        if os.path.exists(p):
            dataset_path = p
            break

    if not dataset_path:
        raise FileNotFoundError(f"Cardiovascular dataset not found in expected paths: {possible_paths}")

    print(f"\n[1] Loading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path, sep=None, engine='python')
    print(f"    Loaded {df.shape[0]} rows and {df.shape[1]} columns successfully.")

    # 2. Validate Raw Columns & Preprocess
    print("\n[2] Validating columns & applying preprocessing...")
    preprocessor = CVDDataPreprocessor()
    preprocessor.validate_raw_columns(df)

    X = preprocessor.fit_transform(df)
    y = df['cardio'].values

    print(f"    Features shape: {X.shape}")
    print(f"    Target shape: {y.shape}")
    print(f"    Feature columns: {list(X.columns)}")

    # 3. Train / Test Split
    print("\n[3] Splitting train/test data (80% train, 20% test)...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # 4. Model Training & Comparison (Logistic Regression, Random Forest, SVM, XGBoost, Deep Learning MLP)
    print("\n[4] Training ML & Deep Learning Models...")

    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10, n_jobs=-1),
        'Support Vector Machine (SVM)': CalibratedClassifierCV(LinearSVC(max_iter=1000, random_state=42)),
        'XGBoost Classifier': XGBClassifier(
            n_estimators=150,
            max_depth=5,
            learning_rate=0.05,
            random_state=42,
            eval_metric='logloss',
            n_jobs=-1
        ),
        'Deep Learning (Neural Net MLP)': MLPClassifier(
            hidden_layer_sizes=(64, 32),
            max_iter=200,
            random_state=42,
            early_stopping=True
        )
    }

    best_name = None
    best_model = None
    best_score = 0.0
    evaluation_results = {}

    for name, model in models.items():
        print(f"\n    Training {name}...")
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        probs = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else preds

        acc = float(accuracy_score(y_test, preds))
        prec = float(precision_score(y_test, preds))
        rec = float(recall_score(y_test, preds))
        f1 = float(f1_score(y_test, preds))
        auc = float(roc_auc_score(y_test, probs))

        tn, fp, fn, tp = confusion_matrix(y_test, preds).ravel()
        specificity = float(tn / (tn + fp))

        evaluation_results[name] = {
            'Accuracy': round(acc, 4),
            'Precision': round(prec, 4),
            'Recall': round(rec, 4),
            'Sensitivity': round(rec, 4),
            'Specificity': round(specificity, 4),
            'F1_Score': round(f1, 4),
            'ROC_AUC': round(auc, 4),
            'Confusion_Matrix': {
                'TN': int(tn),
                'FP': int(fp),
                'FN': int(fn),
                'TP': int(tp)
            }
        }

        print(f"    Results for {name}:")
        print(f"    - Accuracy:    {acc:.4f}")
        print(f"    - Precision:   {prec:.4f}")
        print(f"    - Recall/Sens: {rec:.4f}")
        print(f"    - Specificity: {specificity:.4f}")
        print(f"    - F1 Score:    {f1:.4f}")
        print(f"    - ROC-AUC:     {auc:.4f}")

        if acc > best_score or (best_name is None):
            best_score = acc
            best_name = name
            best_model = model

    print("\n==========================================================================")
    print(f"  BEST MODEL SELECTED: {best_name} (Accuracy: {best_score:.4f})")
    print("==========================================================================")

    # 5. Save Artifacts & Comparison Results
    target_dirs = [
        os.path.join(BASE_DIR, 'ml', 'model'),
        os.path.join(BASE_DIR, 'ml_models')
    ]

    for d in target_dirs:
        os.makedirs(d, exist_ok=True)
        
        # Save primary model
        model_path_primary = os.path.join(d, 'cardiovascular_model.pkl')
        model_path_alias = os.path.join(d, 'xgboost_cvd_model.pkl')
        joblib.dump(best_model, model_path_primary)
        joblib.dump(best_model, model_path_alias)

        # Save preprocessor
        prep_path = os.path.join(d, 'preprocessor.pkl')
        joblib.dump(preprocessor, prep_path)

        # Save feature columns
        feat_path = os.path.join(d, 'feature_columns.json')
        with open(feat_path, 'w', encoding='utf-8') as f:
            json.dump(CVDDataPreprocessor.FEATURE_COLUMNS, f, indent=2)

        # Save comparison evaluation report for Doctor/Research API
        comp_path = os.path.join(d, 'model_comparison.json')
        with open(comp_path, 'w', encoding='utf-8') as f:
            json.dump({
                "selected_best_model": best_name,
                "best_accuracy": best_score,
                "dataset_records": int(df.shape[0]),
                "training_split": "80/20 Stratified Train/Test",
                "evaluation_results": evaluation_results
            }, f, indent=2)

        print(f"[+] Artifacts saved to: {d}")

    print("\n[SUCCESS] ML Pipeline training, multi-model evaluation, and artifact export completed!")

if __name__ == '__main__':
    train_and_evaluate()
