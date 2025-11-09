#!/usr/bin/env python3
"""
Test script to verify registration endpoints are working
"""
import requests
import json

# Test data for patient registration
patient_data = {
    "user": {
        "username": "testpatient",
        "email": "patient@test.com",
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

# Test data for doctor registration
doctor_data = {
    "user": {
        "username": "testdoctor",
        "email": "doctor@test.com",
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

def test_registration():
    base_url = "http://localhost:8000"
    
    print("Testing Patient Registration...")
    try:
        response = requests.post(f"{base_url}/api/auth/register/patient/", json=patient_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        if response.status_code == 201:
            print("✅ Patient registration successful!")
        else:
            print("❌ Patient registration failed!")
    except Exception as e:
        print(f"❌ Error testing patient registration: {e}")
    
    print("\n" + "="*50 + "\n")
    
    print("Testing Doctor Registration...")
    try:
        response = requests.post(f"{base_url}/api/auth/register/doctor/", json=doctor_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        if response.status_code == 201:
            print("✅ Doctor registration successful!")
        else:
            print("❌ Doctor registration failed!")
    except Exception as e:
        print(f"❌ Error testing doctor registration: {e}")

if __name__ == "__main__":
    test_registration()




