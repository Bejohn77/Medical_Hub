from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'status', 'appointment_date', 'appointment_time', 'created_at')
    list_filter = ('status', 'appointment_date', 'created_at')
    search_fields = ('patient__username', 'doctor__username', 'reason')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'appointment_date'




