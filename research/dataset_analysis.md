# HeartCare AI — Verified Dataset Analysis Report

## 1. Dataset Overview & Source Identification

* **Dataset File Path**: [`backend/ml/dataset/cardiovascular_dataset.csv`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/ml/dataset/cardiovascular_dataset.csv)
* **Secondary Mirror Path**: `ml_training/dataset/cardiovascular_dataset.csv`
* **Total Instances (Rows)**: **70,000** verified patient records
* **Total Features (Columns)**: **13** raw features (12 clinical inputs + 1 binary target)
* **Missing Values**: **0** missing values across all 70,000 rows
* **Target Variable**: `cardio` (Binary Classification: `0` = Absence of CVD, `1` = Presence of CVD)
* **Class Distribution**:
  - Class `0` (Negative / Normal): **35,021 records (50.03%)**
  - Class `1` (Positive / CVD Present): **34,979 records (49.97%)**
  - *Class Balance*: Perfectly balanced binary target (Imbalance Ratio $\approx 1.0012$).

---

## 2. Raw Feature Specifications & Summary Statistics

| Feature Name | Data Type | Clinical Domain | Mean | Std Dev | Min | Median (50%) | Max | Verification Source |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `id` | Integer | Patient Identifier | 49972.42 | 28851.30 | 0.0 | 50001.5 | 99999.0 | Dataset CSV |
| `age` | Integer | Patient Age (Days) | 19468.87 | 2467.25 | 10798.0 | 19703.0 | 23713.0 | Dataset CSV |
| `gender` | Categorical | Sex (1: Female, 2: Male) | 1.35 | 0.48 | 1.0 | 1.0 | 2.0 | Dataset CSV |
| `height` | Float | Stature (cm) | 164.36 | 8.21 | 55.0 | 165.0 | 250.0 | Dataset CSV |
| `weight` | Float | Body Mass (kg) | 74.21 | 14.40 | 10.0 | 72.0 | 200.0 | Dataset CSV |
| `ap_hi` | Float | Systolic BP (mmHg) | 128.82 | 154.01 | -150.0 | 120.0 | 16020.0 | Dataset CSV |
| `ap_lo` | Float | Diastolic BP (mmHg) | 96.63 | 188.47 | -70.0 | 80.0 | 11000.0 | Dataset CSV |
| `cholesterol` | Ordinal | Blood Lipid (1-3) | 1.37 | 0.68 | 1.0 | 1.0 | 3.0 | Dataset CSV |
| `gluc` | Ordinal | Fasting Sugar (1-3) | 1.23 | 0.57 | 1.0 | 1.0 | 3.0 | Dataset CSV |
| `smoke` | Binary | Active Smoker (0/1) | 0.088 | 0.283 | 0.0 | 0.0 | 1.0 | Dataset CSV |
| `alco` | Binary | Alcohol Use (0/1) | 0.054 | 0.226 | 0.0 | 0.0 | 1.0 | Dataset CSV |
| `active` | Binary | Physical Activity (0/1) | 0.804 | 0.397 | 0.0 | 1.0 | 1.0 | Dataset CSV |
| `cardio` | Binary Target | CVD Presence (0/1) | 0.4997 | 0.5000 | 0.0 | 0.0 | 1.0 | Dataset CSV |

---

## 3. Data Preprocessing & Feature Engineering Pipeline

Preprocessed via `CVDDataPreprocessor` in [`backend/ml/preprocessing.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/ml/preprocessing.py):

1. **Age Conversion**:
   $$\text{age\_years} = \frac{\text{age}}{365.25}$$
   Converts age from days to decimal years (Range: 29.56 years to 64.92 years; Mean: 53.30 years).

2. **Body Mass Index (BMI) Derivation**:
   $$\text{BMI} = \frac{\text{weight (kg)}}{\left(\frac{\text{height (cm)}}{100}\right)^2}$$
   Derived dynamically to capture patient obesity levels ($\text{kg/m}^2$).

3. **Blood Pressure Outlier Filtering & Normalization**:
   - Physiological bounds enforced during feature scaling ($70 \le \text{ap\_hi} \le 240$, $40 \le \text{ap\_lo} \le 160$).
   - Extreme artifact values (e.g. $\text{ap\_hi} = 16020$, $\text{ap\_hi} < 0$) clipped to physiological boundaries.

4. **12 Model Features Output**:
   `['age_years', 'gender', 'height', 'weight', 'bmi', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active']`
