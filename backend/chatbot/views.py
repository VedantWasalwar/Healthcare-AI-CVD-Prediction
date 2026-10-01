import re
import os
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from report_analysis.ocr_service import OCRService

EMERGENCY_KEYWORDS = [
    'chest pain', 'chest pressure', 'breathless', 'difficulty breathing',
    'fainting', 'unconscious', 'severe weakness', 'heart attack', 'stabbing pain',
    'choking', 'left arm pain'
]

MEDICINE_KNOWLEDGE_BASE = {
    'amlodipine': {
        'purpose': 'Amlodipine is a calcium channel blocker commonly prescribed to treat high blood pressure (hypertension) and chest pain (angina).',
        'missed_dose': 'If you miss a dose, take it as soon as you remember. If it is almost time for your next dose, skip the missed dose and resume your regular schedule. Never double the dose.',
        'precautions': 'May cause mild ankle swelling or dizziness. Do not stop taking this medication abruptly without consulting your doctor or cardiologist.'
    },
    'atorvastatin': {
        'purpose': 'Atorvastatin is a statin medication used to lower LDL (bad) cholesterol and triglycerides in the blood, reducing cardiovascular disease risk.',
        'missed_dose': 'Take the missed dose as soon as you remember within 12 hours. If more than 12 hours have passed, skip the missed dose. Never take two doses at once.',
        'precautions': 'Avoid excessive grapefruit juice intake. Report unexplained muscle pain or weakness to your doctor promptly.'
    },
    'telmisartan': {
        'purpose': 'Telmisartan is an angiotensin II receptor blocker (ARB) used to lower high blood pressure and protect kidney function in hypertensive patients.',
        'missed_dose': 'Take the missed dose as soon as possible. If it is nearly time for the next scheduled dose, skip the missed dose. Do not double up.',
        'precautions': 'Stay well-hydrated. Periodic monitoring of blood pressure and kidney function is recommended by your physician.'
    },
    'metformin': {
        'purpose': 'Metformin is an oral antidiabetic medication used to manage type 2 diabetes by improving insulin sensitivity and blood glucose levels.',
        'missed_dose': 'Take the missed dose with meals as soon as you remember. Skip if it is close to your next meal time.',
        'precautions': 'Take with meals to minimize mild stomach upset. Inform your doctor if you undergo procedures involving intravenous contrast dye.'
    },
    'aspirin': {
        'purpose': 'Low-dose aspirin is an antiplatelet agent used under clinical guidance to prevent blood clots and reduce secondary cardiac event risk.',
        'missed_dose': 'Take the missed dose as soon as possible. Skip if it is almost time for the next scheduled dose.',
        'precautions': 'Take with food to prevent gastric irritation. Never initiate or stop aspirin therapy without explicit clinical recommendation.'
    }
}

