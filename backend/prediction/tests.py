from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

class PredictionAPITestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testpatient', email='test@heartcare.ai', password='password123')
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client = APIClient()

    def test_prediction_flow(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        payload = {
            "age": 55, "gender": 2, "height": 168, "weight": 80,
            "ap_hi": 145, "ap_lo": 90, "cholesterol": 2, "gluc": 1,
            "smoke": 1, "alco": 0, "active": 1
        }
        resp = self.client.post('/api/prediction/predict/', payload, format='json')
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.data.get('success'))
        self.assertIn('risk_level', resp.data)

    def test_unauthorized_access(self):
        payload = {
            "age": 55, "gender": 2, "height": 168, "weight": 80,
            "ap_hi": 145, "ap_lo": 90, "cholesterol": 2, "gluc": 1,
            "smoke": 1, "alco": 0, "active": 1
        }
        resp = self.client.post('/api/prediction/predict/', payload, format='json')
        self.assertEqual(resp.status_code, 401)
