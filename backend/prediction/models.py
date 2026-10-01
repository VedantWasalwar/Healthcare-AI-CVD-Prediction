from django.db import models
from django.contrib.auth.models import User
from patients.models import Patient

class Prediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='predictions')
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True, related_name='predictions')
    
    prediction = models.IntegerField(help_text="0 = No CVD, 1 = CVD Present")
    risk_probability = models.FloatField(help_text="Model predicted probability (0.0 - 1.0)")
    risk_percentage = models.FloatField(help_text="Model risk percentage (0.0% - 100.0%)")
    risk_level = models.CharField(max_length=50, help_text="Categorical risk level (LOW, MODERATE, HIGH, VERY HIGH)")
    
    top_risk_factors = models.JSONField(help_text="Top risk factors based on SHAP contribution")
    shap_explanation = models.JSONField(help_text="Full SHAP feature contribution breakdown")
    input_features = models.JSONField(help_text="Raw & preprocessed input parameters used for prediction")
    
    counterfactual_scenario = models.JSONField(default=dict, blank=True, null=True, help_text="Actionable counterfactual scenario & risk delta")
    model_metadata = models.JSONField(default=dict, blank=True, null=True, help_text="Research & doctor model audit metadata")

    model_version = models.CharField(max_length=50, default="XGBoost_v1.0")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Prediction #{self.id} - User: {self.user.username} - Risk: {self.risk_level} ({self.risk_percentage}%)"
