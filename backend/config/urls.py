from django.contrib import admin
from django.urls import path, include
from prediction.views import PredictCVDView, PredictionHistoryView, PredictionDetailView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/prediction/', include('prediction.urls')),
    
    # Direct alias endpoints required by specification
    path('api/predict/', PredictCVDView.as_view(), name='api_predict_alias'),
    path('api/predictions/', PredictionHistoryView.as_view(), name='api_predictions_alias'),
    path('api/predictions/<int:pk>/', PredictionDetailView.as_view(), name='api_prediction_detail_alias'),

    path('api/reports/', include('report_analysis.urls')),
    path('api/recommendations/', include('recommendations.urls')),
    path('api/medical-reports/', include('medical_reports.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    
    # New apps
    path('api/doctors/', include('doctors.urls')),
    path('api/chat/', include('chatbot.urls')),
    path('api/ppg/', include('ppg.urls')),
    path('api/admin-dashboard/', include('admin_dashboard.urls')),
]
