import os
from django.http import FileResponse
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from prediction.models import Prediction
from medical_reports.models import MedicalReport
from medical_reports.serializers import MedicalReportSerializer, MedicalReportGenerateSerializer
from medical_reports.pdf_generator import PDFReportGenerator

class GeneratePDFReportView(APIView):
    """
    POST /api/medical-reports/generate/
    Generates a professional A4 Medical Assessment PDF report for the user's prediction record.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = MedicalReportGenerateSerializer(data=request.data)
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

        try:
            report_id_str, file_path = PDFReportGenerator.generate_prediction_report(prediction_obj, request.user)

            report_obj, created = MedicalReport.objects.update_or_create(
                user=request.user,
                prediction=prediction_obj,
                defaults={
                    'report_id': report_id_str,
                    'file_path': file_path
                }
            )

            serialized_report = MedicalReportSerializer(report_obj).data
            serialized_report['download_url'] = f"/api/medical-reports/{report_obj.id}/download/"

            return Response({
                "success": True,
                "message": "PDF Report generated successfully.",
                "report_id": report_obj.id,
                "report_number": report_id_str,
                "report": serialized_report
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                "success": False,
                "error": f"PDF Generation failed: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MedicalReportListView(APIView):
    """
    GET /api/medical-reports/
    Retrieves all generated PDF reports for authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        reports = MedicalReport.objects.filter(user=request.user)
        results = []
        for r in reports:
            data = MedicalReportSerializer(r).data
            data['download_url'] = f"/api/medical-reports/{r.id}/download/"
            results.append(data)

        return Response({
            "success": True,
            "count": len(results),
            "results": results
        }, status=status.HTTP_200_OK)

class MedicalReportDetailView(APIView):
    """
    GET /api/medical-reports/<id>/
    Retrieves report metadata for authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            report_obj = MedicalReport.objects.get(pk=pk, user=request.user)
        except MedicalReport.DoesNotExist:
            return Response({
                "success": False,
                "error": "Report not found or access denied."
            }, status=status.HTTP_404_NOT_FOUND)

        data = MedicalReportSerializer(report_obj).data
        data['download_url'] = f"/api/medical-reports/{report_obj.id}/download/"
        return Response({
            "success": True,
            "report": data
        }, status=status.HTTP_200_OK)

class DownloadPDFReportView(APIView):
    """
    GET /api/medical-reports/<id>/download/
    Securely streams the PDF report document to the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            report_obj = MedicalReport.objects.get(pk=pk, user=request.user)
        except MedicalReport.DoesNotExist:
            return Response({
                "success": False,
                "error": "Report not found or access denied."
            }, status=status.HTTP_404_NOT_FOUND)

        if not os.path.exists(report_obj.file_path):
            PDFReportGenerator.generate_prediction_report(report_obj.prediction, request.user)

        try:
            response = FileResponse(open(report_obj.file_path, 'rb'), content_type='application/pdf')
            response['Content-Disposition'] = f'inline; filename="{report_obj.report_id}.pdf"'
            return response
        except Exception as e:
            return Response({
                "success": False,
                "error": f"Error reading PDF file: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
