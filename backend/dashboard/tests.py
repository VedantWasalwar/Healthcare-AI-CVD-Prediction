from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

class DashboardAPITestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='dashuser', email='dash@heartcare.ai', password='password123')
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client = APIClient()

    def test_dashboard_summary_unauthorized(self):
        resp = self.client.get('/api/dashboard/')
        self.assertEqual(resp.status_code, 401)

    def test_dashboard_summary_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        resp = self.client.get('/api/dashboard/')
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.data.get('success'))
        self.assertEqual(resp.data.get('username'), 'dashuser')
