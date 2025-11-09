from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Hospital, HospitalSpecialist
from .serializers import HospitalSerializer, HospitalSearchSerializer


class HospitalListView(generics.ListAPIView):
    serializer_class = HospitalSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Hospital.objects.filter(is_active=True)


class HospitalDetailView(generics.RetrieveAPIView):
    serializer_class = HospitalSerializer
    permission_classes = [IsAuthenticated]
    queryset = Hospital.objects.filter(is_active=True)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def search_hospitals(request):
    """
    Search hospitals by surgery type and country
    """
    serializer = HospitalSearchSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    surgery_type = serializer.validated_data['surgery_type']
    country = serializer.validated_data['country']
    
    # Filter hospitals that perform the specified surgery type in the specified country
    hospitals = Hospital.objects.filter(
        is_active=True,
        country=country,
        surgery_types__contains=[surgery_type]
    ).order_by('-rating', 'name')
    
    hospital_serializer = HospitalSerializer(hospitals, many=True)
    return Response({
        'hospitals': hospital_serializer.data,
        'search_criteria': {
            'surgery_type': surgery_type,
            'surgery_type_display': dict(Hospital.SURGERY_TYPE_CHOICES)[surgery_type],
            'country': country,
            'country_display': dict(Hospital.COUNTRY_CHOICES)[country]
        },
        'total_count': hospitals.count()
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def surgery_types(request):
    """
    Get all available surgery types
    """
    return Response({
        'surgery_types': Hospital.SURGERY_TYPE_CHOICES
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def countries(request):
    """
    Get all available countries
    """
    return Response({
        'countries': Hospital.COUNTRY_CHOICES
    })

