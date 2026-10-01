# HeartCare AI — Abstract

## Abstract

Cardiovascular Diseases (CVDs) remain the leading cause of global mortality, accounting for an estimated 17.9 million deaths annually. While machine learning (ML) classifiers demonstrate strong predictive capabilities for early CVD detection, conventional models operate as uninterpretable "black boxes," restricting their adoption in clinical decision support. 

This paper presents **HeartCare AI**, a novel, end-to-end Explainable AI (XAI) clinical decision-support framework for cardiovascular risk assessment. Trained and validated on a benchmark clinical dataset of 70,000 patient records, our framework compares five distinct classification architectures: Logistic Regression, Support Vector Machine (SVM), Random Forest, Deep Learning Multi-Layer Perceptron (MLP), and XGBoost Classifier. 

Empirical evaluation reveals that **XGBoost Classifier** achieves superior predictive performance with **73.46% accuracy**, **0.7553 precision**, **0.6935 recall/sensitivity**, **0.7756 specificity**, **0.7231 F1-score**, and an **ROC-AUC of 0.8007**. To resolve model opacity, we integrate **SHAP (SHapley Additive exPlanations)** to quantify local and global feature contributions ($\text{SHAP} > 0$ vs. $\text{SHAP} < 0$) and a **Counterfactual AI Optimization Engine** that simulates actionable parameter modifications (e.g., blood pressure, BMI, smoking cessation) to illustrate potential risk reduction deltas ($68.4\% \to 42.7\%$) while holding immutable demographic factors constant. 

The platform incorporates an Optical Character Recognition (OCR) document parser, a multimodal AI health chatbot (supporting text, bilingual voice in English/Hindi, and medicine strip OCR), a camera-based photoplethysmography (PPG) vitals module, a risk-matched doctor recommendation engine, and ReportLab A4 PDF generation. All recommendations are disclaimed as non-prescriptive decision support. 

Our findings demonstrate that combining high-accuracy XGBoost predictions with local SHAP interpretability and counterfactual simulation significantly enhances transparency, auditability, and clinical utility in cardiovascular screening.
