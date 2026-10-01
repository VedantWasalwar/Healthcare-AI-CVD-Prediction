from django.urls import path
from ppg.views import PPGEstimateView

urlpatterns = [
    path('estimate/', PPGEstimateView.as_view(), name='ppg_estimate'),
]
