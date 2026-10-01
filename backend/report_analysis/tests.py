from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

class ReportAnalysisTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='ocrpatient', email='ocr@heartcare.ai', password='password123')
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client = APIClient()

    def test_report_upload_and_confirmation(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        sample_text = "Age: 55\nBlood Pressure: 145/90 mmHg\nCholesterol: 215 mg/dL\n"
        pdf_file = SimpleUploadedFile("sample_lab.pdf", sample_text.encode('utf-8'), content_type="application/pdf")
        
        resp1 = self.client.post('/api/reports/upload/', {'file': pdf_file}, format='multipart')
        self.assertEqual(resp1.status_code, 201)
        
        report_id = resp1.data['report']['id']
        confirm_payload = {
            "age": 55, "gender": 2, "height": 168, "weight": 80,
            "ap_hi": 145, "ap_lo": 90, "cholesterol": 2, "gluc": 1,
            "smoke": 1, "alco": 0, "active": 1
        }
        resp2 = self.client.post(f'/api/reports/{report_id}/confirm/', confirm_payload, format='json')
        self.assertEqual(resp2.status_code, 200)
        self.assertTrue(resp2.data.get('success'))
