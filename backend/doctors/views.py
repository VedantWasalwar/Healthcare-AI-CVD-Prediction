from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from doctors.models import Doctor
from doctors.serializers import DoctorSerializer

DEFAULT_DOCTORS = [
    {
        "name": "Dr. Rajesh Sharma",
        "specialty": "CARDIOLOGIST",
        "qualification": "MD (Gen Med), DM (Cardiology), FACC",
        "hospital_name": "Apollo Heart Institute",
        "phone": "+91 98200 12345",
        "email": "dr.sharma@apolloheart.org",
        "address": "Opp. High School, Off Main Road, Bandra West",
        "city": "Mumbai",
        "latitude": 19.0596,
        "longitude": 72.8295,
        "rating": 4.9,
        "experience_years": 18,
        "emergency_support": True
    },
    {
        "name": "Dr. Sunita Patel",
        "specialty": "CARDIOLOGIST",
        "qualification": "MBBS, MD, DNB (Cardiology)",
        "hospital_name": "Fortis Cardiac Care Center",
        "phone": "+91 98211 67890",
        "email": "dr.patel@fortiscardiac.com",
        "address": "Mulund Goregaon Link Rd, Bhandup West",
        "city": "Mumbai",
        "latitude": 19.1500,
        "longitude": 72.9400,
        "rating": 4.8,
        "experience_years": 14,
        "emergency_support": True
    },
    {
        "name": "Dr. Amit Verma",
        "specialty": "GENERAL_PHYSICIAN",
        "qualification": "MBBS, MD (Internal Medicine)",
        "hospital_name": "City Wellness Clinic",
        "phone": "+91 98333 45678",
        "email": "dr.verma@citywellness.in",
        "address": "Suite 204, Healthcare Plaza, Andheri East",
        "city": "Mumbai",
        "latitude": 19.1197,
        "longitude": 72.8464,
        "rating": 4.7,
        "experience_years": 10,
        "emergency_support": False
    },
    {
        "name": "Dr. Priya Deshmukh",
        "specialty": "ENDOCRINOLOGIST",
        "qualification": "MD, DM (Endocrinology & Metabolism)",
        "hospital_name": "Max Healthcare Diabetes & Metabolic Center",
        "phone": "+91 98444 89012",
        "email": "dr.priya@maxhealth.org",
        "address": "12 Park View Road, Dadar West",
        "city": "Mumbai",
        "latitude": 19.0178,
        "longitude": 72.8478,
        "rating": 4.9,
        "experience_years": 15,
        "emergency_support": True
    }
]

def seed_default_doctors():
    if Doctor.objects.count() == 0:
        for d in DEFAULT_DOCTORS:
            Doctor.objects.create(**d)

class DoctorListView(APIView):
    """
    GET /api/doctors/
    GET /api/doctors/nearby/
    Returns list of recommended doctors and clinics based on risk level and specialty.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        seed_default_doctors()
        
        risk_level = request.query_params.get('risk_level', '').upper()
        specialty = request.query_params.get('specialty', '').upper()

        queryset = Doctor.objects.all()

        if specialty:
            queryset = queryset.filter(specialty=specialty)
        elif risk_level in ['HIGH', 'VERY HIGH']:
            # Prioritize Cardiologists for high risk patients
            queryset = queryset.filter(specialty='CARDIOLOGIST')
        elif risk_level in ['LOW', 'MODERATE']:
            # General Physician for low/moderate risk
            queryset = queryset.filter(specialty__in=['GENERAL_PHYSICIAN', 'CARDIOLOGIST'])

        serializer = DoctorSerializer(queryset, many=True)
        return Response({
            "success": True,
            "count": queryset.count(),
            "results": serializer.data,
            "recommendation_guidance": (
                "For High or Very High CVD Risk, a consultation with a Cardiologist is strongly recommended. "
                "For Low or Moderate Risk, a General Physician consultation is recommended for routine monitoring."
            )
        }, status=status.HTTP_200_OK)
