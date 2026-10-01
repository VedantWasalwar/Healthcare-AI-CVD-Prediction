from django.urls import path
from recommendations.views import GenerateRecommendationView, PredictionRecommendationDetailView

urlpatterns = [
    path('generate/', GenerateRecommendationView.as_view(), name='recommendation_generate'),
    path('<int:prediction_id>/', PredictionRecommendationDetailView.as_view(), name='recommendation_detail'),
]
