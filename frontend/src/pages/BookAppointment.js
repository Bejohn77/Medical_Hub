import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    appointment_date: '',
    appointment_time: '',
    reason: '',
  });

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const response = await axios.get(`/api/auth/doctors/${doctorId}/`);
      setDoctor(response.data);
    } catch (error) {
      setError('Failed to fetch doctor details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Check if user is authenticated and is a patient
      if (!user || user.user.user_type !== 'patient') {
        setError('Only patients can book appointments');
        return;
      }

      const appointmentData = {
        patient_id: user.user.id,
        doctor_id: doctor.user.id, // Use the doctor's user ID, not the doctor model ID
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        reason: formData.reason,
      };

      console.log('Booking appointment with data:', appointmentData);
      const response = await axios.post('/api/appointments/', appointmentData);
      console.log('Appointment booked successfully:', response.data);
      setSuccess('Appointment booked successfully! Redirecting...');
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (error) {
      console.error('Appointment booking error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to book appointment';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.non_field_errors) {
        errorMessage = error.response.data.non_field_errors.join(', ');
      } else if (error.response?.data) {
        // Handle field-specific errors
        const errors = error.response.data;
        const errorMessages = [];
        Object.keys(errors).forEach(key => {
          if (Array.isArray(errors[key])) {
            errorMessages.push(...errors[key]);
          } else {
            errorMessages.push(errors[key]);
          }
        });
        errorMessage = errorMessages.join(', ');
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getSpecialistDisplay = (specialist) => {
    const specialistMap = {
      'eye': 'Eye Specialist',
      'cardiologist': 'Cardiologist',
      'gynecologist': 'Gynecologist',
      'neurologist': 'Neurologist',
      'orthopedic': 'Orthopedic',
      'dermatologist': 'Dermatologist',
      'pediatrician': 'Pediatrician',
      'psychiatrist': 'Psychiatrist',
      'general': 'General Physician',
    };
    return specialistMap[specialist] || specialist;
  };

  const getLocationDisplay = (location) => {
    const locationMap = {
      'dhaka': 'Dhaka',
      'chittagong': 'Chittagong',
      'rajshahi': 'Rajshahi',
      'khulna': 'Khulna',
      'barisal': 'Barisal',
      'sylhet': 'Sylhet',
      'rangpur': 'Rangpur',
      'mymensingh': 'Mymensingh',
    };
    return locationMap[location] || location;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please log in to book an appointment.</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is a patient
  if (user.user.user_type !== 'patient') {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">Only patients can book appointments.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Doctor not found</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
            <div className="mt-2">
              <h2 className="text-lg text-gray-700">
                Dr. {doctor.user.first_name} {doctor.user.last_name}
              </h2>
              <p className="text-primary-600 font-medium">
                {getSpecialistDisplay(doctor.specialist)} • {getLocationDisplay(doctor.location)}
              </p>
              <p className="text-sm text-gray-600">
                Consultation Fee: ৳{doctor.consultation_fee}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                {success}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  id="appointment_date"
                  name="appointment_date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.appointment_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="appointment_time" className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Time
                </label>
                <select
                  id="appointment_time"
                  name="appointment_time"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.appointment_time}
                  onChange={handleChange}
                >
                  <option value="">Select Time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="09:30">9:30 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="14:30">2:30 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="15:30">3:30 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="16:30">4:30 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="17:30">5:30 PM</option>
                </select>
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Please describe the reason for your appointment..."
                  value={formData.reason}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || success}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {submitting ? 'Booking...' : success ? 'Booked!' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
