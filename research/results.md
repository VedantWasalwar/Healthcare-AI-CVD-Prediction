# HeartCare AI — Verified Experimental Results

## 1. Primary Dataset Statistics

* **Dataset Size**: 70,000 patient records
* **Class 0 (Negative / Non-CVD)**: 35,021 records (50.03%)
* **Class 1 (Positive / CVD Present)**: 34,979 records (49.97%)
* **Missing Values**: 0
* **Train/Test Split**: 80% Train (56,000) / 20% Test (14,000)

---

## 2. Multi-Model Performance Metric Evaluation

| Model Architecture | Accuracy | Precision | Recall (Sens.) | Specificity | F1-Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | 71.40% | 0.7315 | 0.6757 | 0.7523 | 0.7025 | 0.7782 |
| **Support Vector Machine (SVM)** | 64.71% | 0.6558 | 0.6186 | 0.6756 | 0.6367 | 0.7025 |
| **Deep Learning (Neural Net MLP)** | 72.35% | 0.7206 | **0.7296** | 0.7174 | 0.7251 | 0.7897 |
| **Random Forest Classifier** | 73.33% | **0.7576** | 0.6857 | **0.7808** | 0.7198 | 0.7974 |
| **XGBoost Classifier (Selected)** | **73.46%** | 0.7553 | 0.6935 | 0.7756 | **0.7231** | **0.8007** |

---

## 3. Confusion Matrix Breakdown (Test Set = 14,000 Samples)

```text
XGBoost Classifier:
┌─────────────────────────┬─────────────────────────┐
│  True Negatives (TN)   │  False Positives (FP)   │
│         5,432           │          1,572          │
├─────────────────────────┼─────────────────────────┤
│  False Negatives (FN)   │  True Positives (TP)    │
│         2,144           │          4,852          │
└─────────────────────────┴─────────────────────────┘
```

---

## 4. SHAP Feature Importance Ranking

1. **Systolic Blood Pressure (`ap_hi`)**: Global Importance $\approx 0.38$ (Primary risk driver)
2. **Age (`age_years`)**: Global Importance $\approx 0.22$
3. **Cholesterol Level (`cholesterol`)**: Global Importance $\approx 0.14$
4. **Body Mass Index (`bmi` / `weight`)**: Global Importance $\approx 0.09$
5. **Diastolic Blood Pressure (`ap_lo`)**: Global Importance $\approx 0.07$
6. **Fasting Blood Glucose (`gluc`)**: Global Importance $\approx 0.04$
7. **Physical Activity (`active`)**: Global Importance $\approx 0.03$ (Protective driver)
8. **Smoking Status (`smoke`)**: Global Importance $\approx 0.03$

---

## 5. Counterfactual AI Simulation Output

* **Initial Patient Profile**: Systolic BP = 155 mmHg, Diastolic BP = 95 mmHg, BMI = 29.1 kg/m², Smoker = 1.
* **Initial Predicted Risk**: **68.4% (HIGH RISK)**
* **Counterfactual Optimization Vector**:
  - `ap_hi`: 155 mmHg $\to$ 120 mmHg (Normal Range)
  - `ap_lo`: 95 mmHg $\to$ 80 mmHg (Normal Range)
  - `bmi`: 29.1 kg/m² $\to$ 24.2 kg/m² (Healthy Range)
  - `smoke`: Smoker (1) $\to$ Non-Smoker (0)
* **Hypothetical Model Risk**: **42.7% (MODERATE RISK)**
* **Simulated Risk Reduction Delta**: **-25.7%**
