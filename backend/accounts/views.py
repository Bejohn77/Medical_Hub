from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import Doctor, Patient, Nurse
from .serializers import (
    UserRegistrationSerializer, DoctorRegistrationSerializer, PatientRegistrationSerializer, NurseRegistrationSerializer,
    UserLoginSerializer, UserSerializer, DoctorSerializer, PatientSerializer, NurseSerializer
)

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register_patient(request):
    print("Patient registration request data:", request.data)
    serializer = PatientRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        patient = serializer.save()
        refresh = RefreshToken.for_user(patient.user)
        return Response({
            'user': UserSerializer(patient.user).data,
            'patient': PatientSerializer(patient).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    print("Patient registration errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_doctor(request):
    print("Doctor registration request data:", request.data)
    serializer = DoctorRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        doctor = serializer.save()
        refresh = RefreshToken.for_user(doctor.user)
        return Response({
            'user': UserSerializer(doctor.user).data,
            'doctor': DoctorSerializer(doctor).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    print("Doctor registration errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_nurse(request):
    serializer = NurseRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        nurse = serializer.save()
        refresh = RefreshToken.for_user(nurse.user)
        return Response({
            'user': UserSerializer(nurse.user).data,
            'nurse': NurseSerializer(nurse).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        response_data = {
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }
        
        # Add profile data based on user type
        if user.user_type == 'doctor':
            try:
                doctor = Doctor.objects.get(user=user)
                response_data['doctor'] = DoctorSerializer(doctor).data
            except Doctor.DoesNotExist:
                pass
        elif user.user_type == 'patient':
            try:
                patient = Patient.objects.get(user=user)
                response_data['patient'] = PatientSerializer(patient).data
            except Patient.DoesNotExist:
                pass
        elif user.user_type == 'nurse':
            try:
                nurse = Nurse.objects.get(user=user)
                response_data['nurse'] = NurseSerializer(nurse).data
            except Nurse.DoesNotExist:
                pass
        
        return Response(response_data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    response_data = {'user': UserSerializer(user).data}
    
    if user.user_type == 'doctor':
        try:
            doctor = Doctor.objects.get(user=user)
            response_data['doctor'] = DoctorSerializer(doctor).data
        except Doctor.DoesNotExist:
            pass
    elif user.user_type == 'patient':
        try:
            patient = Patient.objects.get(user=user)
            response_data['patient'] = PatientSerializer(patient).data
        except Patient.DoesNotExist:
            pass
    elif user.user_type == 'nurse':
        try:
            nurse = Nurse.objects.get(user=user)
            response_data['nurse'] = NurseSerializer(nurse).data
        except Nurse.DoesNotExist:
            pass
    
    return Response(response_data)


class DoctorListView(generics.ListAPIView):
    queryset = Doctor.objects.filter(is_available=True)
    serializer_class = DoctorSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Doctor.objects.filter(is_available=True)
        specialist = self.request.query_params.get('specialist', None)
        location = self.request.query_params.get('location', None)
        
        if specialist:
            queryset = queryset.filter(specialist=specialist)
        if location:
            queryset = queryset.filter(location=location)
        
        return queryset


class NurseListView(generics.ListAPIView):
    queryset = Nurse.objects.filter(is_available=True)
    serializer_class = NurseSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Nurse.objects.filter(is_available=True)
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(location=location)
        return queryset


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nurse_detail(request, pk):
    try:
        nurse = Nurse.objects.get(pk=pk, is_available=True)
        serializer = NurseSerializer(nurse)
        return Response(serializer.data)
    except Nurse.DoesNotExist:
        return Response({'error': 'Nurse not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_detail(request, pk):
    try:
        doctor = Doctor.objects.get(pk=pk, is_available=True)
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)
    except Doctor.DoesNotExist:
        return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)
