from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USER_TYPE_CHOICES = [
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('nurse', 'Nurse'),
        ('admin', 'Admin'),
    ]
    
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='patient')
    email = models.EmailField(unique=True)
    
    def __str__(self):
        return f"{self.username} ({self.user_type})"


class Doctor(models.Model):
    SPECIALIST_CHOICES = [
        ('eye', 'Eye Specialist'),
        ('cardiologist', 'Cardiologist'),
        ('gynecologist', 'Gynecologist'),
        ('neurologist', 'Neurologist'),
        ('orthopedic', 'Orthopedic'),
        ('dermatologist', 'Dermatologist'),
        ('pediatrician', 'Pediatrician'),
        ('psychiatrist', 'Psychiatrist'),
        ('general', 'General Physician'),
    ]
    
    LOCATION_CHOICES = [
        ('dhaka', 'Dhaka'),
        ('chittagong', 'Chittagong'),
        ('rajshahi', 'Rajshahi'),
        ('khulna', 'Khulna'),
        ('barisal', 'Barisal'),
        ('sylhet', 'Sylhet'),
        ('rangpur', 'Rangpur'),
        ('mymensingh', 'Mymensingh'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialist = models.CharField(max_length=20, choices=SPECIALIST_CHOICES)
    location = models.CharField(max_length=20, choices=LOCATION_CHOICES)
    phone = models.CharField(max_length=15, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    bio = models.TextField(blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Dr. {self.user.get_full_name() or self.user.username} - {self.get_specialist_display()}"


class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    phone = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} (Patient)"


class Nurse(models.Model):
    LOCATION_CHOICES = [
        ('dhaka', 'Dhaka'),
        ('chittagong', 'Chittagong'),
        ('rajshahi', 'Rajshahi'),
        ('khulna', 'Khulna'),
        ('barisal', 'Barisal'),
        ('sylhet', 'Sylhet'),
        ('rangpur', 'Rangpur'),
        ('mymensingh', 'Mymensingh'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='nurse_profile')
    location = models.CharField(max_length=20, choices=LOCATION_CHOICES)
    phone = models.CharField(max_length=15, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    bio = models.TextField(blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Nurse {self.user.get_full_name() or self.user.username} - {self.get_location_display()}"

