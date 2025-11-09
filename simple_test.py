#!/usr/bin/env python3
"""
Simple test script for Health Community Hub
"""
import requests
import json
import time
from datetime import datetime, timedelta

def test_patient_registration():
    """Test patient registration"""
    print("\n=== TESTING PATIENT REGISTRATION ===")
    
    import random
    random_id = random.randint(1000, 9999)
    
    patient_data = {
        "user": {
            "username": f"testpatient_{random_id}",
            "email": f"patient_{random_id}@test.com",
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
        response = requests.post("http://localhost:8000/api/auth/register/patient/", json=patient_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            patient_info = response.json()
            print("SUCCESS: Patient registration successful!")
            print(f"Patient ID: {patient_info['user']['id']}")
            print(f"Username: {patient_info['user']['username']}")
            return patient_info
        else:
            print("FAILED: Patient registration failed!")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"ERROR: {e}")
        return None

def test_doctor_registration():
    """Test doctor registration"""
    print("\n=== TESTING DOCTOR REGISTRATION ===")
    
    import random
    random_id = random.randint(1000, 9999)
    
    doctor_data = {
        "user": {
            "username": f"testdoctor_{random_id}",
            "email": f"doctor_{random_id}@test.com",
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
        response = requests.post("http://localhost:8000/api/auth/register/doctor/", json=doctor_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            doctor_info = response.json()
            print("SUCCESS: Doctor registration successful!")
            print(f"Doctor User ID: {doctor_info['user']['id']}")
            print(f"Doctor Model ID: {doctor_info['doctor']['id']}")
            return doctor_info
        else:
            print("FAILED: Doctor registration failed!")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"ERROR: {e}")
        return None

def test_login(username, password):
    """Test user login"""
    print(f"\n=== TESTING LOGIN FOR {username} ===")
    
    login_data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post("http://localhost:8000/api/auth/login/", json=login_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            user_info = response.json()
            print("SUCCESS: Login successful!")
            print(f"User Type: {user_info['user']['user_type']}")
            return user_info
        else:
            print("FAILED: Login failed!")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"ERROR: {e}")
        return None

def test_doctor_search():
    """Test doctor search"""
    print("\n=== TESTING DOCTOR SEARCH ===")
    
    try:
        response = requests.get("http://localhost:8000/api/auth/doctors/")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            # Handle paginated response
            if 'results' in data:
                doctors = data['results']
                print(f"SUCCESS: Found {len(doctors)} doctors (total: {data.get('count', len(doctors))})")
            else:
                doctors = data
                print(f"SUCCESS: Found {len(doctors)} doctors")
            
            for doctor in doctors:
                print(f"Doctor ID: {doctor['id']}, User ID: {doctor['user']['id']}")
                print(f"Name: Dr. {doctor['user']['first_name']} {doctor['user']['last_name']}")
            return doctors
        else:
            print("FAILED: Failed to fetch doctors!")
            return []
            
    except Exception as e:
        print(f"ERROR: {e}")
        return []

def test_appointment_booking(patient_token, doctor_user_id):
    """Test appointment booking"""
    print("\n=== TESTING APPOINTMENT BOOKING ===")
    
    tomorrow = datetime.now() + timedelta(days=1)
    appointment_date = tomorrow.strftime('%Y-%m-%d')
    
    appointment_data = {
        "patient_id": 1,
        "doctor_id": doctor_user_id,
        "appointment_date": appointment_date,
        "appointment_time": "10:00",
        "reason": "Test appointment"
    }
    
    headers = {
        'Authorization': f'Bearer {patient_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post("http://localhost:8000/api/appointments/", json=appointment_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            appointment_info = response.json()
            print("SUCCESS: Appointment booked!")
            print(f"Appointment ID: {appointment_info['id']}")
            print(f"Status: {appointment_info['status']}")
            return appointment_info
        else:
            print("FAILED: Appointment booking failed!")
            print(f"Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"ERROR: {e}")
        return None

def test_doctor_approve(doctor_token, appointment_id):
    """Test doctor approving appointment"""
    print("\n=== TESTING DOCTOR APPROVAL ===")
    
    headers = {
        'Authorization': f'Bearer {doctor_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.patch(
            f"http://localhost:8000/api/appointments/{appointment_id}/update-status/",
            json={"status": "approved"},
            headers=headers
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("SUCCESS: Appointment approved!")
            return True
        else:
            print("FAILED: Approval failed!")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def main():
    """Run all tests"""
    print("HEALTH COMMUNITY HUB - SIMPLE TEST")
    print("=" * 50)
    
    # Test 1: Patient Registration
    patient_info = test_patient_registration()
    if not patient_info:
        print("Cannot continue without patient registration")
        return
    
    # Test 2: Doctor Registration
    doctor_info = test_doctor_registration()
    if not doctor_info:
        print("Cannot continue without doctor registration")
        return
    
    # Test 3: Patient Login
    patient_username = patient_info['user']['username']
    patient_login = test_login(patient_username, "testpass123")
    if not patient_login:
        print("Cannot continue without patient login")
        return
    
    # Test 4: Doctor Login
    doctor_username = doctor_info['user']['username']
    doctor_login = test_login(doctor_username, "testpass123")
    if not doctor_login:
        print("Cannot continue without doctor login")
        return
    
    # Test 5: Doctor Search
    doctors = test_doctor_search()
    if not doctors:
        print("Cannot continue without doctor search")
        return
    
    # Test 6: Appointment Booking
    patient_token = patient_login['tokens']['access']
    doctor_user_id = doctor_info['user']['id']
    
    appointment = test_appointment_booking(patient_token, doctor_user_id)
    if not appointment:
        print("Cannot continue without appointment booking")
        return
    
    # Test 7: Doctor Approval
    doctor_token = doctor_login['tokens']['access']
    appointment_id = appointment['id']
    
    approval_success = test_doctor_approve(doctor_token, appointment_id)
    
    # Summary
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print(f"Patient Registration: {'PASS' if patient_info else 'FAIL'}")
    print(f"Doctor Registration: {'PASS' if doctor_info else 'FAIL'}")
    print(f"Patient Login: {'PASS' if patient_login else 'FAIL'}")
    print(f"Doctor Login: {'PASS' if doctor_login else 'FAIL'}")
    print(f"Doctor Search: {'PASS' if doctors else 'FAIL'}")
    print(f"Appointment Booking: {'PASS' if appointment else 'FAIL'}")
    print(f"Doctor Approval: {'PASS' if approval_success else 'FAIL'}")
    print("=" * 50)
    
    if all([patient_info, doctor_info, patient_login, doctor_login, doctors, appointment, approval_success]):
        print("ALL TESTS PASSED! System is working correctly.")
    else:
        print("Some tests failed. Check errors above.")

if __name__ == "__main__":
    main()


