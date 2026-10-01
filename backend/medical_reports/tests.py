import os
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from prediction.models import Prediction
from medical_reports.models import MedicalReport

class MedicalReportTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='pdfuser', email='pdf@heartcare.ai', password='password123')
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client = APIClient()

        self.prediction = Prediction.objects.create(
            user=self.user,
            prediction=1,
            risk_probability=0.8377,
            risk_percentage=83.77,
            risk_level='HIGH',
            top_risk_factors=[{'feature': 'ap_hi', 'shap_value': 0.85, 'direction': 'increases_risk'}],
            shap_explanation=[{'feature': 'ap_hi', 'shap_value': 0.85, 'direction': 'increases_risk'}],
            input_features={'age': 55, 'gender': 2, 'height': 168, 'weight': 80, 'ap_hi': 145, 'ap_lo': 90, 'cholesterol': 2, 'gluc': 1, 'smoke': 1, 'alco': 0, 'active': 1}
        )

    def test_pdf_report_generation_and_download(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        resp1 = self.client.post('/api/medical-reports/generate/', {'prediction_id': self.prediction.id}, format='json')
        self.assertEqual(resp1.status_code, 201)
        
        report_id = resp1.data['report']['id']
        resp2 = self.client.get(f'/api/medical-reports/{report_id}/download/')
        self.assertEqual(resp2.status_code, 200)
        self.assertIn('pdf', resp2['Content-Type'])
