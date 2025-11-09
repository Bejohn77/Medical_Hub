from django.contrib import admin
from .models import Hospital, HospitalSpecialist


@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'city', 'rating', 'is_active', 'created_at']
    list_filter = ['country', 'is_active', 'created_at']
    search_fields = ['name', 'city', 'address']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'country', 'city', 'address', 'is_active')
        }),
        ('Contact Information', {
            'fields': ('phone', 'email', 'website')
        }),
        ('Medical Services', {
            'fields': ('surgery_types', 'rating', 'description')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(HospitalSpecialist)
class HospitalSpecialistAdmin(admin.ModelAdmin):
    list_display = ['name', 'specialization', 'hospital', 'experience_years', 'is_available']
    list_filter = ['specialization', 'is_available', 'hospital']
    search_fields = ['name', 'specialization', 'hospital__name']
