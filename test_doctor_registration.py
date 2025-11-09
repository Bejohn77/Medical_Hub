#!/usr/bin/env python3
"""
Test script to verify doctor registration and appointment booking
"""
import requests
import json
from datetime import datetime, timedelta

def test_doctor_registration():
    base_url = "http://localhost:8000"
    
    print("Testing Doctor Registration...")
    
    # Test data for doctor registration
    doctor_data = {
        "user": {
            "username": "testdoctor3",
            "email": "doctor3@test.com",
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
        response = requests.post(f"{base_url}/api/auth/register/doctor/", json=doctor_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            doctor_info = response.json()
            doctor_user_id = doctor_info['user']['id']
            doctor_model_id = doctor_info['doctor']['id']
            print(f"✅ Doctor registered successfully!")
            print(f"   Doctor User ID: {doctor_user_id}")
            print(f"   Doctor Model ID: {doctor_model_id}")
            return doctor_user_id, doctor_model_id
        else:
            print(f"❌ Doctor registration failed!")
            return None, None
            
    except Exception as e:
        print(f"❌ Error testing doctor registration: {e}")
        return None, None

def test_doctor_list():
    base_url = "http://localhost:8000"
    
    print("\nTesting Doctor List...")
    
    try:
        response = requests.get(f"{base_url}/api/auth/doctors/")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            doctors = response.json()
            print(f"✅ Found {len(doctors)} doctors")
            for doctor in doctors:
                print(f"   Doctor ID: {doctor['id']}, User ID: {doctor['user']['id']}, Name: {doctor['user']['first_name']} {doctor['user']['last_name']}")
            return doctors
        else:
            print(f"❌ Failed to fetch doctors: {response.text}")
            return []
            
    except Exception as e:
        print(f"❌ Error fetching doctors: {e}")
        return []

def test_appointment_booking(doctor_user_id):
    base_url = "http://localhost:8000"
    
    print(f"\nTesting Appointment Booking with Doctor User ID: {doctor_user_id}")
    
    # First create a patient
    patient_data = {
        "user": {
            "username": "testpatient3",
            "email": "patient3@test.com",
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
        
        # Book appointment
        tomorrow = datetime.now() + timedelta(days=1)
        appointment_date = tomorrow.strftime('%Y-%m-%d')
        
        appointment_data = {
            "patient_id": patient_id,
            "doctor_id": doctor_user_id,  # Use doctor's user ID
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
        
        print(f"Appointment Status Code: {appointment_response.status_code}")
        print(f"Appointment Response: {appointment_response.text}")
        
        if appointment_response.status_code == 201:
            appointment_info = appointment_response.json()
            print(f"✅ Appointment booked successfully with ID: {appointment_info['id']}")
        else:
            print(f"❌ Appointment booking failed!")
            
    except Exception as e:
        print(f"❌ Error during appointment booking: {e}")

if __name__ == "__main__":
    # Test doctor registration
    doctor_user_id, doctor_model_id = test_doctor_registration()
    
    # Test doctor list
    doctors = test_doctor_list()
    
    # Test appointment booking if doctor was created
    if doctor_user_id:
        test_appointment_booking(doctor_user_id)
    
    print("\n" + "="*50)
    print("Test Summary:")
    print(f"Doctor User ID: {doctor_user_id}")
    print(f"Doctor Model ID: {doctor_model_id}")
    print(f"Total Doctors: {len(doctors)}")
    print("="*50)




