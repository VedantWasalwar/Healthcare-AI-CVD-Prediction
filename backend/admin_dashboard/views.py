import os
import json
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from prediction.models import Prediction
from report_analysis.models import ReportAnalysis

class AdminStatsView(APIView):
    """
    GET /api/admin-dashboard/stats/
    Returns admin statistics, system logs, dataset versioning, and prediction audit logs.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_users = User.objects.count()
        total_predictions = Prediction.objects.count()
        total_reports = ReportAnalysis.objects.count()
        high_risk_cases = Prediction.objects.filter(risk_level__in=['HIGH', 'VERY HIGH']).count()

        comp_file = os.path.join(settings.BASE_DIR, 'ml_models', 'model_comparison.json')
        if not os.path.exists(comp_file):
            comp_file = os.path.join(settings.BASE_DIR, 'ml', 'model', 'model_comparison.json')

        model_info = {}
        if os.path.exists(comp_file):
            with open(comp_file, 'r', encoding='utf-8') as f:
                model_info = json.load(f)

        recent_predictions = list(Prediction.objects.values(
            'id', 'user__username', 'risk_percentage', 'risk_level', 'created_at'
        )[:10])

        return Response({
            "success": True,
            "stats": {
                "total_registered_users": total_users,
                "total_predictions_executed": total_predictions,
                "total_uploaded_reports": total_reports,
                "high_risk_flagged_cases": high_risk_cases,
                "dataset_version": "v1.0 (70,000 Patient Records)",
                "active_model": "XGBoost Classifier v1.0",
                "model_performance_summary": model_info
            },
            "recent_audit_logs": recent_predictions
        }, status=status.HTTP_200_OK)
