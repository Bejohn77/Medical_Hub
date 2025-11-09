from django.db import models


class Hospital(models.Model):
    SURGERY_TYPE_CHOICES = [
        ('open_heart', 'Open Heart Surgery'),
        ('bypass', 'Bypass Surgery (CABG)'),
        ('valve_replacement', 'Valve Replacement Surgery'),
        ('pacemaker', 'Pacemaker Implantation'),
        ('brain_tumor', 'Brain Tumor Surgery'),
        ('spinal_cord', 'Spinal Cord Surgery'),
        ('joint_replacement', 'Joint Replacement (Knee / Hip)'),
        ('spine_fixation', 'Spine Fixation Surgery'),
        ('lasik', 'LASIK / Vision Correction Surgery'),
        ('retinal_detachment', 'Retinal Detachment Repair'),
        ('prostate_cancer', 'Prostate Cancer Surgery'),
        ('lung_cancer', 'Lung Cancer Surgery'),
    ]
    
    COUNTRY_CHOICES = [
        ('bangladesh', 'Bangladesh'),
        ('abroad', 'Abroad'),
    ]
    
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=20, choices=COUNTRY_CHOICES)
    city = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)
    surgery_types = models.JSONField(default=list, help_text="List of surgery types this hospital performs")
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00, help_text="Hospital rating out of 5.0")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-rating', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.get_country_display()}"
    
    def get_surgery_types_display(self):
        """Return human-readable surgery types"""
        return [dict(self.SURGERY_TYPE_CHOICES).get(st, st) for st in self.surgery_types]


class HospitalSpecialist(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='specialists')
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    experience_years = models.PositiveIntegerField(default=0)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Dr. {self.name} - {self.specialization} at {self.hospital.name}"

