from rest_framework import serializers
from medical_reports.models import MedicalReport

class MedicalReportSerializer(serializers.ModelSerializer):
    prediction_id = serializers.ReadOnlyField(source='prediction.id')
    risk_level = serializers.ReadOnlyField(source='prediction.risk_level')
    risk_percentage = serializers.ReadOnlyField(source='prediction.risk_percentage')

    class Meta:
        model = MedicalReport
        fields = [
            'id',
            'report_id',
            'prediction_id',
            'risk_level',
            'risk_percentage',
            'file_path',
            'created_at'
        ]

class MedicalReportGenerateSerializer(serializers.Serializer):
    prediction_id = serializers.IntegerField(required=True)
