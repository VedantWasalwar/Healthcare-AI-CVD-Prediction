# HeartCare AI — Verified Figure Captions & Visual Assets

## Figure List & Captions

* **Fig. 1. HeartCare AI System Architecture Diagram.**
  * *Caption*: High-level software architecture diagram illustrating the decoupling between the React 18 frontend single-page application (SPA), the Django REST Framework backend API layer, the XGBoost ML/DL inference engine, the SHAP and Counterfactual Explainable AI services, the document OCR parser, the doctor recommendation directory, and the ReportLab A4 PDF generator.

* **Fig. 2. End-to-End System Methodology & Data Flowchart.**
  * *Caption*: Methodological workflow showing sequential data transformation from patient input / lab document upload $\to$ preprocessing and scaling $\to$ XGBoost risk scoring $\to$ SHAP feature attribution $\to$ counterfactual simulation $\to$ non-pharmacological decision-support recommendations $\to$ ReportLab PDF export.

* **Fig. 3. Multi-Model Performance Comparison (ROC-AUC & Accuracy).**
  * *Caption*: Comparative evaluation of Logistic Regression, Random Forest, SVM, Deep Learning Neural Net (MLP), and XGBoost Classifier evaluated on 14,000 holdout test samples from the 70,000 patient dataset.

* **Fig. 4. Confusion Matrix of Selected Best XGBoost Model.**
  * *Caption*: Confusion matrix for the XGBoost Classifier on 14,000 test records showing True Negatives ($\text{TN} = 5,432$), False Positives ($\text{FP} = 1,572$), False Negatives ($\text{FN} = 2,144$), and True Positives ($\text{TP} = 4,852$).

* **Fig. 5. SHAP Feature Importance Ranking & Directional Influence.**
  * *Caption*: Global and local SHAP feature attributions indicating that Systolic Blood Pressure (`ap_hi`), Age (`age_years`), Cholesterol (`cholesterol`), and BMI (`bmi`) are the strongest drivers of cardiovascular risk predictions.

* **Fig. 6. Actionable Counterfactual AI Simulation UI Component.**
  * *Caption*: Counterfactual AI scenario visualization demonstrating simulated risk probability reduction ($68.4\% \to 42.7\%$, Delta $-25.7\%$) by modifying actionable physiological variables while preserving immutable demographic features.
