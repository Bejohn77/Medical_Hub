from django.urls import path
from . import views

urlpatterns = [
    path('', views.HospitalListView.as_view(), name='hospital_list'),
    path('<int:pk>/', views.HospitalDetailView.as_view(), name='hospital_detail'),
    path('search/', views.search_hospitals, name='search_hospitals'),
    path('surgery-types/', views.surgery_types, name='surgery_types'),
    path('countries/', views.countries, name='countries'),
]

