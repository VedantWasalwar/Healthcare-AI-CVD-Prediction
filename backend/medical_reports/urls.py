from django.urls import path
from medical_reports.views import GeneratePDFReportView, MedicalReportListView, MedicalReportDetailView, DownloadPDFReportView

urlpatterns = [
    path('', MedicalReportListView.as_view(), name='medical_report_list'),
    path('generate/', GeneratePDFReportView.as_view(), name='medical_report_generate'),
    path('<int:pk>/', MedicalReportDetailView.as_view(), name='medical_report_detail'),
    path('<int:pk>/download/', DownloadPDFReportView.as_view(), name='medical_report_download'),
]
