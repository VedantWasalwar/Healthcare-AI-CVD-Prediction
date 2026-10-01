from rest_framework import serializers
from report_analysis.models import ReportAnalysis

class ReportAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportAnalysis
        fields = [
            'id',
            'original_filename',
            'file_type',
            'status',
            'ocr_text',
            'extracted_data',
            'missing_fields',
            'created_at',
            'updated_at'
        ]

class ReportConfirmSerializer(serializers.Serializer):
    """
    Serializer for confirming & completing user-reviewed extracted metrics.
    """
    age = serializers.FloatField(required=True)
    gender = serializers.IntegerField(required=True)
    height = serializers.FloatField(required=True)
    weight = serializers.FloatField(required=True)
    ap_hi = serializers.FloatField(required=True)
    ap_lo = serializers.FloatField(required=True)
    cholesterol = serializers.IntegerField(required=True)
    gluc = serializers.IntegerField(required=True)
    smoke = serializers.IntegerField(required=True)
    alco = serializers.IntegerField(required=True)
    active = serializers.IntegerField(required=True)

    def validate_gender(self, value):
        if value not in [1, 2]:
            raise serializers.ValidationError("Gender must be 1 (Female) or 2 (Male).")
        return value

    def validate_ap_hi(self, value):
        if value < 70 or value > 240:
            raise serializers.ValidationError("ap_hi must be between 70 and 240.")
        return value

    def validate_ap_lo(self, value):
        if value < 40 or value > 160:
            raise serializers.ValidationError("ap_lo must be between 40 and 160.")
        return value

    def validate(self, data):
        if data.get('ap_lo') >= data.get('ap_hi'):
            raise serializers.ValidationError({"ap_lo": "Diastolic BP (ap_lo) must be less than Systolic BP (ap_hi)."})
        return data
