from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from authentication.views import RegisterView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
