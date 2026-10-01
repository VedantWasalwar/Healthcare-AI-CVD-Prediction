import os
import json
from django.conf import settings
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from prediction.serializers import PredictionInputSerializer, PredictionDetailSerializer
from prediction.ml_service import HeartCareMLService
from prediction.models import Prediction
from prediction.config import DISCLAIMER_MESSAGE

class PredictCVDView(APIView):
    """
    POST /api/prediction/predict/
    Accepts 12 legitimate patient health parameters, runs preprocessor & XGBoost model,
    computes SHAP explanations, generates counterfactual scenario, saves prediction record,
    and returns complete transparent risk analysis.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PredictionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data

        try:
            ml_service = HeartCareMLService()
            ml_result = ml_service.predict_patient_risk(validated_data)

            # Store complete audit trail in database
            prediction_obj = Prediction.objects.create(
                user=request.user,
                prediction=ml_result['prediction'],
                risk_probability=ml_result['risk_probability'],
                risk_percentage=ml_result['risk_percentage'],
                risk_level=ml_result['risk_level'],
                top_risk_factors=ml_result['top_risk_factors'],
                shap_explanation=ml_result['shap_explanation'],
                counterfactual_scenario=ml_result.get('counterfactual_scenario', {}),
                model_metadata=ml_result.get('model_metadata', {}),
                input_features=validated_data,
                model_version="XGBoost_v1.0"
            )

            return Response({
                "success": True,
                "prediction_id": prediction_obj.id,
                "prediction": ml_result['prediction'],
                "risk_level": ml_result['risk_level'],
                "risk_probability": ml_result['risk_probability'],
                "risk_percentage": ml_result['risk_percentage'],
                "top_risk_factors": ml_result['top_risk_factors'],
                "shap_explanation": ml_result['shap_explanation'],
                "counterfactual_scenario": ml_result.get('counterfactual_scenario', {}),
                "model_metadata": ml_result.get('model_metadata', {}),
                "message": DISCLAIMER_MESSAGE
            }, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({
                "success": False,
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PredictionHistoryView(APIView):
    """
    GET /api/prediction/history/
    Returns authenticated user's prediction history.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        predictions = Prediction.objects.filter(user=request.user).order_by('-created_at')
        serializer = PredictionDetailSerializer(predictions, many=True)
        return Response({
            "success": True,
            "count": predictions.count(),
            "results": serializer.data
        }, status=status.HTTP_200_OK)

class PredictionDetailView(APIView):
    """
    GET /api/prediction/<id>/
    Returns specific prediction details scoped strictly to the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            prediction = Prediction.objects.get(pk=pk, user=request.user)
        except Prediction.DoesNotExist:
            return Response({
                "success": False,
                "error": "Prediction record not found or access denied."
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = PredictionDetailSerializer(prediction)
        return Response({
            "success": True,
            "prediction": serializer.data
        }, status=status.HTTP_200_OK)

class ModelPerformanceView(APIView):
    """
    GET /api/prediction/models/performance/
    Returns multi-model evaluation metrics (Accuracy, Precision, Recall, Specificity, F1, ROC-AUC, Confusion Matrix)
    for Logistic Regression, Random Forest, SVM, XGBoost, and Deep Learning Neural Net MLP.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        comp_file = os.path.join(settings.BASE_DIR, 'ml_models', 'model_comparison.json')
        if not os.path.exists(comp_file):
            comp_file = os.path.join(settings.BASE_DIR, 'ml', 'model', 'model_comparison.json')

        if os.path.exists(comp_file):
            with open(comp_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return Response({"success": True, "performance": data}, status=status.HTTP_200_OK)
        else:
            return Response({"success": False, "error": "Model performance metadata file not found."}, status=status.HTTP_404_NOT_FOUND)
