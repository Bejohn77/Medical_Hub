#!/usr/bin/env python3
"""
Comprehensive test script for Health Community Hub
Tests: Registration, Login, Doctor Search, Appointment Booking, Doctor Actions
"""
import requests
import json
import time
from datetime import datetime, timedelta

def wait_for_server(base_url, max_attempts=10):
    """Wait for server to be ready"""
    print("Waiting for server to be ready...")
    for i in range(max_attempts):
        try:
            response = requests.get(f"{base_url}/api/auth/doctors/", timeout=5)
            if response.status_code in [200, 401]:  # 401 is OK for unauthenticated request
                print("✅ Server is ready!")
                return True
        except:
            pass
        print(f"Attempt {i+1}/{max_attempts} - Server not ready yet...")
        time.sleep(2)
    return False

def test_patient_registration(base_url):
    """Test patient registration"""
    print("\n" + "="*50)
    print("TESTING PATIENT REGISTRATION")
    print("="*50)
    
    patient_data = {
        "user": {
            "username": "testpatient_final",
            "email": "patient_final@test.com",
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
        response = requests.post(f"{base_url}/api/auth/register/patient/", json=patient_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            patient_info = response.json()
            print("✅ Patient registration successful!")
            print(f"   Patient ID: {patient_info['user']['id']}")
            print(f"   Username: {patient_info['user']['username']}")
            return patient_info
        else:
            print(f"❌ Patient registration failed!")
            print(f"   Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_doctor_registration(base_url):
    """Test doctor registration"""
    print("\n" + "="*50)
    print("TESTING DOCTOR REGISTRATION")
    print("="*50)
    
    doctor_data = {
        "user": {
            "username": "testdoctor_final",
            "email": "doctor_final@test.com",
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
        
        if response.status_code == 201:
            doctor_info = response.json()
            print("✅ Doctor registration successful!")
            print(f"   Doctor User ID: {doctor_info['user']['id']}")
            print(f"   Doctor Model ID: {doctor_info['doctor']['id']}")
            print(f"   Username: {doctor_info['user']['username']}")
            return doctor_info
        else:
            print(f"❌ Doctor registration failed!")
            print(f"   Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_login(base_url, username, password):
    """Test user login"""
    print("\n" + "="*50)
    print(f"TESTING LOGIN FOR {username}")
    print("="*50)
    
    login_data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(f"{base_url}/api/auth/login/", json=login_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            user_info = response.json()
            print("✅ Login successful!")
            print(f"   User Type: {user_info['user']['user_type']}")
            print(f"   Name: {user_info['user']['first_name']} {user_info['user']['last_name']}")
            return user_info
        else:
            print(f"❌ Login failed!")
            print(f"   Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_doctor_search(base_url):
    """Test doctor search functionality"""
    print("\n" + "="*50)
    print("TESTING DOCTOR SEARCH")
    print("="*50)
    
    try:
        response = requests.get(f"{base_url}/api/auth/doctors/")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            doctors = response.json()
            print(f"✅ Found {len(doctors)} doctors")
            for doctor in doctors:
                print(f"   Doctor ID: {doctor['id']}, User ID: {doctor['user']['id']}")
                print(f"   Name: Dr. {doctor['user']['first_name']} {doctor['user']['last_name']}")
                print(f"   Specialist: {doctor['specialist']}, Location: {doctor['location']}")
                print(f"   Available: {doctor['is_available']}")
                print()
            return doctors
        else:
            print(f"❌ Failed to fetch doctors!")
            print(f"   Error: {response.text}")
            return []
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

def test_appointment_booking(base_url, patient_token, doctor_user_id):
    """Test appointment booking"""
    print("\n" + "="*50)
    print("TESTING APPOINTMENT BOOKING")
    print("="*50)
    
    # Get tomorrow's date
    tomorrow = datetime.now() + timedelta(days=1)
    appointment_date = tomorrow.strftime('%Y-%m-%d')
    
    appointment_data = {
        "patient_id": 1,  # This will be overridden by the backend
        "doctor_id": doctor_user_id,
        "appointment_date": appointment_date,
        "appointment_time": "10:00",
        "reason": "Test appointment booking"
    }
    
    headers = {
        'Authorization': f'Bearer {patient_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(f"{base_url}/api/appointments/", json=appointment_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            appointment_info = response.json()
            print("✅ Appointment booked successfully!")
            print(f"   Appointment ID: {appointment_info['id']}")
            print(f"   Date: {appointment_info['appointment_date']}")
            print(f"   Time: {appointment_info['appointment_time']}")
            print(f"   Status: {appointment_info['status']}")
            return appointment_info
        else:
            print(f"❌ Appointment booking failed!")
            print(f"   Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_doctor_approve_appointment(base_url, doctor_token, appointment_id):
    """Test doctor approving appointment"""
    print("\n" + "="*50)
    print("TESTING DOCTOR APPROVING APPOINTMENT")
    print("="*50)
    
    headers = {
        'Authorization': f'Bearer {doctor_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.patch(
            f"{base_url}/api/appointments/{appointment_id}/update-status/",
            json={"status": "approved"},
            headers=headers
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            appointment_info = response.json()
            print("✅ Appointment approved successfully!")
            print(f"   Status: {appointment_info['status']}")
            return True
        else:
            print(f"❌ Appointment approval failed!")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_view_appointments(base_url, token, user_type):
    """Test viewing appointments"""
    print("\n" + "="*50)
    print(f"TESTING VIEW APPOINTMENTS ({user_type.upper()})")
    print("="*50)
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f"{base_url}/api/appointments/my-appointments/", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            appointments = response.json()
            print(f"✅ Found {len(appointments)} appointments")
            for apt in appointments:
                print(f"   Appointment ID: {apt['id']}")
                print(f"   Date: {apt['appointment_date']} at {apt['appointment_time']}")
                print(f"   Status: {apt['status']}")
                if user_type == 'patient':
                    print(f"   Doctor: Dr. {apt['doctor']['first_name']} {apt['doctor']['last_name']}")
                else:
                    print(f"   Patient: {apt['patient']['first_name']} {apt['patient']['last_name']}")
                print()
            return appointments
        else:
            print(f"❌ Failed to fetch appointments!")
            print(f"   Error: {response.text}")
            return []
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

def main():
    """Run comprehensive tests"""
    base_url = "http://localhost:8000"
    
    print("HEALTH COMMUNITY HUB - COMPREHENSIVE TEST")
    print("="*60)
    
    # Wait for server
    if not wait_for_server(base_url):
        print("❌ Server is not ready. Please start the Django server.")
        return
    
    # Test 1: Patient Registration
    patient_info = test_patient_registration(base_url)
    if not patient_info:
        print("❌ Cannot continue without patient registration")
        return
    
    # Test 2: Doctor Registration
    doctor_info = test_doctor_registration(base_url)
    if not doctor_info:
        print("❌ Cannot continue without doctor registration")
        return
    
    # Test 3: Patient Login
    patient_login = test_login(base_url, "testpatient_final", "testpass123")
    if not patient_login:
        print("❌ Cannot continue without patient login")
        return
    
    # Test 4: Doctor Login
    doctor_login = test_login(base_url, "testdoctor_final", "testpass123")
    if not doctor_login:
        print("❌ Cannot continue without doctor login")
        return
    
    # Test 5: Doctor Search
    doctors = test_doctor_search(base_url)
    if not doctors:
        print("❌ Cannot continue without doctor search")
        return
    
    # Test 6: Appointment Booking
    patient_token = patient_login['tokens']['access']
    doctor_user_id = doctor_info['user']['id']
    
    appointment = test_appointment_booking(base_url, patient_token, doctor_user_id)
    if not appointment:
        print("❌ Cannot continue without appointment booking")
        return
    
    # Test 7: Doctor Approve Appointment
    doctor_token = doctor_login['tokens']['access']
    appointment_id = appointment['id']
    
    approval_success = test_doctor_approve_appointment(base_url, doctor_token, appointment_id)
    
    # Test 8: View Appointments (Patient)
    test_view_appointments(base_url, patient_token, "patient")
    
    # Test 9: View Appointments (Doctor)
    test_view_appointments(base_url, doctor_token, "doctor")
    
    # Final Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f"✅ Patient Registration: {'PASS' if patient_info else 'FAIL'}")
    print(f"✅ Doctor Registration: {'PASS' if doctor_info else 'FAIL'}")
    print(f"✅ Patient Login: {'PASS' if patient_login else 'FAIL'}")
    print(f"✅ Doctor Login: {'PASS' if doctor_login else 'FAIL'}")
    print(f"✅ Doctor Search: {'PASS' if doctors else 'FAIL'}")
    print(f"✅ Appointment Booking: {'PASS' if appointment else 'FAIL'}")
    print(f"✅ Doctor Approval: {'PASS' if approval_success else 'FAIL'}")
    print("="*60)
    
    if all([patient_info, doctor_info, patient_login, doctor_login, doctors, appointment, approval_success]):
        print("🎉 ALL TESTS PASSED! The system is working correctly.")
    else:
        print("❌ Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    main()




