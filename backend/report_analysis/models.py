from django.db import models
from django.contrib.auth.models import User

class ReportAnalysis(models.Model):
    STATUS_CHOICES = [
        ('UPLOADED', 'Uploaded'),
        ('PROCESSING', 'Processing OCR'),
        ('EXTRACTED', 'Text Extracted'),
        ('NEEDS_CONFIRMATION', 'Needs Confirmation'),
        ('CONFIRMED', 'Confirmed'),
        ('PREDICTED', 'Predicted'),
        ('FAILED', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_reports')
    file = models.FileField(upload_to='reports/')
    original_filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=20)
    
    ocr_text = models.TextField(null=True, blank=True)
    extracted_data = models.JSONField(default=dict, blank=True)
    missing_fields = models.JSONField(default=list, blank=True)
    
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='UPLOADED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Report #{self.id} ({self.original_filename}) - Status: {self.status}"
