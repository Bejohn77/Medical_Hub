import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/auth/doctors/${id}/`);
      setDoctor(response.data);
    } catch (error) {
      setError('Failed to fetch doctor details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
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

  if (error || !doctor) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Doctor not found</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              to="/doctors"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              Back to Doctors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">👨‍⚕️</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Dr. {doctor.user.first_name} {doctor.user.last_name}
                  </h1>
                  <p className="text-xl text-primary-600 font-medium">
                    {getSpecialistDisplay(doctor.specialist)}
                  </p>
                  <p className="text-gray-600">
                    📍 {getLocationDisplay(doctor.location)}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  doctor.is_available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {doctor.is_available ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialist:</span>
                    <span className="font-medium">{getSpecialistDisplay(doctor.specialist)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{doctor.experience_years} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Fee:</span>
                    <span className="font-medium">৳{doctor.consultation_fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{getLocationDisplay(doctor.location)}</span>
                  </div>
                  {doctor.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{doctor.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                {doctor.bio ? (
                  <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">No bio available</p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/doctors"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md text-center font-medium transition-colors"
                >
                  Back to Doctors
                </Link>
                {doctor.is_available && (
                  <Link
                    to={`/book-appointment/${doctor.id}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md text-center font-medium transition-colors"
                  >
                    Book Appointment
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;




