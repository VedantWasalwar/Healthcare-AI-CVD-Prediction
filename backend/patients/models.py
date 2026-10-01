from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patients')
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.IntegerField(choices=[(1, 'Female'), (2, 'Male')])
    height = models.FloatField(help_text="Height in cm")
    weight = models.FloatField(help_text="Weight in kg")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Patient: {self.name} (User: {self.user.username})"

class HealthData(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='health_data')
    age = models.FloatField()
    height = models.FloatField()
    weight = models.FloatField()
    bmi = models.FloatField()
    smoking = models.IntegerField(default=0)
    diabetes = models.IntegerField(default=0)
    family_history = models.IntegerField(default=0, help_text="Extended info parameter")
    blood_pressure = models.FloatField(help_text="Systolic BP")
    hdl = models.FloatField(null=True, blank=True, help_text="Extended info parameter")
    ldl = models.FloatField(null=True, blank=True, help_text="Extended info parameter")
    triglycerides = models.FloatField(null=True, blank=True, help_text="Extended info parameter")
    hba1c = models.FloatField(null=True, blank=True, help_text="Extended info parameter")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.height and self.weight and not self.bmi:
            height_m = self.height / 100.0
            self.bmi = round(self.weight / (height_m ** 2), 2)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"HealthData for {self.patient.name} - {self.created_at.strftime('%Y-%m-%d')}"
