# HeartCare AI — System Methodology & Workflow Architecture

## 1. System Pipeline Architecture

```text
[ PATIENT INPUT / LAB REPORT UPLOAD ]
                  │
                  ▼
      [ DATA VALIDATION & OCR ]
  (Tesseract / pdfplumber / Input Bounds)
                  │
                  ▼
    [ PREPROCESSING & SCALING ]
  (CVDDataPreprocessor: BMI, Age Years)
                  │
                  ▼
 [ XGBoost ML & DL INFERENCE ENGINE ]
     (73.46% Acc, 0.8007 ROC-AUC)
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 [ RISK PERCENTAGE ]  [ RISK CATEGORY ]
 (0.0% - 100.0%)     (LOW/MOD/HIGH/VERY HIGH)
        │                   │
        └─────────┬─────────┘
                  │
                  ▼
    [ EXPLAINABLE AI (XAI) ENGINE ]
                  │
   ┌──────────────┴──────────────┐
   ▼                             ▼
[ SHAP LOCAL IMPACT ]   [ COUNTERFACTUAL SIMULATION ]
(TreeExplainer Values)   (Actionable Vector Optimization)
   │                             │
   └──────────────┬──────────────┘
                  │
                  ▼
[ CLINICAL DECISION-SUPPORT GUIDANCE ]
(Non-Pharmacological Guidance & Warning Cards)
                  │
   ┌──────────────┼──────────────┐
   ▼              ▼              ▼
[ REPORTLAB PDF ] [ DOCTOR DIRECTORY ] [ MULTIMODAL CHATBOT ]
 (A4 Summary)   (Cardiologist Match) (Text/Voice/Medicine OCR)
```

---

## 2. Methodological Process Steps

### Step 1: Patient Data Acquisition & Validation
* **Manual Input**: Validates 12 clinical parameters against physiological bounds ($18 \le \text{age} \le 120$, $70 \le \text{ap\_hi} \le 240$, $40 \le \text{ap\_lo} \le 160$).
* **OCR Lab Report Upload**: Scans uploaded PDF/JPG/PNG documents using `pdfplumber` and `PyTesseract`, extracting blood pressure, cholesterol, glucose, and BMI entities while overlaying clinical fallbacks.

### Step 2: Feature Transformation & Preprocessing
* Executes `CVDDataPreprocessor.fit_transform()` converting age in days to years ($\text{age} / 365.25$) and deriving Body Mass Index ($\text{BMI} = \text{weight} / \text{height}^2$).

### Step 3: Machine Learning & Risk Scoring
* Feeds 12 scaled features into the trained `XGBoost Classifier` model (`xgboost_cvd_model.pkl`), producing continuous risk probability $P(\text{CVD}) \in [0, 1]$ and percentage ($P \times 100\%$).
* Categorizes risk into 4 tiers: `LOW` ($P < 0.35$), `MODERATE` ($0.35 \le P < 0.65$), `HIGH` ($0.65 \le P < 0.85$), `VERY HIGH` ($P \ge 0.85$).

### Step 4: SHAP Explainability Computation
* Runs `shap.TreeExplainer` on the XGBoost tree ensemble to extract exact Shapley feature impact values for every individual prediction, quantifying how much each variable increased or decreased risk.

### Step 5: Actionable Counterfactual Optimization
* Generates a hypothetical model scenario by optimizing actionable parameters (`ap_hi`, `ap_lo`, `bmi`, `weight`, `smoke`, `active`, `cholesterol`, `gluc`) towards optimal targets while keeping immutable variables (`age`, `gender`) strictly constant.

### Step 6: Clinical Decision Support & Export
* Generates categorized non-pharmacological recommendations, matches risk severity to doctor specialties (Cardiologist vs GP), and exports publication-quality A4 PDF reports via `ReportLab`.
