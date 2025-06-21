// src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { fireDB } from '../../DataBase/firebaseConfig';
import { FaEdit, FaSave, FaTimes, FaUser, FaPhone, FaHome, FaMapMarkerAlt, FaShoppingBag, FaClock } from 'react-icons/fa';
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  // Background images for different sections
  const bgPattern = "url('https://www.transparenttextures.com/patterns/45-degree-fabric-light.png')";
  const bgPatternDark = "url('https://www.transparenttextures.com/patterns/black-thread-light.png')";
  const profileBg = "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser?.email) {
          navigate('/Login');
          return;
        }

        const usersRef = collection(fireDB, 'users');
        const q = query(usersRef, where('email', '==', storedUser?.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          querySnapshot.forEach(doc => {
            const data = doc.data();
            setUserData({ id: doc.id, ...data });
            setEditedData({
              name: data.name,
              phone: data.phone,
              address: { ...data.address }
            });
          });
        } else {
          navigate('/Login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userData?.email) return;
      
      try {
        setLoadingOrders(true);
        const ordersRef = collection(fireDB, "orders");
        const q = query(ordersRef, where("email", "==", userData.email));
        const querySnapshot = await getDocs(q);
        
        const ordersArray = [];
        querySnapshot.forEach((doc) => {
          ordersArray.push({ id: doc.id, ...doc.data() });
        });
        
        setOrders(ordersArray);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (userData?.email) {
      fetchOrders();
    }
  }, [userData]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e, field, nestedField = null) => {
    if (nestedField) {
      setEditedData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [nestedField]: e.target.value
        }
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    }
  };

  const handleSave = async () => {
    try {
      const userDoc = doc(fireDB, 'users', userData.id);
      await updateDoc(userDoc, editedData);
      
      // Update local data
      setUserData(prev => ({
        ...prev,
        ...editedData
      }));
      
      setIsEditing(false);
      
      // Update localStorage if needed
      const storedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        name: editedData.name
      }));
      
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-purple-100 dark:bg-neutral-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-t-4 border-b-4 border-purple-500 dark:border-purple-400 rounded-full"
        />
      </div>
    );
  }

  if (!userData) return null;

  return (
    <Layout>
      <Helmet>
        <title>User Profile | Soft Game Studio</title>
        <meta 
          name="description" 
          content="Access and manage your personal profile, exam history, course progress, and certificates on Soft Game Studio. Keep your information secure and up to date." 
        />
        <meta 
          name="keywords" 
          content="User Profile, Student Dashboard, Exam History, Course Progress, Certification, Soft Game Studio Profile, Account Settings, Personal Information" 
        />
        <meta name="author" content="Soft Game Studio" />

        {/* Open Graph / Social Sharing */}
        <meta property="og:title" content="User Profile | Soft Game Studio" />
        <meta 
          property="og:description" 
          content="Manage your profile, exam records, course enrollments, and personal settings securely on Soft Game Studio." 
        />
        <meta property="og:url" content="https://softgamestudio.web.app/profile" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div 
        className="min-h-screen bg-purple-100 dark:bg-neutral-950 transition-colors duration-300 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(245, 243, 255, 0.8), ${bgPattern}`,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Animated floating elements */}
        <motion.div 
          className="absolute top-20 right-10 w-64 h-64 rounded-full bg-purple-300 dark:bg-purple-900 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-indigo-300 dark:bg-indigo-900 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 40, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Parallax Header */}
        <motion.div 
          className="h-80 relative overflow-hidden"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100,
            damping: 15
          }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: profileBg,
              backgroundAttachment: 'fixed'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 to-indigo-900/80 dark:from-black/80 dark:to-neutral-900/90" />
        </motion.div>

        {/* Profile Card */}
        <div className="max-w-5xl mx-auto px-4 -mt-40 relative z-10 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/30 dark:border-neutral-700"
          >
            {/* Profile Header */}
            <div className="p-8 relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/20 to-indigo-600/20 dark:from-purple-900/30 dark:to-indigo-900/30" />
              <div className="relative z-10 flex flex-col md:flex-row items-center">
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full p-1 shadow-lg">
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 flex items-center justify-center">
                      <FaUser className="text-5xl text-gray-400" />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleEditToggle}
                    className="absolute bottom-2 right-2 bg-purple-500 dark:bg-purple-600 text-white p-2 rounded-full shadow-md"
                  >
                    {isEditing ? <FaTimes /> : <FaEdit />}
                  </motion.button>
                </div>
                
                <motion.div 
                  className="mt-6 md:mt-0 md:ml-8 text-center md:text-left"
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {isEditing ? (
                    <div className="mb-4">
                      <input
                        type="text"
                        value={editedData.name}
                        onChange={(e) => handleChange(e, 'name')}
                        className="text-3xl font-bold bg-transparent border-b-2 border-purple-500 dark:border-purple-400 focus:outline-none text-center md:text-left w-full"
                      />
                    </div>
                  ) : (
                    <motion.h1 
                      className="text-3xl font-bold text-purple-900 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {userData.name}
                    </motion.h1>
                  )}
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-3">
                    <div className="flex items-center text-purple-700 dark:text-purple-300">
                      <FaPhone className="mr-2" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData.phone}
                          onChange={(e) => handleChange(e, 'phone')}
                          className="bg-transparent border-b border-purple-500 dark:border-purple-400 focus:outline-none w-32"
                        />
                      ) : (
                        <span>{userData.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center text-indigo-700 dark:text-indigo-300">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{userData.address?.city}, {userData.address?.state}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6 md:p-8">
              <div className="flex border-b border-gray-200 dark:border-neutral-700 mb-6">
                <button
                  className={`py-2 px-4 font-medium text-sm ${activeTab === 'profile' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile Information
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm ${activeTab === 'orders' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                  onClick={() => setActiveTab('orders')}
                >
                  My Orders ({orders.length})
                </button>
              </div>

              {activeTab === 'profile' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center mb-6 pb-2 border-b border-purple-200 dark:border-neutral-700">
                      <FaUser className="text-purple-600 dark:text-purple-400 mr-3 text-xl" />
                      <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400">
                        Personal Information
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <InfoItem 
                        label="Email" 
                        value={userData.email} 
                        icon="email"
                        isEditing={false}
                      />
                      <InfoItem 
                        label="Roll Number" 
                        value={userData.rollNumber} 
                        icon="badge"
                        isEditing={false}
                      />
                      <InfoItem 
                        label="Member Since" 
                        value={new Date(userData.time?.toDate()).toLocaleDateString()} 
                        icon="calendar"
                        isEditing={false}
                      />
                    </div>
                  </motion.div>

                  {/* Address */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center mb-6 pb-2 border-b border-purple-200 dark:border-neutral-700">
                      <FaHome className="text-purple-600 dark:text-purple-400 mr-3 text-xl" />
                      <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400">
                        Address
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <InfoItem 
                        label="House No" 
                        value={isEditing ? editedData.address?.houseno : userData.address?.houseno} 
                        isEditing={isEditing}
                        onChange={(e) => handleChange(e, 'address', 'houseno')}
                      />
                      <InfoItem 
                        label="Street No" 
                        value={isEditing ? editedData.address?.streetno : userData.address?.streetno} 
                        isEditing={isEditing}
                        onChange={(e) => handleChange(e, 'address', 'streetno')}
                      />
                      <InfoItem 
                        label="Area" 
                        value={isEditing ? editedData.address?.area : userData.address?.area} 
                        isEditing={isEditing}
                        onChange={(e) => handleChange(e, 'address', 'area')}
                      />
                      <InfoItem 
                        label="City" 
                        value={isEditing ? editedData.address?.city : userData.address?.city} 
                        isEditing={isEditing}
                        onChange={(e) => handleChange(e, 'address', 'city')}
                      />
                      <InfoItem 
                        label="State" 
                        value={isEditing ? editedData.address?.state : userData.address?.state} 
                        isEditing={isEditing}
                        onChange={(e) => handleChange(e, 'address', 'state')}
                      />
                      <InfoItem 
                        label="Pincode" 
                        value={isEditing ? editedData.address?.pincode : userData.address?.pincode} 
                        isEditing={isEditing}
                        onChange={(e) => handleChange(e, 'address', 'pincode')}
                      />
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="mt-4">
                  {loadingOrders ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center mb-4">
                        <FaShoppingBag className="text-gray-500 text-2xl" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Orders Yet</h3>
                      <p className="text-gray-500 dark:text-gray-400">You haven't placed any orders yet. Start exploring our products!</p>
                      <button 
                        onClick={() => navigate('/')}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                      >
                        Browse Products
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <motion.div 
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              {order.imageUrl ? (
                                <img 
                                  src={order.imageUrl} 
                                  alt={order.title} 
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 flex items-center justify-center">
                                  <FaShoppingBag className="text-gray-400" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{order.title}</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded">
                                    Order ID: {order.id.substring(0, 8)}
                                  </span>
                                  {/* <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded">
                                    {new Date(order.date?.toDate()).toLocaleDateString()}
                                  </span> */}
                                  <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded">
                                    {order.price === 0 ? "Free" : `₹${order.price}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {order.location && (
                                <a 
                                  href={order.location}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                  Access Now
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex justify-end"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-6 rounded-full flex items-center shadow-lg"
                  >
                    <FaSave className="mr-2" /> Save Changes
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

// Enhanced InfoItem Component
const InfoItem = ({ label, value, isEditing, onChange, icon }) => (
  <div className="flex flex-col md:flex-row md:items-center py-2 border-b border-purple-100 dark:border-neutral-700">
    <span className="font-medium text-purple-900 dark:text-neutral-300 md:w-2/5 flex items-center">
      {icon === 'email' && <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>}
      {icon === 'badge' && <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>}
      {icon === 'calendar' && <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg>}
      {label}
    </span>
    
    {isEditing ? (
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="bg-transparent border-b border-purple-500 dark:border-purple-400 focus:outline-none py-1 md:ml-4 flex-grow"
      />
    ) : (
      <span className="text-purple-700 dark:text-neutral-200 font-medium mt-1 md:mt-0">
        {value || 'N/A'}
      </span>
    )}
  </div>
);

export default ProfilePage;