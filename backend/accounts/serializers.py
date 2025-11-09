from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Doctor, Patient, Nurse


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'user_type', 'first_name', 'last_name')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class DoctorRegistrationSerializer(serializers.ModelSerializer):
    user = UserRegistrationSerializer()
    
    class Meta:
        model = Doctor
        fields = ('user', 'specialist', 'location', 'phone', 'experience_years', 'consultation_fee', 'bio')
    
    def validate_specialist(self, value):
        if not value:
            raise serializers.ValidationError("Specialist is required")
        return value
    
    def validate_location(self, value):
        if not value:
            raise serializers.ValidationError("Location is required")
        return value
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_serializer = UserRegistrationSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            doctor = Doctor.objects.create(user=user, **validated_data)
            return doctor
        else:
            print("User registration errors:", user_serializer.errors)
            raise serializers.ValidationError(user_serializer.errors)


class PatientRegistrationSerializer(serializers.ModelSerializer):
    user = UserRegistrationSerializer()
    
    class Meta:
        model = Patient
        fields = ('user', 'phone', 'date_of_birth', 'address', 'emergency_contact')
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_serializer = UserRegistrationSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            patient = Patient.objects.create(user=user, **validated_data)
            return patient
        else:
            raise serializers.ValidationError(user_serializer.errors)


class NurseRegistrationSerializer(serializers.ModelSerializer):
    user = UserRegistrationSerializer()
    
    class Meta:
        model = Nurse
        fields = ('user', 'location', 'phone', 'experience_years', 'consultation_fee', 'bio')
    
    def validate_location(self, value):
        if not value:
            raise serializers.ValidationError("Location is required")
        return value
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        # Force user_type to nurse regardless of incoming value
        user_data['user_type'] = 'nurse'
        user_serializer = UserRegistrationSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            nurse = Nurse.objects.create(user=user, **validated_data)
            return nurse
        else:
            raise serializers.ValidationError(user_serializer.errors)


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include username and password')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'user_type', 'first_name', 'last_name', 'is_active')


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Doctor
        fields = ('id', 'user', 'specialist', 'location', 'phone', 'experience_years', 
                 'consultation_fee', 'bio', 'is_available', 'created_at')


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Patient
        fields = ('id', 'user', 'phone', 'date_of_birth', 'address', 'emergency_contact', 'created_at')


class NurseSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Nurse
        fields = ('id', 'user', 'location', 'phone', 'experience_years', 
                 'consultation_fee', 'bio', 'is_available', 'created_at')
