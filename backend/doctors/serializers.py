from rest_framework import serializers
from doctors.models import Doctor

class DoctorSerializer(serializers.ModelSerializer):
    specialty_display = serializers.CharField(source='get_specialty_display', read_only=True)

    class Meta:
        model = Doctor
        fields = [
            'id',
            'name',
            'specialty',
            'specialty_display',
            'qualification',
            'hospital_name',
            'phone',
            'email',
            'address',
            'city',
            'latitude',
            'longitude',
            'rating',
            'experience_years',
            'emergency_support'
        ]
