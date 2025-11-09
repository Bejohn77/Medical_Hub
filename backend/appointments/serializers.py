from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Appointment, NurseAppointment
from accounts.serializers import UserSerializer

User = get_user_model()


class AppointmentSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    doctor = UserSerializer(read_only=True)
    patient_id = serializers.IntegerField(write_only=True)
    doctor_id = serializers.IntegerField(write_only=True, help_text="Doctor's User ID (not Doctor model ID)")
    
    class Meta:
        model = Appointment
        fields = ('id', 'patient', 'doctor', 'patient_id', 'doctor_id', 'status', 
                 'appointment_date', 'appointment_time', 'reason', 'notes', 
                 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def validate(self, attrs):
        patient_id = attrs.get('patient_id')
        doctor_id = attrs.get('doctor_id')
        
        print(f"Validating appointment: patient_id={patient_id}, doctor_id={doctor_id}")
        
        # Validate patient exists and is a patient
        if patient_id:
            try:
                patient = User.objects.get(id=patient_id, user_type='patient')
                attrs['patient'] = patient
                print(f"Found patient: {patient}")
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid patient ID")
        
        # Validate doctor exists and is a doctor
        if doctor_id:
            try:
                doctor = User.objects.get(id=doctor_id, user_type='doctor')
                attrs['doctor'] = doctor
                print(f"Found doctor: {doctor}")
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid doctor ID")
        
        # Check for conflicting appointments
        appointment_date = attrs.get('appointment_date')
        appointment_time = attrs.get('appointment_time')
        
        if doctor_id and appointment_date and appointment_time:
            try:
                doctor = User.objects.get(id=doctor_id, user_type='doctor')
                if Appointment.objects.filter(
                    doctor=doctor,
                    appointment_date=appointment_date,
                    appointment_time=appointment_time,
                    status__in=['pending', 'approved']
                ).exists():
                    raise serializers.ValidationError("Doctor already has an appointment at this time")
            except User.DoesNotExist:
                raise serializers.ValidationError("Doctor not found")
        
        return attrs


class AppointmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ('status', 'notes')
    
    def validate_status(self, value):
        if value not in ['pending', 'approved', 'cancelled', 'completed']:
            raise serializers.ValidationError("Invalid status")
        return value


class NurseAppointmentSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    nurse = UserSerializer(read_only=True)
    patient_id = serializers.IntegerField(write_only=True)
    nurse_id = serializers.IntegerField(write_only=True, help_text="Nurse's User ID")
    
    class Meta:
        model = NurseAppointment
        fields = ('id', 'patient', 'nurse', 'patient_id', 'nurse_id', 'status', 
                 'appointment_date', 'appointment_time', 'reason', 'notes', 
                 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def validate(self, attrs):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        patient_id = attrs.get('patient_id')
        nurse_id = attrs.get('nurse_id')
        
        if patient_id:
            try:
                patient = User.objects.get(id=patient_id, user_type='patient')
                attrs['patient'] = patient
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid patient ID")
        if nurse_id:
            try:
                nurse = User.objects.get(id=nurse_id, user_type='nurse')
                attrs['nurse'] = nurse
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid nurse ID")
        appointment_date = attrs.get('appointment_date')
        appointment_time = attrs.get('appointment_time')
        if nurse_id and appointment_date and appointment_time:
            try:
                nurse = User.objects.get(id=nurse_id, user_type='nurse')
                if NurseAppointment.objects.filter(
                    nurse=nurse,
                    appointment_date=appointment_date,
                    appointment_time=appointment_time,
                    status__in=['pending', 'approved']
                ).exists():
                    raise serializers.ValidationError("Nurse already has an appointment at this time")
            except User.DoesNotExist:
                raise serializers.ValidationError("Nurse not found")
        return attrs


class NurseAppointmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NurseAppointment
        fields = ('status', 'notes')
    
    def validate_status(self, value):
        if value not in ['pending', 'approved', 'cancelled', 'completed']:
            raise serializers.ValidationError("Invalid status")
        return value
