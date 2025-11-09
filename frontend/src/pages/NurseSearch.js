import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NurseSearch = () => {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
  });

  useEffect(() => {
    fetchNurses();
  }, [filters]);

  const fetchNurses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      const response = await axios.get(`/api/auth/nurses/?${params}`);
      setNurses(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch nurses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
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

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find a Nurse</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.location}
                  onChange={handleFilterChange}
                >
                  <option value="">All Locations</option>
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
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nurses.length > 0 ? (
              nurses.map((nurse) => (
                <div key={nurse.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">👩‍⚕️</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Nurse {nurse.user.first_name} {nurse.user.last_name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      📍 {getLocationDisplay(nurse.location)}
                    </p>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{nurse.experience_years} years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fee:</span>
                      <span className="font-medium">৳{nurse.consultation_fee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${nurse.is_available ? 'text-green-600' : 'text-red-600'}`}>
                        {nurse.is_available ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                  {nurse.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {nurse.bio}
                    </p>
                  )}
                  <div className="flex space-x-2">
                    <Link
                      to={`/book-nurse/${nurse.id}`}
                      className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No nurses found</h3>
                <p className="text-gray-600">Try adjusting your search filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NurseSearch;




