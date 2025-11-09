import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [nurseAppointments, setNurseAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchNurseAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/appointments/my-appointments/');
      setAppointments(response.data);
    } catch (error) {
      setError('Failed to fetch appointments');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await axios.patch(`/api/appointments/${appointmentId}/update-status/`, {
        status: newStatus
      });
      setSuccess(`Appointment ${newStatus} successfully!`);
      fetchAppointments(); // Refresh the list
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      setError(`Failed to ${newStatus} appointment`);
      setTimeout(() => setError(''), 3000);
    }
  };

  const fetchNurseAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments/nurses/my-appointments/');
      setNurseAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch nurse appointments:', error);
    }
  };

  const updateNurseAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await axios.patch(`/api/appointments/nurses/${appointmentId}/update-status/`, { status: newStatus });
      setSuccess(`Nurse appointment ${newStatus} successfully!`);
      fetchNurseAppointments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to update nurse appointment status:', error);
      setError(`Failed to ${newStatus} nurse appointment`);
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Appointments</h1>
          {user?.user?.user_type === 'patient' && (
            <Link
              to="/doctors"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              Find Doctors
            </Link>
          )}
        </div>

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

        {appointments.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          {user?.user?.user_type === 'patient' ? (
                            <h3 className="text-lg font-medium text-gray-900">
                              Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
                            </h3>
                          ) : (
                            <h3 className="text-lg font-medium text-gray-900">
                              Patient: {appointment.patient.first_name} {appointment.patient.last_name}
                            </h3>
                          )}
                          <p className="text-sm text-gray-600">
                            {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}
                          </p>
                          {appointment.reason && (
                            <p className="text-sm text-gray-500 mt-1">
                              Reason: {appointment.reason}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {user?.user?.user_type === 'doctor' && appointment.status === 'pending' && (
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  
                  {appointment.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Notes:</strong> {appointment.notes}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">
              {user?.user?.user_type === 'patient' 
                ? 'You haven\'t booked any appointments yet.' 
                : 'You don\'t have any appointments scheduled.'}
            </p>
            {user?.user?.user_type === 'patient' && (
              <Link
                to="/doctors"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
              >
                Find Doctors
              </Link>
            )}
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nurse Appointments</h2>
          {nurseAppointments.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {nurseAppointments.map((appointment) => (
                  <li key={appointment.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            {user?.user?.user_type === 'patient' ? (
                              <h3 className="text-lg font-medium text-gray-900">
                                Nurse {appointment.nurse.first_name} {appointment.nurse.last_name}
                              </h3>
                            ) : (
                              <h3 className="text-lg font-medium text-gray-900">
                                Patient: {appointment.patient.first_name} {appointment.patient.last_name}
                              </h3>
                            )}
                            <p className="text-sm text-gray-600">
                              {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}
                            </p>
                            {appointment.reason && (
                              <p className="text-sm text-gray-500 mt-1">
                                Reason: {appointment.reason}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {user?.user?.user_type === 'nurse' && appointment.status === 'pending' && (
                      <div className="mt-4 flex space-x-2">
                        <button onClick={() => updateNurseAppointmentStatus(appointment.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">Approve</button>
                        <button onClick={() => updateNurseAppointmentStatus(appointment.id, 'cancelled')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">Cancel</button>
                      </div>
                    )}
                    {appointment.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🧑‍⚕️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No nurse appointments found</h3>
              <p className="text-gray-600">You don't have any nurse appointments scheduled.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
