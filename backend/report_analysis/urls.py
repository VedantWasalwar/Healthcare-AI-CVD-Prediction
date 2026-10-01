from django.urls import path
from report_analysis.views import UploadReportView, ReportListView, ReportDetailView, ConfirmReportView

urlpatterns = [
    path('upload/', UploadReportView.as_view(), name='report_upload'),
    path('', ReportListView.as_view(), name='report_list'),
    path('<int:pk>/', ReportDetailView.as_view(), name='report_detail'),
    path('<int:pk>/confirm/', ConfirmReportView.as_view(), name='report_confirm'),
]
