from rest_framework import serializers
from .models import Hospital, HospitalSpecialist


class HospitalSpecialistSerializer(serializers.ModelSerializer):
    class Meta:
        model = HospitalSpecialist
        fields = ['id', 'name', 'specialization', 'experience_years', 'phone', 'email', 'is_available']


class HospitalSerializer(serializers.ModelSerializer):
    specialists = HospitalSpecialistSerializer(many=True, read_only=True)
    surgery_types_display = serializers.SerializerMethodField()
    country_display = serializers.CharField(source='get_country_display', read_only=True)
    
    class Meta:
        model = Hospital
        fields = [
            'id', 'name', 'country', 'country_display', 'city', 'address', 
            'phone', 'email', 'website', 'description', 'surgery_types', 
            'surgery_types_display', 'rating', 'is_active', 'specialists',
            'created_at', 'updated_at'
        ]
    
    def get_surgery_types_display(self, obj):
        return obj.get_surgery_types_display()


class HospitalSearchSerializer(serializers.Serializer):
    surgery_type = serializers.ChoiceField(choices=Hospital.SURGERY_TYPE_CHOICES)
    country = serializers.ChoiceField(choices=Hospital.COUNTRY_CHOICES)

