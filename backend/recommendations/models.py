from django.db import models
from django.contrib.auth.models import User
from prediction.models import Prediction

class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations')
    prediction = models.ForeignKey(Prediction, on_delete=models.CASCADE, related_name='recommendation_records')
    
    category = models.CharField(max_length=100)
    priority = models.CharField(max_length=20, choices=[('High', 'High'), ('Moderate', 'Moderate'), ('General', 'General')])
    title = models.CharField(max_length=255)
    message = models.TextField()
    reason = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Recommendation #{self.id} ({self.category} - {self.priority}) for User: {self.user.username}"
