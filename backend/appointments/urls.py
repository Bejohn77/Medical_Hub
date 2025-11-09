from django.urls import path
from . import views

urlpatterns = [
    path('', views.AppointmentListCreateView.as_view(), name='appointment_list_create'),
    path('<int:pk>/', views.AppointmentDetailView.as_view(), name='appointment_detail'),
    path('my-appointments/', views.my_appointments, name='my_appointments'),
    path('<int:pk>/update-status/', views.update_appointment_status, name='update_appointment_status'),
    path('nurses/', views.NurseAppointmentListCreateView.as_view(), name='nurse_appointment_list_create'),
    path('nurses/<int:pk>/', views.NurseAppointmentDetailView.as_view(), name='nurse_appointment_detail'),
    path('nurses/my-appointments/', views.my_nurse_appointments, name='my_nurse_appointments'),
    path('nurses/<int:pk>/update-status/', views.update_nurse_appointment_status, name='update_nurse_appointment_status'),
]




