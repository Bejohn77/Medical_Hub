from django.urls import path
from . import views

urlpatterns = [
    path('register/patient/', views.register_patient, name='register_patient'),
    path('register/doctor/', views.register_doctor, name='register_doctor'),
    path('register/nurse/', views.register_nurse, name='register_nurse'),
    path('login/', views.login, name='login'),
    path('profile/', views.user_profile, name='user_profile'),
    path('doctors/', views.DoctorListView.as_view(), name='doctor_list'),
    path('doctors/<int:pk>/', views.doctor_detail, name='doctor_detail'),
    path('nurses/', views.NurseListView.as_view(), name='nurse_list'),
    path('nurses/<int:pk>/', views.nurse_detail, name='nurse_detail'),
]