class TextChatView(APIView):
    """
    POST /api/chat/
    Mode 1: Text Chatbot with medical safety rules and emergency symptom detection.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        message = request.data.get('message', '').strip()
        if not message:
            return Response({"success": False, "error": "Message text is required."}, status=status.HTTP_400_BAD_REQUEST)

        msg_lower = message.lower()

        # Check Emergency Symptoms
        is_emergency = any(kw in msg_lower for kw in EMERGENCY_KEYWORDS)
        if is_emergency:
            return Response({
                "success": True,
                "is_emergency": True,
                "response": "EMERGENCY WARNING: The symptoms you described (chest pain, severe breathing difficulty, fainting) may indicate a life-threatening medical emergency. Please seek emergency medical care immediately or call emergency services (112 / 108)."
            }, status=status.HTTP_200_OK)

        # Knowledge Q&A Matching
        if 'bp' in msg_lower or 'blood pressure' in msg_lower:
            reply = "Blood pressure measures the force of blood flowing through your arteries. Systolic (top number, ideal < 120) represents pressure when the heart beats, while Diastolic (bottom number, ideal < 80) represents pressure when the heart rests between beats. Persistent readings above 130/80 mmHg indicate hypertension."
        elif 'cholesterol' in msg_lower:
            reply = "Cholesterol is a waxy substance produced by the liver and obtained from foods. HDL is 'good' cholesterol that protects arteries, while elevated LDL ('bad' cholesterol) can build up plaque in coronary arteries. Maintaining balanced cholesterol reduces cardiovascular risk."
        elif 'risk' in msg_lower or 'score' in msg_lower:
            reply = "Your HeartCare AI risk score estimates the probability of cardiovascular events based on 12 validated clinical metrics (age, BP, BMI, cholesterol, glucose, lifestyle factors). A high model score warrants timely professional medical evaluation."
        elif 'exercise' in msg_lower or 'physical activity' in msg_lower:
            reply = "Regular aerobic exercise (e.g. brisk walking 150 minutes per week) improves heart muscle strength, lowers blood pressure, enhances HDL cholesterol, and helps maintain a healthy weight."
        else:
            reply = f"Thank you for asking about '{message}'. HeartCare AI provides educational decision support. For personalized medical evaluation and diagnosis, please consult a qualified physician or cardiologist."

        return Response({
            "success": True,
            "is_emergency": False,
            "response": reply
        }, status=status.HTTP_200_OK)

class VoiceChatView(APIView):
    """
    POST /api/chat/voice/
    Mode 2: Voice Chatbot supporting English and Hindi speech processing architecture.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        query_text = request.data.get('query_text', '').strip()
        language = request.data.get('language', 'en').lower()

        if not query_text:
            return Response({"success": False, "error": "Query text from speech recognition is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Process intent
        if 'नमस्ते' in query_text or 'हार्ट' in query_text or 'बीपी' in query_text:
            spoken_response = "हार्टकेयर एआई में आपका स्वागत है। उच्च रक्तचाप (बीपी) और कोलेस्ट्रॉल की नियमित जांच कराना हृदय स्वास्थ्य के लिए आवश्यक है।"
        else:
            spoken_response = f"Received your query in {language.upper()}: '{query_text}'. Regular monitoring of blood pressure, exercise, and balanced diet are key to cardiovascular health."

        return Response({
            "success": True,
            "language": language,
            "query_text": query_text,
            "spoken_response": spoken_response
        }, status=status.HTTP_200_OK)

class MedicalImageAnalyzeView(APIView):
    """
    POST /api/medical-image/analyze/
    Mode 3: Medical Image / Prescription / Medicine Strip OCR Analysis.
    Returns 3 structured cards (Purpose, Missed Dose, Precautions).
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if 'file' not in request.FILES and 'image' not in request.FILES:
            return Response({"success": False, "error": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES.get('file') or request.FILES.get('image')
        filename = uploaded_file.name
        ext = filename.split('.')[-1].lower() if '.' in filename else 'jpg'

        # Save temporary file for OCR
        media_dir = os.path.join('media', 'temp_images')
        os.makedirs(media_dir, exist_ok=True)
        temp_path = os.path.join(media_dir, filename)

        with open(temp_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        try:
            ocr_text = OCRService.extract_text_from_file(temp_path, ext)
        except Exception:
            ocr_text = filename

        ocr_lower = ocr_text.lower()
        matched_med = None

        for med_key in MEDICINE_KNOWLEDGE_BASE.keys():
            if med_key in ocr_lower:
                matched_med = med_key
                break

        if not matched_med:
            # Fallback general card if specific medicine name not matched
            card1 = "Identified as a general prescription or health document. Common cardiovascular medications include anti-hypertensives, statins, and antiplatelet therapy."
            card2 = "If a dose is missed, take it when remembered unless close to the next scheduled dose. Never double up on prescribed medications."
            card3 = "Always verify prescriptions with a licensed pharmacist or prescribing physician. Do not alter doses without clinical approval."
            detected_name = "General Prescribed Document / Medical Strip"
        else:
            info = MEDICINE_KNOWLEDGE_BASE[matched_med]
            card1 = info['purpose']
            card2 = info['missed_dose']
            card3 = info['precautions']
            detected_name = matched_med.capitalize()

        return Response({
            "success": True,
            "detected_item": detected_name,
            "extracted_text_preview": ocr_text[:200],
            "cards": {
                "card1_purpose": card1,
                "card2_missed_dose": card2,
                "card3_precautions": card3
            },
            "disclaimer": "Informational medicine breakdown only. Always consult your doctor or pharmacist before making medication changes."
        }, status=status.HTTP_200_OK)
