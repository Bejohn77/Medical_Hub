from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Appointment, NurseAppointment
from .serializers import AppointmentSerializer, AppointmentUpdateSerializer, NurseAppointmentSerializer, NurseAppointmentUpdateSerializer

User = get_user_model()


class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.user_type == 'doctor':
            return Appointment.objects.filter(doctor=user)
        elif user.user_type == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.none()
    
    def perform_create(self, serializer):
        print("Creating appointment with data:", serializer.validated_data)
        print("Request user:", self.request.user)
        if self.request.user.user_type == 'patient':
            serializer.save(patient=self.request.user)
        else:
            serializer.save()


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.user_type == 'doctor':
            return Appointment.objects.filter(doctor=user)
        elif user.user_type == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return AppointmentUpdateSerializer
        return AppointmentSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_appointments(request):
    user = request.user
    appointments = Appointment.objects.none()
    
    if user.user_type == 'patient':
        appointments = Appointment.objects.filter(patient=user)
    elif user.user_type == 'doctor':
        appointments = Appointment.objects.filter(doctor=user)
    elif user.user_type == 'admin':
        appointments = Appointment.objects.all()
    
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_appointment_status(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
        
        # Check permissions
        if request.user.user_type == 'doctor' and appointment.doctor != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        elif request.user.user_type == 'patient' and appointment.patient != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        elif request.user.user_type not in ['doctor', 'patient', 'admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = AppointmentUpdateSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(AppointmentSerializer(appointment).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)


class NurseAppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = NurseAppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return NurseAppointment.objects.filter(patient=user)
        elif user.user_type == 'nurse':
            return NurseAppointment.objects.filter(nurse=user)
        elif user.user_type == 'admin':
            return NurseAppointment.objects.all()
        return NurseAppointment.objects.none()
    
    def perform_create(self, serializer):
        if self.request.user.user_type == 'patient':
            serializer.save(patient=self.request.user)
        else:
            serializer.save()


class NurseAppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NurseAppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return NurseAppointment.objects.filter(patient=user)
        elif user.user_type == 'nurse':
            return NurseAppointment.objects.filter(nurse=user)
        elif user.user_type == 'admin':
            return NurseAppointment.objects.all()
        return NurseAppointment.objects.none()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return NurseAppointmentUpdateSerializer
        return NurseAppointmentSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_nurse_appointments(request):
    user = request.user
    appointments = NurseAppointment.objects.none()
    if user.user_type == 'patient':
        appointments = NurseAppointment.objects.filter(patient=user)
    elif user.user_type == 'nurse':
        appointments = NurseAppointment.objects.filter(nurse=user)
    elif user.user_type == 'admin':
        appointments = NurseAppointment.objects.all()
    serializer = NurseAppointmentSerializer(appointments, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_nurse_appointment_status(request, pk):
    try:
        appointment = NurseAppointment.objects.get(pk=pk)
        if request.user.user_type == 'nurse' and appointment.nurse != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        elif request.user.user_type == 'patient' and appointment.patient != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        elif request.user.user_type not in ['nurse', 'patient', 'admin']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        serializer = NurseAppointmentUpdateSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(NurseAppointmentSerializer(appointment).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except NurseAppointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
