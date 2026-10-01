from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from prediction.models import Prediction

class RecommendationTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='recuser', email='rec@heartcare.ai', password='password123')
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

    def test_generate_recommendations(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        resp = self.client.post('/api/recommendations/generate/', {'prediction_id': self.prediction.id}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data.get('risk_level'), 'HIGH')
        self.assertTrue(len(resp.data.get('recommendations', [])) > 0)
