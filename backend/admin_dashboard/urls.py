from django.urls import path
from admin_dashboard.views import AdminStatsView

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin_stats'),
]
