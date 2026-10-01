from rest_framework import serializers
from prediction.models import Prediction

class PredictionInputSerializer(serializers.Serializer):
    age = serializers.FloatField(required=True, help_text="Age in years (18-120)")
    gender = serializers.IntegerField(required=True, help_text="1 = Female, 2 = Male")
    height = serializers.FloatField(required=True, help_text="Height in cm (100-220)")
    weight = serializers.FloatField(required=True, help_text="Weight in kg (30-250)")
    ap_hi = serializers.FloatField(required=True, help_text="Systolic Blood Pressure mm Hg (70-240)")
    ap_lo = serializers.FloatField(required=True, help_text="Diastolic Blood Pressure mm Hg (40-160)")
    cholesterol = serializers.IntegerField(required=True, help_text="1: Normal, 2: Above Normal, 3: High")
    gluc = serializers.IntegerField(required=True, help_text="1: Normal, 2: Above Normal, 3: High")
    smoke = serializers.IntegerField(required=True, help_text="0: Non-smoker, 1: Smoker")
    alco = serializers.IntegerField(required=True, help_text="0: No alcohol, 1: Alcohol intake")
    active = serializers.IntegerField(required=True, help_text="0: Non-active, 1: Physical activity")

    def validate_age(self, value):
        if value < 18 or value > 120:
            raise serializers.ValidationError("Age must be between 18 and 120 years.")
        return value

    def validate_gender(self, value):
        if value not in [1, 2]:
            raise serializers.ValidationError("Gender must be 1 (Female) or 2 (Male).")
        return value

    def validate_height(self, value):
        if value < 100 or value > 220:
            raise serializers.ValidationError("Height must be between 100 cm and 220 cm.")
        return value

    def validate_weight(self, value):
        if value < 30 or value > 250:
            raise serializers.ValidationError("Weight must be between 30 kg and 250 kg.")
        return value

    def validate_ap_hi(self, value):
        if value < 70 or value > 240:
            raise serializers.ValidationError("Systolic blood pressure (ap_hi) must be between 70 mm Hg and 240 mm Hg.")
        return value

    def validate_ap_lo(self, value):
        if value < 40 or value > 160:
            raise serializers.ValidationError("Diastolic blood pressure (ap_lo) must be between 40 mm Hg and 160 mm Hg.")
        return value

    def validate_cholesterol(self, value):
        if value not in [1, 2, 3]:
            raise serializers.ValidationError("Cholesterol must be 1 (Normal), 2 (Above Normal), or 3 (High).")
        return value

    def validate_gluc(self, value):
        if value not in [1, 2, 3]:
            raise serializers.ValidationError("Glucose (gluc) must be 1 (Normal), 2 (Above Normal), or 3 (High).")
        return value

    def validate_smoke(self, value):
        if value not in [0, 1]:
            raise serializers.ValidationError("Smoking status must be 0 (No) or 1 (Yes).")
        return value

    def validate_alco(self, value):
        if value not in [0, 1]:
            raise serializers.ValidationError("Alcohol status must be 0 (No) or 1 (Yes).")
        return value

    def validate_active(self, value):
        if value not in [0, 1]:
            raise serializers.ValidationError("Physical activity status must be 0 (No) or 1 (Yes).")
        return value

    def validate(self, data):
        ap_hi = data.get('ap_hi')
        ap_lo = data.get('ap_lo')
        if ap_hi is not None and ap_lo is not None:
            if ap_lo >= ap_hi:
                raise serializers.ValidationError({"ap_lo": "Diastolic blood pressure (ap_lo) must be less than Systolic blood pressure (ap_hi)."})
        return data

class PredictionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = [
            'id',
            'prediction',
            'risk_level',
            'risk_probability',
            'risk_percentage',
            'top_risk_factors',
            'shap_explanation',
            'counterfactual_scenario',
            'model_metadata',
            'input_features',
            'model_version',
            'created_at'
        ]
