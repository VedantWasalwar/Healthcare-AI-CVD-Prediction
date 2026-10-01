from django.urls import path
from doctors.views import DoctorListView

urlpatterns = [
    path('', DoctorListView.as_view(), name='doctor_list'),
    path('nearby/', DoctorListView.as_view(), name='doctor_nearby'),
]
