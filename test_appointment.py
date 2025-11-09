#!/usr/bin/env python3
"""
Test script to verify appointment booking functionality
"""
import requests
import json
from datetime import datetime, timedelta

# Test data for appointment booking
def test_appointment_booking():
    base_url = "http://localhost:8000"
    
    # First, create a patient and doctor for testing
    print("Creating test users...")
    
    # Create patient
    patient_data = {
        "user": {
            "username": "testpatient2",
            "email": "patient2@test.com",
            "password": "testpass123",
            "password_confirm": "testpass123",
            "first_name": "Test",
            "last_name": "Patient",
            "user_type": "patient"
        },
        "phone": "1234567890",
        "date_of_birth": "1990-01-01",
        "address": "Test Address",
        "emergency_contact": "9876543210"
    }
    
    # Create doctor
    doctor_data = {
        "user": {
            "username": "testdoctor2",
            "email": "doctor2@test.com",
            "password": "testpass123",
            "password_confirm": "testpass123",
            "first_name": "Test",
            "last_name": "Doctor",
            "user_type": "doctor"
        },
        "specialist": "general",
        "location": "dhaka",
        "phone": "1234567890",
        "experience_years": 5,
        "consultation_fee": 500.00,
        "bio": "Test doctor bio"
    }
    
    try:
        # Register patient
        patient_response = requests.post(f"{base_url}/api/auth/register/patient/", json=patient_data)
        if patient_response.status_code == 201:
            patient_info = patient_response.json()
            patient_id = patient_info['user']['id']
            patient_token = patient_info['tokens']['access']
            print(f"✅ Patient created with ID: {patient_id}")
        else:
            print(f"❌ Patient creation failed: {patient_response.text}")
            return
        
        # Register doctor
        doctor_response = requests.post(f"{base_url}/api/auth/register/doctor/", json=doctor_data)
        if doctor_response.status_code == 201:
            doctor_info = doctor_response.json()
            doctor_id = doctor_info['user']['id']
            doctor_token = doctor_info['tokens']['access']
            print(f"✅ Doctor created with ID: {doctor_id}")
        else:
            print(f"❌ Doctor creation failed: {doctor_response.text}")
            return
        
        # Test appointment booking
        print("\nTesting appointment booking...")
        
        # Get tomorrow's date
        tomorrow = datetime.now() + timedelta(days=1)
        appointment_date = tomorrow.strftime('%Y-%m-%d')
        
        appointment_data = {
            "patient_id": patient_id,
            "doctor_id": doctor_id,
            "appointment_date": appointment_date,
            "appointment_time": "10:00",
            "reason": "Test appointment booking"
        }
        
        headers = {
            'Authorization': f'Bearer {patient_token}',
            'Content-Type': 'application/json'
        }
        
        appointment_response = requests.post(
            f"{base_url}/api/appointments/", 
            json=appointment_data,
            headers=headers
        )
        
        if appointment_response.status_code == 201:
            appointment_info = appointment_response.json()
            appointment_id = appointment_info['id']
            print(f"✅ Appointment booked successfully with ID: {appointment_id}")
            
            # Test doctor approving the appointment
            print("\nTesting doctor approval...")
            
            doctor_headers = {
                'Authorization': f'Bearer {doctor_token}',
                'Content-Type': 'application/json'
            }
            
            approval_response = requests.patch(
                f"{base_url}/api/appointments/{appointment_id}/update-status/",
                json={"status": "approved"},
                headers=doctor_headers
            )
            
            if approval_response.status_code == 200:
                print("✅ Appointment approved successfully!")
            else:
                print(f"❌ Appointment approval failed: {approval_response.text}")
            
            # Test fetching appointments
            print("\nTesting appointment retrieval...")
            
            # Get patient appointments
            patient_appointments = requests.get(
                f"{base_url}/api/appointments/my-appointments/",
                headers=headers
            )
            
            if patient_appointments.status_code == 200:
                appointments = patient_appointments.json()
                print(f"✅ Patient has {len(appointments)} appointments")
                for apt in appointments:
                    print(f"  - Appointment {apt['id']}: {apt['status']} on {apt['appointment_date']} at {apt['appointment_time']}")
            else:
                print(f"❌ Failed to fetch patient appointments: {patient_appointments.text}")
            
            # Get doctor appointments
            doctor_appointments = requests.get(
                f"{base_url}/api/appointments/my-appointments/",
                headers=doctor_headers
            )
            
            if doctor_appointments.status_code == 200:
                appointments = doctor_appointments.json()
                print(f"✅ Doctor has {len(appointments)} appointments")
                for apt in appointments:
                    print(f"  - Appointment {apt['id']}: {apt['status']} with {apt['patient']['first_name']} {apt['patient']['last_name']}")
            else:
                print(f"❌ Failed to fetch doctor appointments: {doctor_appointments.text}")
                
        else:
            print(f"❌ Appointment booking failed: {appointment_response.text}")
            
    except Exception as e:
        print(f"❌ Error during testing: {e}")

if __name__ == "__main__":
    test_appointment_booking()




