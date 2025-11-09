import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const SURGERY_TYPES = [
  { value: 'open_heart', label: 'Open Heart Surgery' },
  { value: 'bypass', label: 'Bypass Surgery (CABG)' },
  { value: 'valve_replacement', label: 'Valve Replacement Surgery' },
  { value: 'pacemaker', label: 'Pacemaker Implantation' },
  { value: 'brain_tumor', label: 'Brain Tumor Surgery' },
  { value: 'spinal_cord', label: 'Spinal Cord Surgery' },
  { value: 'joint_replacement', label: 'Joint Replacement (Knee / Hip)' },
  { value: 'spine_fixation', label: 'Spine Fixation Surgery' },
  { value: 'lasik', label: 'LASIK / Vision Correction Surgery' },
  { value: 'retinal_detachment', label: 'Retinal Detachment Repair' },
  { value: 'prostate_cancer', label: 'Prostate Cancer Surgery' },
  { value: 'lung_cancer', label: 'Lung Cancer Surgery' },
];

const COUNTRIES = [
  { value: 'bangladesh', label: 'Bangladesh' },
  { value: 'abroad', label: 'Abroad' },
];

function FindHospital() {
  const [surgeryType, setSurgeryType] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const canSearch = useMemo(() => !!surgeryType && !!country, [surgeryType, country]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSearch) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const response = await axios.post('/api/hospitals/search/', { surgery_type: surgeryType, country });
      setResults(response.data.hospitals || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch hospitals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="rounded-2xl h-auto p-6 bg-white/70 backdrop-blur border border-gray-100 shadow-sm">
          <motion.h1 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 text-center">
            Find Hospital
          </motion.h1>
          <p className="text-center text-gray-600 mb-6">Select a surgery type and country to find hospitals.</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Surgery Type</label>
              <select
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={surgeryType}
                onChange={(e) => setSurgeryType(e.target.value)}
              >
                <option value="">Select surgery type</option>
                {SURGERY_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select country</option>
                {COUNTRIES.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={!canSearch || loading}
                className={`w-full inline-flex justify-center items-center rounded-lg px-4 py-2 font-medium text-white transition-colors ${canSearch && !loading ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                {loading ? 'Searching…' : 'Search'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-2">{error}</div>
          )}

          <div>
            {searched && !loading && results.length === 0 && (
              <div className="text-center text-gray-600">No hospitals found for the selected criteria.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((h) => (
                <motion.div key={h.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{h.name}</h3>
                    <span className="text-sm rounded-md px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200">⭐ {Number(h.rating || 0).toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{h.city}, {h.country_display}</p>
                  <p className="text-sm text-gray-600 mt-1">{h.address}</p>
                  {h.phone && <p className="text-sm text-gray-600 mt-1">📞 {h.phone}</p>}
                  {h.website && (
                    <a className="text-sm text-primary-700 hover:underline mt-1 inline-block" href={h.website} target="_blank" rel="noreferrer">Visit website</a>
                  )}
                  <div className="mt-3">
                    <div className="text-sm text-gray-700 font-medium mb-1">Surgeries:</div>
                    <div className="flex flex-wrap gap-2">
                      {(h.surgery_types_display || []).map((st) => (
                        <span key={st} className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200">{st}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindHospital;



