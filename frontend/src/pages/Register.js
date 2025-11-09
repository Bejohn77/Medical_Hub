import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    user_type: 'patient',
    // Doctor/Nurse specific fields
    specialist: '',
    location: '',
    phone: '',
    experience_years: '',
    consultation_fee: '',
    bio: '',
    // Patient specific fields
    date_of_birth: '',
    address: '',
    emergency_contact: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const userData = {
      user: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        first_name: formData.first_name,
        last_name: formData.last_name,
        user_type: formData.user_type,
      }
    };

    if (formData.user_type === 'doctor') {
      userData.specialist = formData.specialist;
      userData.location = formData.location;
      userData.phone = formData.phone;
      userData.experience_years = parseInt(formData.experience_years) || 0;
      userData.consultation_fee = parseFloat(formData.consultation_fee) || 0;
      userData.bio = formData.bio;
    } else if (formData.user_type === 'nurse') {
      userData.location = formData.location;
      userData.phone = formData.phone;
      userData.experience_years = parseInt(formData.experience_years) || 0;
      userData.consultation_fee = parseFloat(formData.consultation_fee) || 0;
      userData.bio = formData.bio;
    } else {
      userData.phone = formData.phone;
      userData.date_of_birth = formData.date_of_birth;
      userData.address = formData.address;
      userData.emergency_contact = formData.emergency_contact;
    }

    const result = await register(userData, formData.user_type);
    
    if (result.success) {
      navigate('/');
    } else {
      console.error('Registration failed:', result.error);
      // Handle different error formats
      let errorMessage = 'Registration failed';
      
      if (result.error.detail) {
        errorMessage = result.error.detail;
      } else if (result.error.user) {
        // Handle nested user errors
        const userErrors = result.error.user;
        errorMessage = Object.values(userErrors).flat().join(', ');
      } else if (result.error.specialist) {
        errorMessage = `Specialist: ${result.error.specialist.join(', ')}`;
      } else if (result.error.location) {
        errorMessage = `Location: ${result.error.location.join(', ')}`;
      } else if (typeof result.error === 'string') {
        errorMessage = result.error;
      } else if (result.error.non_field_errors) {
        errorMessage = result.error.non_field_errors.join(', ');
      } else if (typeof result.error === 'object') {
        // Handle field-specific errors
        const errorMessages = [];
        Object.keys(result.error).forEach(key => {
          if (Array.isArray(result.error[key])) {
            errorMessages.push(`${key}: ${result.error[key].join(', ')}`);
          } else {
            errorMessages.push(`${key}: ${result.error[key]}`);
          }
        });
        errorMessage = errorMessages.join('; ');
      }
      
      setError(errorMessage);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="user_type" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="user_type"
                name="user_type"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.user_type}
                onChange={handleChange}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {(formData.user_type === 'doctor' || formData.user_type === 'nurse') && (
              <>
                {formData.user_type === 'doctor' && (
                  <div>
                  <label htmlFor="specialist" className="block text-sm font-medium text-gray-700">
                    Specialist
                  </label>
                  <select
                    id="specialist"
                    name="specialist"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.specialist}
                    onChange={handleChange}
                  >
                    <option value="">Select Specialist</option>
                    <option value="eye">Eye Specialist</option>
                    <option value="cardiologist">Cardiologist</option>
                    <option value="gynecologist">Gynecologist</option>
                    <option value="neurologist">Neurologist</option>
                    <option value="orthopedic">Orthopedic</option>
                    <option value="dermatologist">Dermatologist</option>
                    <option value="pediatrician">Pediatrician</option>
                    <option value="psychiatrist">Psychiatrist</option>
                    <option value="general">General Physician</option>
                  </select>
                  </div>
                )}

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <select
                    id="location"
                    name="location"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.location}
                    onChange={handleChange}
                  >
                    <option value="">Select Location</option>
                    <option value="dhaka">Dhaka</option>
                    <option value="chittagong">Chittagong</option>
                    <option value="rajshahi">Rajshahi</option>
                    <option value="khulna">Khulna</option>
                    <option value="barisal">Barisal</option>
                    <option value="sylhet">Sylhet</option>
                    <option value="rangpur">Rangpur</option>
                    <option value="mymensingh">Mymensingh</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700">
                      Experience (Years)
                    </label>
                    <input
                      id="experience_years"
                      name="experience_years"
                      type="number"
                      min="0"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      value={formData.experience_years}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="consultation_fee" className="block text-sm font-medium text-gray-700">
                      Consultation Fee
                    </label>
                    <input
                      id="consultation_fee"
                      name="consultation_fee"
                      type="number"
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      value={formData.consultation_fee}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {formData.user_type === 'patient' && (
              <>
                <div>
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700">
                    Emergency Contact
                  </label>
                  <input
                    id="emergency_contact"
                    name="emergency_contact"
                    type="tel"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.emergency_contact}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="password_confirm"
                  name="password_confirm"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.password_confirm}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
