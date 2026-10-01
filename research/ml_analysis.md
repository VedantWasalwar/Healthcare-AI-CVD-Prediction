# HeartCare AI — Machine Learning & Deep Learning Comparative Analysis

## 1. Experimental Setup & Validation Strategy

* **Training Script**: [`backend/ml/train_model.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/ml/train_model.py)
* **Dataset Size**: 70,000 Verified Patient Records
* **Train/Test Split**: 80% Training (56,000 samples), 20% Testing (14,000 samples)
* **Sampling Method**: Stratified Random Splitting (preserving 50/50 class balance)
* **Random Seed**: `42` (ensuring 100% experiment reproducibility)
* **Output Experiment File**: [`backend/ml_models/model_comparison.json`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/ml_models/model_comparison.json)

---

## 2. Comparative Model Performance Metrics

| Model Architecture | Accuracy | Precision | Recall (Sens.) | Specificity | F1-Score | ROC-AUC | Selection Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | 71.40% | 0.7315 | 0.6757 | 0.7523 | 0.7025 | 0.7782 | Baseline |
| **Support Vector Machine (SVM)** | 64.71% | 0.6558 | 0.6186 | 0.6756 | 0.6367 | 0.7025 | Evaluated |
| **Deep Learning (Neural Net MLP)** | 72.35% | 0.7206 | **0.7296** | 0.7174 | 0.7251 | 0.7897 | Evaluated |
| **Random Forest Classifier** | 73.33% | **0.7576** | 0.6857 | **0.7808** | 0.7198 | 0.7974 | Runner-up |
| **XGBoost Classifier** | **73.46%** | 0.7553 | 0.6935 | 0.7756 | **0.7231** | **0.8007** | **BEST MODEL** |

---

## 3. Detailed Confusion Matrix Analysis (Test Set = 14,000 Samples)

### 3.1 XGBoost Classifier (Best Selected Model)
* **True Negatives (TN)**: 5,432 (Correctly identified non-CVD patients)
* **False Positives (FP)**: 1,572 (Healthy patients flagged as risk)
* **False Negatives (FN)**: 2,144 (CVD patients missed)
* **True Positives (TP)**: 4,852 (Correctly identified CVD cases)

### 3.2 Deep Learning Neural Net MLP
* **True Negatives (TN)**: 5,025
* **False Positives (FP)**: 1,979
* **False Negatives (FN)**: 1,892
* **True Positives (TP)**: 5,104

### 3.3 Random Forest Classifier
* **True Negatives (TN)**: 5,469
* **False Positives (FP)**: 1,535
* **False Negatives (FN)**: 2,199
* **True Positives (TP)**: 4,797

---

## 4. Hyperparameter Specifications

1. **XGBoost Classifier**:
   - `n_estimators`: 150
   - `max_depth`: 5
   - `learning_rate`: 0.05
   - `eval_metric`: `logloss`
   - `random_state`: 42

2. **Deep Learning Neural Net (MLP)**:
   - `hidden_layer_sizes`: `(64, 32)`
   - `max_iter`: 200
   - `early_stopping`: True
   - `random_state`: 42

3. **Random Forest Classifier**:
   - `n_estimators`: 100
   - `max_depth`: 10
   - `random_state`: 42
