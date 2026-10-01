import os
import sys
import json
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

def run_prediction_api_tests():
    print("==========================================================================")
    print("        HEARTCARE AI - PREDICTION REST API TEST SUITE (10 TESTS)           ")
    print("==========================================================================")

    # Setup Test User 1
    User.objects.filter(username__in=['testpatient', 'otheruser']).delete()
    
    user1 = User.objects.create_user(username='testpatient', email='test@heartcare.ai', password='password123')
    token1 = str(RefreshToken.for_user(user1).access_token)

    # Setup Test User 2 (for security scoping test)
    user2 = User.objects.create_user(username='otheruser', email='other@heartcare.ai', password='password123')
    token2 = str(RefreshToken.for_user(user2).access_token)

    client = APIClient()

    results = []

    # TEST 1: VALID REQUEST (REAL PATIENT DATASET RECORD)
    print("\n[TEST 1] Valid Prediction Request with Real Test-Set Record...")
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + token1)
    valid_payload = {
        "age": 55,
        "gender": 2,
        "height": 168,
        "weight": 80,
        "ap_hi": 145,
        "ap_lo": 90,
        "cholesterol": 2,
        "gluc": 1,
        "smoke": 1,
        "alco": 0,
        "active": 1
    }
    resp1 = client.post('/api/prediction/predict/', valid_payload, format='json')
    t1_pass = (resp1.status_code == 200 and resp1.data.get('success') is True and 'prediction_id' in resp1.data)
    results.append(('Test 1: Valid Prediction Request', t1_pass, resp1.status_code, resp1.data))
    print(f"Status: {resp1.status_code} | Result: {'PASS' if t1_pass else 'FAIL'}")
    if t1_pass:
        print(f"  Returned Risk Level: {resp1.data.get('risk_level')} ({resp1.data.get('risk_percentage')}%)")
        print(f"  Top Risk Factor    : {resp1.data.get('top_risk_factors')[0]['feature'] if resp1.data.get('top_risk_factors') else 'None'}")
        print(f"  Disclaimer         : {resp1.data.get('message')}")

    # TEST 2: MISSING FIELD (Missing ap_hi)
    print("\n[TEST 2] Missing Required Field (ap_hi)...")
    payload2 = valid_payload.copy()
    del payload2['ap_hi']
    resp2 = client.post('/api/prediction/predict/', payload2, format='json')
    t2_pass = (resp2.status_code == 400 and 'ap_hi' in resp2.data.get('errors', {}))
    results.append(('Test 2: Missing Field Validation', t2_pass, resp2.status_code, resp2.data))
    print(f"Status: {resp2.status_code} | Result: {'PASS' if t2_pass else 'FAIL'}")

    # TEST 3: INVALID AGE (Age = 10 < 18)
    print("\n[TEST 3] Invalid Age (age = 10)...")
    payload3 = valid_payload.copy()
    payload3['age'] = 10
    resp3 = client.post('/api/prediction/predict/', payload3, format='json')
    t3_pass = (resp3.status_code == 400 and 'age' in resp3.data.get('errors', {}))
    results.append(('Test 3: Invalid Age Validation', t3_pass, resp3.status_code, resp3.data))
    print(f"Status: {resp3.status_code} | Result: {'PASS' if t3_pass else 'FAIL'}")

    # TEST 4: INVALID BLOOD PRESSURE (ap_lo >= ap_hi)
    print("\n[TEST 4] Invalid Blood Pressure (ap_lo=150 >= ap_hi=120)...")
    payload4 = valid_payload.copy()
    payload4['ap_hi'] = 120
    payload4['ap_lo'] = 150
    resp4 = client.post('/api/prediction/predict/', payload4, format='json')
    t4_pass = (resp4.status_code == 400 and ('ap_lo' in resp4.data.get('errors', {}) or 'non_field_errors' in resp4.data.get('errors', {})))
    results.append(('Test 4: Invalid BP Validation', t4_pass, resp4.status_code, resp4.data))
    print(f"Status: {resp4.status_code} | Result: {'PASS' if t4_pass else 'FAIL'}")

    # TEST 5: INVALID CHOLESTEROL (cholesterol = 5)
    print("\n[TEST 5] Invalid Cholesterol (cholesterol = 5)...")
    payload5 = valid_payload.copy()
    payload5['cholesterol'] = 5
    resp5 = client.post('/api/prediction/predict/', payload5, format='json')
    t5_pass = (resp5.status_code == 400 and 'cholesterol' in resp5.data.get('errors', {}))
    results.append(('Test 5: Invalid Cholesterol Validation', t5_pass, resp5.status_code, resp5.data))
    print(f"Status: {resp5.status_code} | Result: {'PASS' if t5_pass else 'FAIL'}")

    # TEST 6: INVALID GLUCOSE (gluc = 4)
    print("\n[TEST 6] Invalid Glucose (gluc = 4)...")
    payload6 = valid_payload.copy()
    payload6['gluc'] = 4
    resp6 = client.post('/api/prediction/predict/', payload6, format='json')
    t6_pass = (resp6.status_code == 400 and 'gluc' in resp6.data.get('errors', {}))
    results.append(('Test 6: Invalid Glucose Validation', t6_pass, resp6.status_code, resp6.data))
    print(f"Status: {resp6.status_code} | Result: {'PASS' if t6_pass else 'FAIL'}")

    # TEST 7: INVALID GENDER (gender = 3)
    print("\n[TEST 7] Invalid Gender (gender = 3)...")
    payload7 = valid_payload.copy()
    payload7['gender'] = 3
    resp7 = client.post('/api/prediction/predict/', payload7, format='json')
    t7_pass = (resp7.status_code == 400 and 'gender' in resp7.data.get('errors', {}))
    results.append(('Test 7: Invalid Gender Validation', t7_pass, resp7.status_code, resp7.data))
    print(f"Status: {resp7.status_code} | Result: {'PASS' if t7_pass else 'FAIL'}")

    # TEST 8: INVALID BOOLEAN FIELDS (smoke = 2)
    print("\n[TEST 8] Invalid Smoking Status (smoke = 2)...")
    payload8 = valid_payload.copy()
    payload8['smoke'] = 2
    resp8 = client.post('/api/prediction/predict/', payload8, format='json')
    t8_pass = (resp8.status_code == 400 and 'smoke' in resp8.data.get('errors', {}))
    results.append(('Test 8: Invalid Smoke Validation', t8_pass, resp8.status_code, resp8.data))
    print(f"Status: {resp8.status_code} | Result: {'PASS' if t8_pass else 'FAIL'}")

    # TEST 9: UNAUTHORIZED REQUEST (No JWT Token)
    print("\n[TEST 9] Unauthorized Request (No JWT Token)...")
    client.credentials() # Clear headers
    resp9 = client.post('/api/prediction/predict/', valid_payload, format='json')
    t9_pass = (resp9.status_code == 401)
    results.append(('Test 9: Unauthorized Request (401)', t9_pass, resp9.status_code, resp9.data))
    print(f"Status: {resp9.status_code} | Result: {'PASS' if t9_pass else 'FAIL'}")

    # TEST 10: PREDICTION HISTORY & SECURITY SCOPING
    print("\n[TEST 10] Prediction History & Data Scoping...")
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + token1)
    resp10_user1 = client.get('/api/prediction/history/')
    t10_hist_pass = (resp10_user1.status_code == 200 and resp10_user1.data.get('count') == 1)
    
    # Check that User 2 sees 0 records in their history
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + token2)
    resp10_user2 = client.get('/api/prediction/history/')
    t10_scope_pass = (resp10_user2.status_code == 200 and resp10_user2.data.get('count') == 0)

    # Check that User 2 cannot view User 1's prediction detail
    pred_id = resp1 = resp10_user1.data['results'][0]['id']
    resp10_detail = client.get(f'/api/prediction/{pred_id}/')
    t10_detail_pass = (resp10_detail.status_code == 404)

    t10_pass = (t10_hist_pass and t10_scope_pass and t10_detail_pass)
    results.append(('Test 10: Prediction History & Scoping', t10_pass, resp10_user1.status_code, {"user1_count": resp10_user1.data.get('count'), "user2_count": resp10_user2.data.get('count')}))
    print(f"Status: User 1 Count={resp10_user1.data.get('count')}, User 2 Count={resp10_user2.data.get('count')}, User 2 Access Attempt={resp10_detail.status_code} | Result: {'PASS' if t10_pass else 'FAIL'}")

    print("\n==========================================================================")
    print("                    TEST SUITE SUMMARY RESULTS                            ")
    print("==========================================================================")
    all_passed = True
    for idx, (title, passed, status_code, data) in enumerate(results, 1):
        status_str = "PASS" if passed else "FAIL"
        if not passed:
            all_passed = False
        print(f"[{status_str}] Case {idx:2d}: {title:<40} (HTTP {status_code})")

    print("==========================================================================")
    if all_passed:
        print(">>> ALL 10 PREDICTION API TESTS PASSED SUCCESSFULLY! <<<")
    else:
        print(">>> SOME TESTS FAILED! <<<")
    print("==========================================================================")

if __name__ == '__main__':
    run_prediction_api_tests()
