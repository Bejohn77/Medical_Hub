import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();

  const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: 0.05 * i } }),
  };

  const renderPatientDashboard = () => (
    <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="rounded-2xl h-auto p-8 bg-white/70 backdrop-blur border border-gray-100 shadow-sm">
          <div className="text-center">
            <motion.h1 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-gray-900 mb-2">
              Welcome, {user?.user?.first_name || user?.user?.username}!
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg text-gray-600 mb-8">
              Your Health Community Hub Dashboard
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/doctors">
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                  custom={0}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  whileHover={{ y: -2 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">👨‍⚕️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Doctors</h3>
                    <p className="text-gray-600">Search and book appointments with specialists</p>
                  </div>
                </motion.div>
              </Link>

              <Link to="/find-hospital">
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                  custom={1}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  whileHover={{ y: -2 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">🏥</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Hospital</h3>
                    <p className="text-gray-600">Search hospitals by surgery type and country</p>
                  </div>
                </motion.div>
              </Link>

              <Link to="/appointments">
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                  custom={2}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  whileHover={{ y: -2 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">My Appointments</h3>
                    <p className="text-gray-600">View and manage your appointments</p>
                  </div>
                </motion.div>
              </Link>

              <Link to="/nurses">
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                  custom={3}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  whileHover={{ y: -2 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">👩‍⚕️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Nurse</h3>
                    <p className="text-gray-600">Search and book with nurses by location</p>
                  </div>
                </motion.div>
              </Link>

              <Link to="/ai-chatbot">
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                  custom={4}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  whileHover={{ y: -2 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Chatbot</h3>
                    <p className="text-gray-600">Chat with an AI health assistant</p>
                  </div>
                </motion.div>
              </Link>

              <motion.div
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                custom={4}
                variants={cardVariants}
                initial="hidden"
                animate="show"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">📁</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Health Records</h3>
                  <p className="text-gray-600">Coming soon - Access your health records</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDoctorDashboard = () => (
    <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="rounded-2xl h-auto p-8 bg-white/70 backdrop-blur border border-gray-100 shadow-sm">
          <div className="text-center">
            <motion.h1 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-gray-900 mb-2">
              Welcome, Dr. {user?.user?.first_name || user?.user?.username}!
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg text-gray-600 mb-8">
              Your Doctor Dashboard
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/appointments">
                <motion.div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100" custom={0} variants={cardVariants} initial="hidden" animate="show" whileHover={{ y: -2 }}>
                  <div className="text-center">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Appointments</h3>
                    <p className="text-gray-600">Manage your patient appointments</p>
                  </div>
                </motion.div>
              </Link>

              <motion.div className="bg-white p-6 rounded-xl shadow-md border border-gray-100" custom={1} variants={cardVariants} initial="hidden" animate="show">
                <div className="text-center">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Patients</h3>
                  <p className="text-gray-600">Coming soon - View your patients</p>
                </div>
              </motion.div>

              <motion.div className="bg-white p-6 rounded-xl shadow-md border border-gray-100" custom={2} variants={cardVariants} initial="hidden" animate="show">
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
                  <p className="text-gray-600">Coming soon - View your practice analytics</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="rounded-2xl h-auto p-8 bg-white/70 backdrop-blur border border-gray-100 shadow-sm">
          <div className="text-center">
            <motion.h1 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-gray-900 mb-2">
              Welcome, Admin {user?.user?.first_name || user?.user?.username}!
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg text-gray-600 mb-8">
              System Administration Dashboard
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/admin">
                <motion.div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100" custom={0} variants={cardVariants} initial="hidden" animate="show" whileHover={{ y: -2 }}>
                  <div className="text-center">
                    <div className="text-4xl mb-4">⚙️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Panel</h3>
                    <p className="text-gray-600">Manage users and system settings</p>
                  </div>
                </motion.div>
              </Link>

              <Link to="/appointments">
                <motion.div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100" custom={1} variants={cardVariants} initial="hidden" animate="show" whileHover={{ y: -2 }}>
                  <div className="text-center">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">All Appointments</h3>
                    <p className="text-gray-600">View and manage all appointments</p>
                  </div>
                </motion.div>
              </Link>

              <motion.div className="bg-white p-6 rounded-xl shadow-md border border-gray-100" custom={2} variants={cardVariants} initial="hidden" animate="show">
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">System Reports</h3>
                  <p className="text-gray-600">Coming soon - Generate system reports</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="rounded-full h-12 w-12 border-2 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  switch (user.user.user_type) {
    case 'patient':
      return renderPatientDashboard();
    case 'doctor':
      return renderDoctorDashboard();
    case 'admin':
      return renderAdminDashboard();
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Health Community Hub!</h1>
            <p className="text-gray-600 mt-2">Please contact support if you see this message.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;

