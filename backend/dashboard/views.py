from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from prediction.models import Prediction
from prediction.serializers import PredictionInputSerializer, PredictionDetailSerializer

class DashboardView(APIView):
    """
    GET /api/dashboard/
    Retrieves summary health stats, latest assessment, and recent 5 predictions for authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_predictions = Prediction.objects.filter(user=request.user).order_by('-created_at')
        total_count = user_predictions.count()

        latest = user_predictions.first()
        latest_data = PredictionDetailSerializer(latest).data if latest else None

        recent_5 = user_predictions[:5]
        recent_list = PredictionDetailSerializer(recent_5, many=True).data

        # Calculate average metrics if history exists
        avg_sys_bp = 0
        avg_dia_bp = 0
        avg_bmi = 0

        if total_count > 0:
            sys_bps = [p.input_features.get('ap_hi', 0) for p in user_predictions if p.input_features and 'ap_hi' in p.input_features]
            dia_bps = [p.input_features.get('ap_lo', 0) for p in user_predictions if p.input_features and 'ap_lo' in p.input_features]
            bmis = [p.input_features.get('bmi', 0) for p in user_predictions if p.input_features and 'bmi' in p.input_features]

            if sys_bps:
                avg_sys_bp = round(sum(sys_bps) / len(sys_bps), 1)
            if dia_bps:
                avg_dia_bp = round(sum(dia_bps) / len(dia_bps), 1)
            if bmis:
                avg_bmi = round(sum(bmis) / len(bmis), 1)

        return Response({
            "success": True,
            "username": request.user.username,
            "total_assessments": total_count,
            "latest_prediction": latest_data,
            "recent_assessments": recent_list,
            "health_averages": {
                "average_systolic_bp": avg_sys_bp,
                "average_diastolic_bp": avg_dia_bp,
                "average_bmi": avg_bmi,
            }
        }, status=status.HTTP_200_OK)
