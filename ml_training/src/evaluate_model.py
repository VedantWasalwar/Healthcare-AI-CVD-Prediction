import json
import matplotlib.pyplot as plt
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    ConfusionMatrixDisplay,
    roc_curve,
    classification_report
)
from ml_training.src.config import (
    METRICS_SAVE_PATH,
    CONFUSION_MATRIX_PATH,
    ROC_CURVE_PATH
)

def evaluate_cvd_model(model, X_test, y_test):
    """
    Evaluates the XGBoost model on the test dataset.
    Calculates Accuracy, Precision, Recall, F1, ROC-AUC, prints classification report,
    and generates visual metric plots.
    """
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    auc = float(roc_auc_score(y_test, y_proba))
    
    metrics = {
        'accuracy': round(acc, 4),
        'precision': round(prec, 4),
        'recall': round(rec, 4),
        'f1_score': round(f1, 4),
        'roc_auc': round(auc, 4),
        'num_test_samples': int(len(y_test))
    }
    
    print("\n================ MODEL EVALUATION METRICS ================")
    print(f"Accuracy  : {acc:.4f} ({acc * 100:.2f}%)")
    print(f"Precision : {prec:.4f}")
    print(f"Recall    : {rec:.4f}")
    print(f"F1-score  : {f1:.4f}")
    print(f"ROC-AUC   : {auc:.4f}")
    print("==========================================================")
    
    print("\n--- CLASSIFICATION REPORT ---")
    cls_report_str = classification_report(y_test, y_pred, target_names=['No CVD (0)', 'CVD Present (1)'])
    print(cls_report_str)
    
    # Save metrics JSON
    with open(METRICS_SAVE_PATH, 'w', encoding='utf-8') as f:
        json.dump(metrics, f, indent=4)
    print(f"Saved metrics to: {METRICS_SAVE_PATH}")
    
    # 1. Confusion Matrix Plot
    fig, ax = plt.subplots(figsize=(6, 5))
    cm = confusion_matrix(y_test, y_pred)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=['No CVD', 'CVD Present'])
    disp.plot(cmap='Blues', ax=ax, values_format='d')
    ax.set_title('Confusion Matrix - HeartCare AI XGBoost Model')
    plt.tight_layout()
    plt.savefig(CONFUSION_MATRIX_PATH, dpi=300)
    plt.close()
    print(f"Saved confusion matrix plot to: {CONFUSION_MATRIX_PATH}")
    
    # 2. ROC Curve Plot
    fpr, tpr, _ = roc_curve(y_test, y_proba)
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.plot(fpr, tpr, color='#1e88e5', lw=2, label=f'XGBoost ROC (AUC = {auc:.4f})')
    ax.plot([0, 1], [0, 1], color='gray', linestyle='--')
    ax.set_xlabel('False Positive Rate')
    ax.set_ylabel('True Positive Rate')
    ax.set_title('ROC Curve - HeartCare AI Model')
    ax.legend(loc='lower right')
    plt.tight_layout()
    plt.savefig(ROC_CURVE_PATH, dpi=300)
    plt.close()
    print(f"Saved ROC curve plot to: {ROC_CURVE_PATH}")
    
    return metrics
