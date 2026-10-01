from django.urls import path
from chatbot.views import TextChatView, VoiceChatView, MedicalImageAnalyzeView

urlpatterns = [
    path('text/', TextChatView.as_view(), name='chat_text'),
    path('voice/', VoiceChatView.as_view(), name='chat_voice'),
    path('medical-image/analyze/', MedicalImageAnalyzeView.as_view(), name='medical_image_analyze'),
]
