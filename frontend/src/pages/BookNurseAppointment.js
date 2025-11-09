import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BookNurseAppointment = () => {
  const { nurseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nurse, setNurse] = useState(null);
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
    fetchNurse();
  }, [nurseId]);

  const fetchNurse = async () => {
    try {
      const response = await axios.get(`/api/auth/nurses/${nurseId}/`);
      setNurse(response.data);
    } catch (error) {
      setError('Failed to fetch nurse details');
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
      if (!user || user.user.user_type !== 'patient') {
        setError('Only patients can book nurse appointments');
        return;
      }
      const appointmentData = {
        patient_id: user.user.id,
        nurse_id: nurse.user.id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        reason: formData.reason,
      };
      const response = await axios.post('/api/appointments/nurses/', appointmentData);
      setSuccess('Nurse appointment booked successfully! Redirecting...');
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (error) {
      let errorMessage = 'Failed to book nurse appointment';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data) {
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

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please log in to book a nurse appointment.</p>
          </div>
        </div>
      </div>
    );
  }

  if (user.user.user_type !== 'patient') {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">Only patients can book nurse appointments.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!nurse) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nurse not found</h3>
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
            <h1 className="text-2xl font-bold text-gray-900">Book Nurse Appointment</h1>
            <div className="mt-2">
              <h2 className="text-lg text-gray-700">
                Nurse {nurse.user.first_name} {nurse.user.last_name}
              </h2>
              <p className="text-primary-600 font-medium">
                {getLocationDisplay(nurse.location)}
              </p>
              <p className="text-sm text-gray-600">
                Fee: ৳{nurse.consultation_fee}
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
                <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
                <input type="date" id="appointment_date" name="appointment_date" required min={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" value={formData.appointment_date} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="appointment_time" className="block text-sm font-medium text-gray-700 mb-2">Appointment Time</label>
                <select id="appointment_time" name="appointment_time" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" value={formData.appointment_time} onChange={handleChange}>
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
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                <textarea id="reason" name="reason" rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="Describe your reason for the appointment..." value={formData.reason} onChange={handleChange} />
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-4">
              <button type="button" onClick={() => navigate(-1)} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors">Cancel</button>
              <button type="submit" disabled={submitting || success} className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50">{submitting ? 'Booking...' : success ? 'Booked!' : 'Book Appointment'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookNurseAppointment;




