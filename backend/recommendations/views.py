from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from prediction.models import Prediction
from recommendations.models import Recommendation
from recommendations.serializers import RecommendationSerializer, RecommendationGenerateSerializer
from recommendations.engine import RecommendationEngine
from recommendations.rules import RECOMMENDATION_DISCLAIMER

class GenerateRecommendationView(APIView):
    """
    POST /api/recommendations/generate/
    Generates personalized recommendations based on authenticated user's prediction record.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = RecommendationGenerateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        pred_id = serializer.validated_data['prediction_id']

        try:
            prediction_obj = Prediction.objects.get(pk=pred_id, user=request.user)
        except Prediction.DoesNotExist:
            return Response({
                "success": False,
                "error": "Prediction record not found or access denied."
            }, status=status.HTTP_404_NOT_FOUND)

        # Run Recommendation Engine
        result = RecommendationEngine.generate_recommendations(prediction_obj)

        # Clear existing recommendations for this prediction if any, then save fresh ones
        Recommendation.objects.filter(user=request.user, prediction=prediction_obj).delete()

        saved_recs = []
        for rec_dict in result['recommendations']:
            rec = Recommendation.objects.create(
                user=request.user,
                prediction=prediction_obj,
                category=rec_dict['category'],
                priority=rec_dict['priority'],
                title=rec_dict['title'],
                message=rec_dict['message'],
                reason=rec_dict['reason']
            )
            saved_recs.append(rec)

        serialized_recs = RecommendationSerializer(saved_recs, many=True).data

        return Response({
            "success": True,
            "prediction_id": prediction_obj.id,
            "risk_level": prediction_obj.risk_level,
            "risk_percentage": prediction_obj.risk_percentage,
            "recommendations": serialized_recs,
            "disclaimer": RECOMMENDATION_DISCLAIMER
        }, status=status.HTTP_200_OK)

class PredictionRecommendationDetailView(APIView):
    """
    GET /api/recommendations/<prediction_id>/
    Retrieves recommendations associated with a prediction record for authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, prediction_id):
        try:
            prediction_obj = Prediction.objects.get(pk=prediction_id, user=request.user)
        except Prediction.DoesNotExist:
            return Response({
                "success": False,
                "error": "Prediction record not found or access denied."
            }, status=status.HTTP_404_NOT_FOUND)

        recs = Recommendation.objects.filter(user=request.user, prediction=prediction_obj)

        if not recs.exists():
            # Auto-generate if not yet present in DB
            result = RecommendationEngine.generate_recommendations(prediction_obj)
            saved_recs = []
            for rec_dict in result['recommendations']:
                rec = Recommendation.objects.create(
                    user=request.user,
                    prediction=prediction_obj,
                    category=rec_dict['category'],
                    priority=rec_dict['priority'],
                    title=rec_dict['title'],
                    message=rec_dict['message'],
                    reason=rec_dict['reason']
                )
                saved_recs.append(rec)
            recs = saved_recs

        serialized_recs = RecommendationSerializer(recs, many=True).data

        return Response({
            "success": True,
            "prediction_id": prediction_obj.id,
            "risk_level": prediction_obj.risk_level,
            "risk_percentage": prediction_obj.risk_percentage,
            "recommendations": serialized_recs,
            "disclaimer": RECOMMENDATION_DISCLAIMER
        }, status=status.HTTP_200_OK)
