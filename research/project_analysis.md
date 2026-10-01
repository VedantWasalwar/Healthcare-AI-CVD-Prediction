# HeartCare AI — Comprehensive Project Architectural Analysis

## 1. Executive Summary & Project Identification

* **Project Title**: Development of a Smart Cardiovascular Disease Prediction and Treatment Recommendation System Using Machine Learning and Explainable AI
* **Application Name**: HeartCare AI
* **Primary Domain**: Clinical Decision-Support System (CDSS), Explainable Artificial Intelligence (XAI), Medical Decision Support, Full-Stack Web Engineering.
* **Target Audience**: General Patients, Healthcare Practitioners, Medical Researchers, Project Evaluators.
* **Primary Objective**: Provide accurate, transparent, and non-prescriptive cardiovascular disease (CVD) risk assessment by integrating Machine Learning (XGBoost, Random Forest, SVM, Logistic Regression), Deep Learning (Neural Net MLP), Explainable AI (SHAP & Counterfactual AI), Multimodal Chatbot (Text, Multilingual Voice, Medicine Strip OCR), Doctor Directory, Camera PPG Vitals Estimation, and Publication-Quality ReportLab A4 PDF generation.

---

## 2. Verified Technical Stack & Dependency Mapping

| Component Layer | Technology / Framework | File / Specification Source | Verification Status |
| :--- | :--- | :--- | :--- |
| **Frontend SPA** | React 18.3.1 + Vite 5.4.21 | [`frontend/package.json`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/package.json#L12-L28) | **VERIFIED** |
| **Styling & Icons** | Tailwind CSS 3.4.17 + Lucide React | [`frontend/tailwind.config.js`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/tailwind.config.js#L1-L15) | **VERIFIED** |
| **Frontend Charts** | Recharts 2.15.1 | [`frontend/src/components/ShapImpactChart.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/components/ShapImpactChart.jsx#L1-L10) | **VERIFIED** |
| **Backend REST API** | Python 3.13 + Django 5.1 + DRF 3.15 | [`backend/config/settings.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/config/settings.py#L13-L35) | **VERIFIED** |
| **Authentication** | djangorestframework-simplejwt 5.5 | [`backend/config/settings.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/config/settings.py#L98-L113) | **VERIFIED** |
| **ML Engine** | XGBoost 2.1.4 + Scikit-Learn 1.6.1 | [`backend/ml/train_model.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/ml/train_model.py#L1-L20) | **VERIFIED** |
| **Explainable AI (XAI)** | SHAP 0.46.0 (`TreeExplainer`) | [`backend/prediction/ml_service.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/prediction/ml_service.py#L50-L60) | **VERIFIED** |
| **Counterfactual AI** | Custom Actionable Vector Optimizer | [`backend/prediction/ml_service.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/prediction/ml_service.py#L110-L190) | **VERIFIED** |
| **OCR Processing** | PyTesseract 0.3.13 + pdfplumber | [`backend/report_analysis/ocr_service.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/report_analysis/ocr_service.py#L1-L25) | **VERIFIED** |
| **PDF Generation** | ReportLab 4.3.1 Document Engine | [`backend/medical_reports/pdf_generator.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/medical_reports/pdf_generator.py#L1-L30) | **VERIFIED** |
| **Database** | Django ORM + SQLite3 / PostgreSQL | [`backend/config/settings.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/config/settings.py#L67-L72) | **VERIFIED** |

---

## 3. Verified System Modules & Implementation Mapping

### 3.1 Authentication & User Management Module
* **Aim**: Secure JWT-based registration, login, and user profile management with role-based token rotation.
* **Backend Source Code**:
  - Models: [`backend/authentication/models.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/authentication/models.py)
  - Views: [`backend/authentication/views.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/authentication/views.py) (`RegisterView`, `LoginView`, `UserProfileView`)
  - Endpoints: `POST /api/auth/register/`, `POST /api/auth/login/`, `GET /api/auth/profile/`
* **Frontend Source Code**:
  - Login Page: [`frontend/src/pages/LoginPage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/LoginPage.jsx)
  - Register Page: [`frontend/src/pages/RegisterPage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/RegisterPage.jsx)
  - Profile Page: [`frontend/src/pages/ProfilePage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/ProfilePage.jsx)
* **Verification Status**: **VERIFIED**

---

### 3.2 Machine Learning & Deep Learning Inference Engine
* **Aim**: Preprocess 12 clinical parameters, run XGBoost risk probability inference, and output categorical risk (`LOW`, `MODERATE`, `HIGH`, `VERY HIGH`).
* **Backend Source Code**:
  - Preprocessor: [`backend/ml/preprocessing.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/ml/preprocessing.py) (`CVDDataPreprocessor`)
  - ML Pipeline Training: [`backend/ml/train_model.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/ml/train_model.py)
  - ML Singleton Service: [`backend/prediction/ml_service.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/prediction/ml_service.py) (`HeartCareMLService`)
  - Prediction Models & Views: [`backend/prediction/models.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/prediction/models.py) & [`backend/prediction/views.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/prediction/views.py) (`PredictCVDView`, `ModelPerformanceView`)
  - Endpoints: `POST /api/prediction/predict/`, `GET /api/prediction/history/`, `GET /api/prediction/models/performance/`
* **Frontend Source Code**:
  - Manual Input Form: [`frontend/src/pages/HealthInputPage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/HealthInputPage.jsx)
  - Prediction Result Page: [`frontend/src/pages/PredictionResultPage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/PredictionResultPage.jsx)
  - Model Performance Page: [`frontend/src/pages/ModelPerformancePage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/ModelPerformancePage.jsx)
* **Verification Status**: **VERIFIED**

---

### 3.3 Explainable AI (SHAP Local & Global Explanations)
* **Aim**: Eliminate black-box predictions by generating game-theoretic SHAP feature contribution values ($\text{SHAP} > 0$ increases risk, $\text{SHAP} < 0$ decreases risk).
* **Backend Source Code**:
  - SHAP Explainer: [`backend/prediction/ml_service.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/prediction/ml_service.py#L150-L170)
* **Frontend Source Code**:
  - SHAP Bar Chart: [`frontend/src/components/ShapImpactChart.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/components/ShapImpactChart.jsx)
  - Transparent AI Section: [`frontend/src/pages/PredictionResultPage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/PredictionResultPage.jsx#L145-L210)
* **Verification Status**: **VERIFIED**

---

### 3.4 Actionable Counterfactual AI Simulation
* **Aim**: Answer *"What hypothetical input changes could lower the predicted risk?"* by optimizing actionable variables (`ap_hi`, `ap_lo`, `bmi`, `weight`, `smoke`, `active`, `cholesterol`, `gluc`) while keeping immutable variables (`age`, `gender`) constant.
* **Backend Source Code**:
  - Counterfactual Engine: [`backend/prediction/ml_service.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/prediction/ml_service.py#L110-L190) (`generate_counterfactual_scenario`)
* **Frontend Source Code**:
  - Counterfactual Visualization Card: [`frontend/src/components/CounterfactualCard.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/components/CounterfactualCard.jsx)
* **Verification Status**: **VERIFIED**

---

### 3.5 Document OCR & Medical Report Analysis
* **Aim**: Upload PDF/JPG/PNG lab reports, perform Tesseract/pdfplumber text extraction, map clinical entities, and auto-trigger risk prediction.
* **Backend Source Code**:
  - OCR Service: [`backend/report_analysis/ocr_service.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/report_analysis/ocr_service.py)
  - Parameter Extractor: [`backend/report_analysis/extractor.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/report_analysis/extractor.py)
  - Upload Views: [`backend/report_analysis/views.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/report_analysis/views.py) (`UploadReportView`, `ConfirmReportView`)
  - Endpoints: `POST /api/reports/upload/`, `POST /api/reports/<id>/confirm/`
* **Frontend Source Code**:
  - Report Upload Page: [`frontend/src/pages/ReportUploadPage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/ReportUploadPage.jsx)
  - Report History Page: [`frontend/src/pages/ReportHistoryPage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/ReportHistoryPage.jsx)
* **Verification Status**: **VERIFIED**

---

### 3.6 Personalized Non-Pharmacological Recommendations
* **Aim**: Generate categorized lifestyle guidance (Diet, Exercise, Medical Monitoring, Habits) customized to patient SHAP risk drivers.
* **Backend Source Code**:
  - Recommendation Engine: [`backend/recommendations/engine.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/recommendations/engine.py) (`RecommendationEngine`)
  - Recommendation Views: [`backend/recommendations/views.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/recommendations/views.py)
  - Endpoint: `GET /api/recommendations/<prediction_id>/`
* **Frontend Source Code**:
  - Recommendations Page: [`frontend/src/pages/RecommendationsPage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/RecommendationsPage.jsx)
* **Verification Status**: **VERIFIED**

---

### 3.7 Doctor Recommendation & Clinic Location Directory
* **Aim**: Match patient risk severity to clinical specialties (Low/Moderate → General Physician; High/Very High → Cardiologist) with direct clinic calling and directions mapping.
* **Backend Source Code**:
  - Doctor Model: [`backend/doctors/models.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/doctors/models.py) (`Doctor`)
  - Doctor Directory View: [`backend/doctors/views.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/doctors/views.py) (`DoctorListView`)
  - Endpoints: `GET /api/doctors/`, `GET /api/doctors/nearby/`
* **Frontend Source Code**:
  - Doctor Finder Page: [`frontend/src/pages/DoctorFinderPage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/DoctorFinderPage.jsx)
* **Verification Status**: **VERIFIED**

---

### 3.8 Multimodal AI Health Assistant (Text, Voice & Medicine Strip OCR)
* **Aim**: Provide medical Q&A in 3 modes: Mode 1 Text Chat, Mode 2 Multilingual Voice Assistant (English & Hindi), Mode 3 Medicine Strip OCR returning 3 safety cards (Purpose, Missed Dose, Precautions).
* **Backend Source Code**:
  - Chatbot Views: [`backend/chatbot/views.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/chatbot/views.py) (`TextChatView`, `VoiceChatView`, `MedicalImageAnalyzeView`)
  - Endpoints: `POST /api/chat/text/`, `POST /api/chat/voice/`, `POST /api/chat/medical-image/analyze/`
* **Frontend Source Code**:
  - Chatbot Page: [`frontend/src/pages/ChatbotPage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/ChatbotPage.jsx)
* **Verification Status**: **VERIFIED**

---

### 3.9 Camera-Based Optical PPG Vitals Estimation
* **Aim**: Smartphone/webcam optical photoplethysmography frame analysis for Heart Rate (BPM), Experimental Blood Pressure, and Signal Quality Meter (`GOOD`, `FAIR`, `POOR`).
* **Backend Source Code**:
  - PPG Analysis View: [`backend/ppg/views.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/ppg/views.py) (`PPGEstimateView`)
  - Endpoint: `POST /api/ppg/estimate/`
* **Frontend Source Code**:
  - PPG Page: [`frontend/src/pages/PpgMeasurementPage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/PpgMeasurementPage.jsx)
* **Verification Status**: **VERIFIED**

---

### 3.10 ReportLab A4 PDF Medical Summary Engine
* **Aim**: Export publication-quality A4 PDF reports featuring patient vitals, high-risk dark line highlights, SHAP contribution breakdown, counterfactual table, research audit metadata, and disclaimers.
* **Backend Source Code**:
  - PDF Generator: [`backend/medical_reports/pdf_generator.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/medical_reports/pdf_generator.py) (`PDFReportGenerator`)
  - PDF Views: [`backend/medical_reports/views.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/medical_reports/views.py) (`GeneratePDFReportView`, `DownloadPDFReportView`)
  - Endpoints: `POST /api/medical-reports/generate/`, `GET /api/medical-reports/<id>/download/`
* **Verification Status**: **VERIFIED**

---

### 3.11 System Administration & Audit Portal
* **Aim**: Admin management portal for total users, predictions executed, uploaded OCR reports, high-risk flagged cases, dataset versioning (`v1.0 - 70k records`), and prediction audit logs.
* **Backend Source Code**:
  - Admin Stats View: [`backend/admin_dashboard/views.py`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/backend/admin_dashboard/views.py) (`AdminStatsView`)
  - Endpoint: `GET /api/admin-dashboard/stats/`
* **Frontend Source Code**:
  - Admin Dashboard Page: [`frontend/src/pages/AdminDashboardPage.jsx`](file:///c:/Users/VEDANT/OneDrive/Desktop/HeartCare%20AI/frontend/src/pages/AdminDashboardPage.jsx)
* **Verification Status**: **VERIFIED**
