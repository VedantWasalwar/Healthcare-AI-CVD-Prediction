# HeartCare AI — Verified Publication-Ready Tables

## Table I: Dataset Characteristics
| Metric / Attribute | Value / Specification |
| :--- | :--- |
| **Dataset Source** | Cardiovascular Disease Clinical Dataset |
| **Dataset File Path** | `backend/ml/dataset/cardiovascular_dataset.csv` |
| **Total Instances (Rows)** | 70,000 Patient Records |
| **Total Feature Columns** | 13 (12 Clinical Inputs + 1 Binary Target) |
| **Target Variable** | `cardio` (0: Non-CVD, 1: CVD Present) |
| **Class Distribution** | Class 0: 35,021 (50.03%) | Class 1: 34,979 (49.97%) |
| **Missing Values** | 0 Across All Attributes |

---

## Table II: Feature Specifications & Preprocessing Rules
| Feature Key | Feature Name | Data Type | Clinical Range / Values | Preprocessing Rule |
| :--- | :--- | :--- | :--- | :--- |
| `age_years` | Age | Float | 29.56 – 64.92 Years | Converted from days ($\text{age} / 365.25$) |
| `gender` | Sex | Categorical | 1: Female, 2: Male | Preserved categorical encoding |
| `height` | Stature | Float | 55.0 – 250.0 cm | Outlier bounds check |
| `weight` | Body Mass | Float | 10.0 – 200.0 kg | Outlier bounds check |
| `bmi` | Body Mass Index | Float | 10.0 – 60.0 $\text{kg/m}^2$ | Derived ($\text{weight} / (\text{height}/100)^2$) |
| `ap_hi` | Systolic BP | Float | 70 – 240 mmHg | Clipped physiological range |
| `ap_lo` | Diastolic BP | Float | 40 – 160 mmHg | Clipped physiological range |
| `cholesterol` | Cholesterol Level | Ordinal | 1: Normal, 2: Above Normal, 3: High | Level encoding |
| `gluc` | Fasting Glucose | Ordinal | 1: Normal, 2: Above Normal, 3: High | Level encoding |
| `smoke` | Smoking Status | Binary | 0: Non-Smoker, 1: Smoker | Binary flag |
| `alco` | Alcohol Intake | Binary | 0: No, 1: Yes | Binary flag |
| `active` | Physical Activity | Binary | 0: Inactive, 1: Active | Binary flag |

---

## Table III: Evaluated Machine Learning & Deep Learning Architectures
| Model Architecture | Implementation Framework | Core Config / Solver | Selection Status |
| :--- | :--- | :--- | :--- |
| **Logistic Regression** | Scikit-Learn `LogisticRegression` | `max_iter=1000, solver='lbfgs'` | Baseline |
| **Support Vector Machine (SVM)** | Scikit-Learn `CalibratedClassifierCV(LinearSVC)` | `kernel='linear', max_iter=1000` | Evaluated |
| **Random Forest Classifier** | Scikit-Learn `RandomForestClassifier` | `n_estimators=100, max_depth=10` | Runner-up |
| **Deep Learning (Neural Net MLP)** | Scikit-Learn `MLPClassifier` | `hidden_layer_sizes=(64, 32)` | Evaluated |
| **XGBoost Classifier** | XGBoost `XGBClassifier` | `n_estimators=150, max_depth=5, lr=0.05` | **BEST MODEL** |

---

## Table IV: Experimental Configuration Parameters
| Parameter | Value / Setting |
| :--- | :--- |
| **Dataset Train/Test Split** | 80% Training (56,000) / 20% Testing (14,000) |
| **Sampling Method** | Stratified Random Splitting |
| **Random Seed** | 42 |
| **Cross-Validation / Evaluation** | Holdout Test Set Evaluation + Outlier Clipping |
| **Hardware Environment** | Intel Core i7 / 16GB RAM / Windows OS |

---

## Table V: Multi-Model Performance Metric Comparison
| Model Architecture | Accuracy | Precision | Recall (Sens.) | Specificity | F1-Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | 71.40% | 0.7315 | 0.6757 | 0.7523 | 0.7025 | 0.7782 |
| **Support Vector Machine (SVM)** | 64.71% | 0.6558 | 0.6186 | 0.6756 | 0.6367 | 0.7025 |
| **Deep Learning (Neural Net MLP)** | 72.35% | 0.7206 | **0.7296** | 0.7174 | 0.7251 | 0.7897 |
| **Random Forest Classifier** | 73.33% | **0.7576** | 0.6857 | **0.7808** | 0.7198 | 0.7974 |
| **XGBoost Classifier (Selected)** | **73.46%** | 0.7553 | 0.6935 | 0.7756 | **0.7231** | **0.8007** |

---

## Table VI: Confusion Matrix Breakdown (Test Set N = 14,000)
| Model Architecture | True Negatives (TN) | False Positives (FP) | False Negatives (FN) | True Positives (TP) |
| :--- | :---: | :---: | :---: | :---: |
| **XGBoost Classifier** | **5,432** | **1,572** | **2,144** | **4,852** |
| **Random Forest Classifier** | 5,469 | 1,535 | 2,199 | 4,797 |
| **Deep Learning MLP** | 5,025 | 1,979 | 1,892 | 5,104 |
| **Logistic Regression** | 5,269 | 1,735 | 2,269 | 4,727 |
| **Support Vector Machine (SVM)** | 4,732 | 2,272 | 2,668 | 4,328 |

---

## Table VII: Actionable Counterfactual Simulation Example
| Actionable Parameter | Initial Patient Value | Hypothetical Target | Direction & Clinical Rationale |
| :--- | :--- | :--- | :--- |
| **Systolic BP (`ap_hi`)** | 155 mmHg | 120 mmHg | Improved (Normal Systolic Target) |
| **Diastolic BP (`ap_lo`)** | 95 mmHg | 80 mmHg | Improved (Normal Diastolic Target) |
| **Body Mass Index (`bmi`)** | 29.1 $\text{kg/m}^2$ | 24.2 $\text{kg/m}^2$ | Improved (Healthy Weight Boundary) |
| **Smoking Status (`smoke`)** | Smoker (1) | Non-Smoker (0) | Improved (Cessation Impact) |
| **Resulting Model Risk Score** | **68.4% (HIGH RISK)** | **42.7% (MODERATE)** | **Simulated Delta Reduction: -25.7%** |
