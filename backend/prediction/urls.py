from django.urls import path
from prediction.views import PredictCVDView, PredictionHistoryView, PredictionDetailView, ModelPerformanceView

urlpatterns = [
    path('predict/', PredictCVDView.as_view(), name='predict_cvd'),
    path('history/', PredictionHistoryView.as_view(), name='prediction_history'),
    path('models/performance/', ModelPerformanceView.as_view(), name='model_performance'),
    path('<int:pk>/', PredictionDetailView.as_view(), name='prediction_detail'),
]
