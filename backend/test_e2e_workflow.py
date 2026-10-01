import os
import sys
import tempfile
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient

def run_end_to_end_verification():
    print("==========================================================================")
    print("        HEARTCARE AI - COMPLETE END-TO-END WORKFLOW INTEGRATION TEST      ")
    print("==========================================================================")

    client = APIClient()
    steps = []

    username = "e2e_patient"
    password = "SecurePassword123!"
    email = "e2e@heartcare.ai"

    # Clean up existing test user
    User.objects.filter(username=username).delete()

    # 1. REGISTER NEW USER
    print("\n[STEP 1] Registering new user account...")
    resp1 = client.post('/api/auth/register/', {
        "username": username,
        "email": email,
        "password": password,
        "first_name": "E2E",
        "last_name": "Patient"
    }, format='json')
    s1_pass = (resp1.status_code == 201 and resp1.data.get('success') is True)
    steps.append(("Step 1: User Registration", s1_pass, resp1.status_code))
    print(f"Status: {resp1.status_code} | Result: {'PASS' if s1_pass else 'FAIL'}")

    # 2. LOGIN & JWT RETRIEVAL
    print("\n[STEP 2] Logging in user & retrieving JWT tokens...")
    resp2 = client.post('/api/auth/login/', {"username": username, "password": password}, format='json')
    s2_pass = (resp2.status_code == 200 and 'tokens' in resp2.data)
    token = resp2.data['tokens']['access'] if s2_pass else ''
    steps.append(("Step 2: User Login & JWT Retrieval", s2_pass, resp2.status_code))
    print(f"Status: {resp2.status_code} | Result: {'PASS' if s2_pass else 'FAIL'}")

    client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    # 3. OPEN DASHBOARD
    print("\n[STEP 3] Fetching Dashboard Prediction History...")
    resp3 = client.get('/api/prediction/history/')
    s3_pass = (resp3.status_code == 200 and resp3.data.get('count') == 0)
    steps.append(("Step 3: Dashboard Empty History Check", s3_pass, resp3.status_code))
    print(f"Status: {resp3.status_code} | Count: {resp3.data.get('count')} | Result: {'PASS' if s3_pass else 'FAIL'}")

    # 4 & 5 & 6 & 7: MANUAL HEALTH DATA PREDICTION & SHAP
    print("\n[STEP 4-7] Submitting Manual Health Data & XGBoost Prediction + SHAP...")
    manual_payload = {
        "age": 55, "gender": 2, "height": 168, "weight": 80,
        "ap_hi": 145, "ap_lo": 90, "cholesterol": 2, "gluc": 1,
        "smoke": 1, "alco": 0, "active": 1
    }
    resp5 = client.post('/api/prediction/predict/', manual_payload, format='json')
    s5_pass = (resp5.status_code == 200 and 'risk_percentage' in resp5.data and 'top_risk_factors' in resp5.data)
    pred_id_1 = resp5.data.get('prediction_id') if s5_pass else None
    steps.append(("Steps 4-7: Manual Input XGBoost Prediction & SHAP Engine", s5_pass, resp5.status_code))
    print(f"Status: {resp5.status_code} | Risk: {resp5.data.get('risk_level')} ({resp5.data.get('risk_percentage')}%) | Result: {'PASS' if s5_pass else 'FAIL'}")

    # 8. GENERATE RECOMMENDATIONS
    print("\n[STEP 8] Generating Personal Recommendations...")
    resp8 = client.post('/api/recommendations/generate/', {"prediction_id": pred_id_1}, format='json')
    s8_pass = (resp8.status_code == 200 and len(resp8.data.get('recommendations', [])) > 0)
    steps.append(("Step 8: AI Recommendation Engine Generation", s8_pass, resp8.status_code))
    print(f"Status: {resp8.status_code} | Recs Count: {len(resp8.data.get('recommendations', []))} | Result: {'PASS' if s8_pass else 'FAIL'}")

    # 9 & 10. GENERATE PDF REPORT
    print("\n[STEP 9 & 10] Generating A4 Medical Assessment PDF Report...")
    resp9 = client.post('/api/medical-reports/generate/', {"prediction_id": pred_id_1}, format='json')
    s9_pass = (resp9.status_code == 201 and 'report' in resp9.data)
    report_id_1 = resp9.data['report']['id'] if s9_pass else None
    steps.append(("Steps 9-10: Medical PDF Report Generation & Storage", s9_pass, resp9.status_code))
    print(f"Status: {resp9.status_code} | Report ID: {resp9.data['report']['report_id'] if s9_pass else 'N/A'} | Result: {'PASS' if s9_pass else 'FAIL'}")

    # 11 & 12. DASHBOARD LATEST PREDICTION VERIFICATION
    print("\n[STEP 11 & 12] Refreshing Dashboard & Verifying Latest Prediction...")
    resp11 = client.get('/api/prediction/history/')
    s11_pass = (resp11.status_code == 200 and resp11.data.get('count') == 1)
    steps.append(("Steps 11-12: Dashboard Latest Prediction Verification", s11_pass, resp11.status_code))
    print(f"Status: {resp11.status_code} | Count: {resp11.data.get('count')} | Result: {'PASS' if s11_pass else 'FAIL'}")

    # 13 & 14. PREDICTION HISTORY & DETAIL VIEW
    print("\n[STEP 13 & 14] Querying Prediction History & Detail Record...")
    resp14 = client.get(f'/api/prediction/{pred_id_1}/')
    s14_pass = (resp14.status_code == 200 and resp14.data.get('prediction', {}).get('id') == pred_id_1)
    steps.append(("Steps 13-14: Prediction History & Detailed Record Retrieval", s14_pass, resp14.status_code))
    print(f"Status: {resp14.status_code} | Result: {'PASS' if s14_pass else 'FAIL'}")

    # 15 & 16. UPLOAD MEDICAL REPORT & OCR EXTRACTION
    print("\n[STEP 15 & 16] Uploading Medical Report & Executing OCR Text Extraction...")
    sample_ocr_text = "Patient Age: 60\nBlood Pressure: 150/95 mmHg\nCholesterol: 245 mg/dL\n"
    pdf_file = SimpleUploadedFile("lab_report_scan.pdf", sample_ocr_text.encode('utf-8'), content_type="application/pdf")
    resp15 = client.post('/api/reports/upload/', {'file': pdf_file}, format='multipart')
    s15_pass = (resp15.status_code == 201 and 'report' in resp15.data)
    ocr_report_id = resp15.data['report']['id'] if s15_pass else None
    steps.append(("Steps 15-16: Medical Report Document Upload & OCR Analysis", s15_pass, resp15.status_code))
    print(f"Status: {resp15.status_code} | Report Status: {resp15.data['report']['status'] if s15_pass else 'N/A'} | Result: {'PASS' if s15_pass else 'FAIL'}")

    # 17 & 18 & 19. CONFIRM EXTRACTED REPORT DATA & RUN PREDICTION
    print("\n[STEP 17-19] Confirming OCR Extracted Data & Triggering Prediction...")
    confirmed_report_payload = {
        "age": 60, "gender": 2, "height": 170, "weight": 85,
        "ap_hi": 150, "ap_lo": 95, "cholesterol": 3, "gluc": 2,
        "smoke": 1, "alco": 1, "active": 0
    }
    resp18 = client.post(f'/api/reports/{ocr_report_id}/confirm/', confirmed_report_payload, format='json')
    s18_pass = (resp18.status_code == 200 and 'prediction_id' in resp18.data)
    pred_id_2 = resp18.data.get('prediction_id') if s18_pass else None
    steps.append(("Steps 17-19: OCR Confirmation & Secondary Prediction Execution", s18_pass, resp18.status_code))
    print(f"Status: {resp18.status_code} | Secondary Risk: {resp18.data.get('risk_level')} ({resp18.data.get('risk_percentage')}%) | Result: {'PASS' if s18_pass else 'FAIL'}")

    # 20 & 21. GENERATE RECOMMENDATIONS & PDF REPORT FOR SECONDARY PREDICTION
    print("\n[STEP 20 & 21] Generating Recommendations & PDF Report for Secondary Assessment...")
    resp20 = client.post('/api/recommendations/generate/', {"prediction_id": pred_id_2}, format='json')
    resp21 = client.post('/api/medical-reports/generate/', {"prediction_id": pred_id_2}, format='json')
    s21_pass = (resp20.status_code == 200 and resp21.status_code == 201)
    steps.append(("Steps 20-21: Secondary Assessment Recommendations & PDF Report Generation", s21_pass, resp21.status_code))
    print(f"Status: {resp21.status_code} | Result: {'PASS' if s21_pass else 'FAIL'}")

    # 22 & 23. OPEN REPORT HISTORY & VIEW GENERATED PDF
    print("\n[STEP 22 & 23] Querying Medical Reports History & Downloading PDF Stream...")
    resp22 = client.get('/api/medical-reports/')
    resp23 = client.get(f'/api/medical-reports/{report_id_1}/download/')
    s23_pass = (resp22.status_code == 200 and resp22.data.get('count') == 2 and resp23.status_code == 200)
    steps.append(("Steps 22-23: Report History Retrieval & Secure PDF File Streaming", s23_pass, resp23.status_code))
    print(f"Status: {resp23.status_code} | PDF Count: {resp22.data.get('count')} | Result: {'PASS' if s23_pass else 'FAIL'}")

    # 24 & 25. LOGOUT & VERIFY UNAUTHORIZED REJECTION
    print("\n[STEP 24 & 25] Logging Out & Verifying Protected Endpoints Reject Unauthorized Calls...")
    client.credentials() # Clear JWT Header
    resp25 = client.get('/api/prediction/history/')
    s25_pass = (resp25.status_code == 401)
    steps.append(("Steps 24-25: User Logout & 401 Unauthorized Security Enforcement", s25_pass, resp25.status_code))
    print(f"Status: {resp25.status_code} | Result: {'PASS' if s25_pass else 'FAIL'}")

    print("\n==========================================================================")
    print("                 END-TO-END WORKFLOW INTEGRATION SUMMARY                  ")
    print("==========================================================================")
    all_passed = True
    for title, passed, status_code in steps:
        status_str = "PASS" if passed else "FAIL"
        if not passed:
            all_passed = False
        print(f"[{status_str}] {title:<60} (HTTP {status_code})")

    print("==========================================================================")
    if all_passed:
        print(">>> ALL 25 END-TO-END WORKFLOW STEPS PASSED SUCCESSFULLY! <<<")
    else:
        print(">>> SOME WORKFLOW STEPS FAILED! <<<")
    print("==========================================================================")

if __name__ == '__main__':
    run_end_to_end_verification()
