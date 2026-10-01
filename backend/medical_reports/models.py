from django.db import models
from django.contrib.auth.models import User
from prediction.models import Prediction

class MedicalReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='generated_medical_reports')
    prediction = models.OneToOneField(Prediction, on_delete=models.CASCADE, related_name='medical_pdf_report')
    
    report_id = models.CharField(max_length=64, unique=True)
    file_path = models.CharField(max_length=512)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"MedicalReport {self.report_id} - User: {self.user.username}"
