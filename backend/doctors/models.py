from django.db import models

class Doctor(models.Model):
    SPECIALTY_CHOICES = [
        ('CARDIOLOGIST', 'Cardiologist / Cardiovascular Specialist'),
        ('GENERAL_PHYSICIAN', 'General Physician / Internal Medicine'),
        ('ENDOCRINOLOGIST', 'Endocrinologist / Diabetes Specialist'),
    ]

    name = models.CharField(max_length=255)
    specialty = models.CharField(max_length=50, choices=SPECIALTY_CHOICES, default='CARDIOLOGIST')
    qualification = models.CharField(max_length=255, default="MD, DM (Cardiology)")
    hospital_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    city = models.CharField(max_length=100, default="Mumbai")
    latitude = models.FloatField(default=19.0760)
    longitude = models.FloatField(default=72.8777)
    rating = models.FloatField(default=4.8)
    experience_years = models.IntegerField(default=12)
    emergency_support = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dr. {self.name} ({self.get_specialty_display()}) - {self.hospital_name}"
