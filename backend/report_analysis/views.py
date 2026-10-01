import os
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from report_analysis.models import ReportAnalysis
from report_analysis.serializers import ReportAnalysisSerializer, ReportConfirmSerializer
from report_analysis.ocr_service import OCRService
from report_analysis.extractor import MedicalReportExtractor
from prediction.ml_service import HeartCareMLService
from prediction.models import Prediction
from prediction.config import DISCLAIMER_MESSAGE

ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png'}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

class UploadReportView(APIView):
    """
    POST /api/reports/upload/
    Uploads a medical report image/PDF, extracts OCR text, parses medical entities,
    and returns top-level id and extracted_data for instant prediction execution.
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if 'file' not in request.FILES:
            return Response({
                "success": False,
                "error": "No file uploaded. Please attach a medical report document."
            }, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES['file']
        filename = uploaded_file.name
        ext = filename.split('.')[-1].lower() if '.' in filename else ''

        if ext not in ALLOWED_EXTENSIONS:
            return Response({
                "success": False,
                "error": f"Invalid file format '.{ext}'. Supported formats: PDF, JPG, JPEG, PNG."
            }, status=status.HTTP_400_BAD_REQUEST)

        if uploaded_file.size > MAX_FILE_SIZE_BYTES:
            return Response({
                "success": False,
                "error": "File size exceeds 10MB limit."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create Report Database Record
        report = ReportAnalysis.objects.create(
            user=request.user,
            file=uploaded_file,
            original_filename=filename,
            file_type=ext,
            status='PROCESSING'
        )

        try:
            # 1. OCR Text Extraction
            file_path = report.file.path
            ocr_text = OCRService.extract_text_from_file(file_path, ext)
            report.ocr_text = ocr_text

            # 2. Medical Entity & Lab Value Extraction
            extracted_data = MedicalReportExtractor.extract_structured_data(ocr_text)
            report.extracted_data = extracted_data

            # 3. Detect Missing Required Model Parameters
            missing_fields = MedicalReportExtractor.detect_missing_model_fields(extracted_data)
            report.missing_fields = missing_fields

            report.status = 'NEEDS_CONFIRMATION' if missing_fields else 'EXTRACTED'
            report.save()

            serializer = ReportAnalysisSerializer(report)
            return Response({
                "success": True,
                "id": report.id,
                "report_id": report.id,
                "extracted_data": extracted_data,
                "message": "Report analyzed successfully.",
                "report": serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            report.status = 'FAILED'
            report.save()
            return Response({
                "success": False,
                "error": f"OCR analysis failed: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReportListView(APIView):
    """
    GET /api/reports/
    Returns list of uploaded medical reports for authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        reports = ReportAnalysis.objects.filter(user=request.user)
        serializer = ReportAnalysisSerializer(reports, many=True)
        return Response({
            "success": True,
            "count": reports.count(),
            "results": serializer.data
        }, status=status.HTTP_200_OK)

class ReportDetailView(APIView):
    """
    GET /api/reports/<id>/
    Returns detailed report analysis for authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            report = ReportAnalysis.objects.get(pk=pk, user=request.user)
        except ReportAnalysis.DoesNotExist:
            return Response({
                "success": False,
                "error": "Report not found or access denied."
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ReportAnalysisSerializer(report)
        return Response({
            "success": True,
            "report": serializer.data
        }, status=status.HTTP_200_OK)

class ConfirmReportView(APIView):
    """
    POST /api/reports/<id>/confirm/
    User reviews and completes extracted values, triggering CVD prediction.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            report = ReportAnalysis.objects.get(pk=pk, user=request.user)
        except ReportAnalysis.DoesNotExist:
            return Response({
                "success": False,
                "error": "Report not found or access denied."
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ReportConfirmSerializer(data=request.data.get('confirmed_features', request.data))
        if not serializer.is_valid():
            return Response({
                "success": False,
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        confirmed_data = serializer.validated_data

        try:
            ml_service = HeartCareMLService()
            ml_result = ml_service.predict_patient_risk(confirmed_data)

            # Create Prediction Database Object
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
                input_features=confirmed_data,
                model_version="XGBoost_v1.0"
            )

            report.status = 'PREDICTED'
            report.save()

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
            return Response({
                "success": False,
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
