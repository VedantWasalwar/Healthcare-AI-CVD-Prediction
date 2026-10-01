from rest_framework import serializers
from recommendations.models import Recommendation

class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = [
            'id',
            'category',
            'priority',
            'title',
            'message',
            'reason',
            'created_at'
        ]

class RecommendationGenerateSerializer(serializers.Serializer):
    prediction_id = serializers.IntegerField(required=True)
