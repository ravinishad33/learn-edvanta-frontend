// src/pages/UserDetail.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  AcademicCapIcon,
  TrophyIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  HeartIcon,
  BellIcon,
  Cog6ToothIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  EnvelopeOpenIcon,
  PaperAirplaneIcon,
  NoSymbolIcon,
  CheckBadgeIcon,
  IdentificationIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  CakeIcon,
  LinkIcon,
  ChatBubbleLeftRightIcon,
  FlagIcon,
  FolderOpenIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);



  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };




const getUserById = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/admin/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};




useEffect(() => {
  const fetchUser = async () => {
    const data = await getUserById(id);
    setUserData(data?.user);
    console.log(data.user)
  };

  fetchUser();
}, [id]);







  // Mock data fetch - in real app, this would be an API call
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock user data based on role (for demonstration)
    //   const role = id.includes('ins') ? 'instructor' : id.includes('adm') ? 'admin' : 'student';
    const role="instructor"
      
    //   const mockUserData = {
    //     id: id,
    //     name: role === 'instructor' ? 'Sarah Johnson' : 
    //           role === 'admin' ? 'Michael Chen' : 'Alex Johnson',
    //     email: role === 'instructor' ? 'sarah.johnson@example.com' : 
    //            role === 'admin' ? 'michael.chen@example.com' : 'alex.johnson@example.com',
    //     phone: '+1 (555) 123-4567',
    //     role: role,
    //     status: 'active',
    //     verified: true,
    //     joinDate: '2023-01-15',
    //     lastLogin: '2024-03-15T10:30:00',
    //     location: 'San Francisco, CA',
    //     timezone: 'PST (UTC-8)',
    //     language: 'English',
    //     avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400',
    //     coverPhoto: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200',
    //     bio: role === 'instructor' ? 
    //       'Senior Frontend Engineer with 8+ years of experience. Passionate about teaching React and modern web development. Creator of 12 bestselling courses.' :
    //       role === 'admin' ?
    //       'Platform administrator with expertise in system management, user support, and content moderation. Ensuring smooth platform operations.' :
    //       'Passionate learner focused on web development and data science. Currently mastering React, Python, and machine learning.',
        
    //     // Role-specific data
    //     ...(role === 'student' && {
    //       studentProfile: {
    //         enrolledCourses: 8,
    //         completedCourses: 3,
    //         learningHours: 124,
    //         certificates: 5,
    //         averageScore: 92,
    //         communityRank: 'Top 10%',
    //         learningGoals: [
    //           { id: 1, goal: 'Complete React Masterclass', progress: 75, deadline: '2024-04-01' },
    //           { id: 2, goal: 'Earn Python Certificate', progress: 40, deadline: '2024-05-15' },
    //           { id: 3, goal: 'Spend 50 hours learning', progress: 32, deadline: '2024-03-30' }
    //         ],
    //         wishlist: [1, 2, 3],
    //         recentCourses: [
    //           { id: 1, title: 'React Masterclass', progress: 75, lastAccessed: '2 days ago' },
    //           { id: 2, title: 'Python Data Science', progress: 40, lastAccessed: '1 week ago' },
    //           { id: 3, title: 'UI/UX Design', progress: 90, lastAccessed: 'Yesterday' }
    //         ]
    //       }
    //     }),
        
    //     ...(role === 'instructor' && {
    //       instructorProfile: {
    //         title: 'Senior React Developer & Instructor',
    //         rating: 4.9,
    //         totalRatings: 1245,
    //         totalStudents: 12500,
    //         totalCourses: 12,
    //         totalRevenue: 24580,
    //         courses: [
    //           { id: 1, title: 'React Masterclass', students: 1245, revenue: 12450, rating: 4.9, status: 'published' },
    //           { id: 2, title: 'Node.js Backend', students: 856, revenue: 8560, rating: 4.7, status: 'published' },
    //           { id: 3, title: 'Python Data Science', students: 357, revenue: 3570, rating: 4.8, status: 'draft' }
    //         ],
    //         earnings: {
    //           total: 24580,
    //           thisMonth: 2450,
    //           pending: 1250,
    //           withdrawn: 23330
    //         },
    //         paypalEmail: 'sarah.johnson@paypal.com',
    //         bankDetails: {
    //           accountNumber: '****4567',
    //           bankName: 'Chase Bank',
    //           routingNumber: '****8901'
    //         }
    //       }
    //     }),
        
    //     ...(role === 'admin' && {
    //       adminProfile: {
    //         permissions: ['full_access', 'user_management', 'course_management', 'payment_management'],
    //         department: 'Platform Operations',
    //         managedSections: ['Users', 'Courses', 'Payments', 'Reports'],
    //         lastActions: [
    //           { action: 'Approved 3 courses', time: '2 hours ago' },
    //           { action: 'Suspended user john_doe', time: '4 hours ago' },
    //           { action: 'Generated monthly report', time: '1 day ago' }
    //         ],
    //         adminSince: '2022-01-15'
    //       }
    //     }),

    //     // Common fields for all roles
    //     contactInfo: {
    //       website: 'https://alexjohnson.dev',
    //       github: 'https://github.com/alexjohnson',
    //       linkedin: 'https://linkedin.com/in/alexjohnson',
    //       twitter: 'https://twitter.com/alexjohnson'
    //     },
        
    //     education: [
    //       {
    //         institution: 'Stanford University',
    //         degree: 'M.S. Computer Science',
    //         year: '2018-2020',
    //         gpa: 3.9
    //       },
    //       {
    //         institution: 'UC Berkeley',
    //         degree: 'B.S. Computer Science',
    //         year: '2014-2018',
    //         gpa: 3.8
    //       }
    //     ],
        
    //     experience: [
    //       {
    //         company: 'TechCorp',
    //         position: 'Senior Frontend Engineer',
    //         period: '2020-Present',
    //         description: 'Leading React development team'
    //       },
    //       {
    //         company: 'StartupXYZ',
    //         position: 'Frontend Developer',
    //         period: '2018-2020',
    //         description: 'Built responsive web applications'
    //       }
    //     ],
        
    //     skills: ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'GraphQL'],
        
    //     interests: ['Web Development', 'Machine Learning', 'Open Source'],
        
    //     security: {
    //       twoFactorEnabled: true,
    //       lastPasswordChange: '2024-02-15',
    //       trustedDevices: [
    //         { device: 'MacBook Pro', location: 'San Francisco, CA', lastSeen: '2 hours ago' },
    //         { device: 'iPhone 14', location: 'San Francisco, CA', lastSeen: '1 day ago' }
    //       ]
    //     },
        
    //     paymentMethods: [
    //       { type: 'visa', last4: '4242', expiry: '05/25', default: true },
    //       { type: 'paypal', email: 'alex@example.com', default: false }
    //     ],
        
    //     notifications: {
    //       email: true,
    //       push: true,
    //       marketing: false
    //     },
        
    //     moderation: {
    //       reported: 0,
    //       flagged: 0,
    //       warnings: 0,
    //       suspensions: 0
    //     }
    //   };

    //   setUserData(mockUserData);
      
      // Mock activity logs
      setActivityLogs([
        { id: 1, action: 'Logged in', ip: '192.168.1.1', device: 'MacBook Pro', location: 'San Francisco, CA', timestamp: '2024-03-15T10:30:00' },
        { id: 2, action: 'Enrolled in React Masterclass', ip: '192.168.1.1', device: 'MacBook Pro', location: 'San Francisco, CA', timestamp: '2024-03-14T15:20:00' },
        { id: 3, action: 'Completed lesson 5', ip: '192.168.1.1', device: 'iPhone 14', location: 'San Francisco, CA', timestamp: '2024-03-13T09:45:00' },
        { id: 4, action: 'Updated profile', ip: '192.168.1.1', device: 'MacBook Pro', location: 'San Francisco, CA', timestamp: '2024-03-12T14:30:00' },
        { id: 5, action: 'Changed password', ip: '192.168.1.1', device: 'MacBook Pro', location: 'San Francisco, CA', timestamp: '2024-03-10T11:15:00' }
      ]);
      
      // Mock payment history
      setPaymentHistory([
        { id: 1, date: '2024-03-01', amount: 89.99, course: 'React Masterclass', status: 'completed', method: 'Visa ending in 4242' },
        { id: 2, date: '2024-02-15', amount: 79.99, course: 'Python Data Science', status: 'completed', method: 'PayPal' },
        { id: 3, date: '2024-01-20', amount: 49.99, course: 'UI/UX Design', status: 'completed', method: 'Visa ending in 4242' },
        { id: 4, date: '2024-01-05', amount: 129.99, course: 'Node.js Backend', status: 'refunded', method: 'Visa ending in 4242' }
      ]);
      
      // Mock enrolled courses
      setEnrolledCourses([
        { id: 1, title: 'React Masterclass', progress: 75, status: 'active', enrolledDate: '2024-02-01', lastAccess: '2024-03-14', certificate: true },
        { id: 2, title: 'Python Data Science', progress: 40, status: 'active', enrolledDate: '2024-02-15', lastAccess: '2024-03-10', certificate: true },
        { id: 3, title: 'UI/UX Design', progress: 90, status: 'completed', enrolledDate: '2024-01-10', lastAccess: '2024-02-28', certificate: true }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const handleSuspendUser = (duration) => {
    // API call to suspend user
    console.log(`Suspending user for ${duration}`);
    setShowSuspendModal(false);
  };

  const handleDeleteUser = () => {
    // API call to delete user
    console.log('Deleting user');
    setShowDeleteModal(false);
    navigate('/admin/users');
  };

  const handleSendMessage = () => {
    // API call to send message
    console.log('Sending message:', messageText);
    setShowMessageModal(false);
    setMessageText('');
  };

  const handleToggleStatus = () => {
    // API call to toggle user active status
    setUserData({
      ...userData,
      status: userData.status === 'active' ? 'suspended' : 'active'
    });
  };

  const handleResendVerification = () => {
    // API call to resend verification email
    console.log('Resending verification email');
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'instructor': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header with actions */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                <p className="text-sm text-gray-500">View and manage user details</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMessageModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                Message
              </button>
              
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  userData.status === 'active'
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {userData.status === 'active' ? (
                  <>
                    <NoSymbolIcon className="h-4 w-4 mr-2" />
                    Suspend
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Photo */}
      {/* <div className="relative h-64 md:h-80">
        <div className="absolute inset-0">
          <img
            src={userData.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
      </div> */}

      {/* Profile Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-15 pt-2">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              {/* Avatar */}
              <div className="relative mb-6 md:mb-0 md:mr-8">
                <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  <img 
                    src={userData.avatar.url} 
                    alt={userData.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                {/* Verification Badge */}
                {userData.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1 rounded-full">
                    <CheckBadgeIcon className="h-6 w-6" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{userData?.name}</h1>
                    <div className="flex items-center mt-2 space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getRoleBadgeColor(userData.role)}`}>
                        {userData?.role}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(userData.status)}`}>
                        {userData?.status}
                      </span>
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>Joined {new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-4">
                  <p className="text-gray-600 leading-relaxed">{userData.bio}</p>
                </div>

                {/* Contact Info */}
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    <a href={`mailto:${userData.email}`} className="hover:text-blue-600">
                      {userData.email}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <a href={`tel:${userData.phone}`} className="hover:text-blue-600">
                      {userData.phone}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{userData.location}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-4 flex items-center space-x-4">
                  {userData?.website && (
                    <a href={userData?.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                      <GlobeAltIcon className="h-5 w-5" />
                    </a>
                  )}
                  {userData?.github && (
                    <a href={userData?.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </a>
                  )}
                  {userData?.linkedin && (
                    <a href={userData?.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                  {userData?.twitter && (
                    <a href={userData?.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.553-12.566 9.05 9.05 0 002.21-2.297z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-t border-gray-200 overflow-x-auto">
            <nav className="flex">
              {[
                { id: 'overview', label: 'Overview', icon: UserIcon },
                { id: 'courses', label: 'Courses', icon: BookOpenIcon },
                { id: 'activity', label: 'Activity Log', icon: ClockIcon },
                { id: 'payments', label: 'Payments', icon: CurrencyDollarIcon },
                { id: 'security', label: 'Security', icon: ShieldCheckIcon },
                ...(userData.role === 'instructor' ? [{ id: 'earnings', label: 'Earnings', icon: ChartBarIcon }] : []),
                { id: 'settings', label: 'Settings', icon: Cog6ToothIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {userData.role === 'student' && (
                    <>
                      <StatCard icon={BookOpenIcon} label="Enrolled Courses" value={userData?.studentProfile?.enrolledCourses} color="blue" />
                      <StatCard icon={TrophyIcon} label="Completed" value={userData?.studentProfile?.completedCourses} color="green" />
                      <StatCard icon={ClockIcon} label="Learning Hours" value={userData?.studentProfile?.learningHours} color="purple" />
                      <StatCard icon={DocumentTextIcon} label="Certificates" value={userData?.studentProfile?.certificates} color="yellow" />
                      <StatCard icon={ChartBarIcon} label="Avg Score" value={`${userData?.studentProfile?.averageScore}%`} color="pink" />
                      <StatCard icon={UsersIcon} label="Community Rank" value={userData?.studentProfile?.communityRank} color="indigo" />
                    </>
                  )}
                  
                  {userData.role === 'instructor' && (
                    <>
                      <StatCard icon={BookOpenIcon} label="Courses" value={userData.instructorProfile.totalCourses} color="blue" />
                      <StatCard icon={UsersIcon} label="Students" value={userData.instructorProfile.totalStudents} color="green" />
                      <StatCard icon={CurrencyDollarIcon} label="Revenue" value={`$${userData.instructorProfile.totalRevenue}`} color="purple" />
                      <StatCard icon={StarIcon} label="Rating" value={userData.instructorProfile.rating} color="yellow" />
                      <StatCard icon={CheckCircleIcon} label="Completion" value="82%" color="pink" />
                      <StatCard icon={ClockIcon} label="Response Time" value="2.4 hrs" color="indigo" />
                    </>
                  )}
                  
                  {userData.role === 'admin' && (
                    <>
                      <StatCard icon={UsersIcon} label="Users Managed" value="1,245" color="blue" />
                      <StatCard icon={BookOpenIcon} label="Courses Reviewed" value="458" color="green" />
                      <StatCard icon={FlagIcon} label="Reports Handled" value="23" color="purple" />
                      <StatCard icon={ShieldCheckIcon} label="Actions Taken" value="156" color="yellow" />
                      <StatCard icon={ClockIcon} label="Avg Response" value="1.5 hrs" color="pink" />
                      <StatCard icon={CheckCircleIcon} label="Resolution" value="98%" color="indigo" />
                    </>
                  )}
                </div>

                {/* Skills & Interests */}
                {/* <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.skills?.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mt-6 mb-4">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData?.interests?.map((interest, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div> */}

                {/* Experience */}
                {/* <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Work Experience</h3>
                  <div className="space-y-4">
                    {userData?.experience?.map((exp, index) => (
                      <div key={index} className="flex items-start">
                        <div className="p-2 bg-gray-100 rounded-lg mr-4">
                          <BriefcaseIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{exp?.position}</h4>
                          <p className="text-gray-700">{exp?.company}</p>
                          <p className="text-sm text-gray-500">{exp?.period}</p>
                          <p className="text-sm text-gray-600 mt-1">{exp?.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}


                {/* Education */}
                {/* <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Education</h3>
                  <div className="space-y-4">
                    {userData?.education?.map((edu, index) => (
                      <div key={index} className="flex items-start">
                        <div className="p-2 bg-gray-100 rounded-lg mr-4">
                          <AcademicCapIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{edu?.degree}</h4>
                          <p className="text-gray-700">{edu?.institution}</p>
                          <p className="text-sm text-gray-500">{edu?.year}</p>
                          <p className="text-sm text-gray-600 mt-1">GPA: {edu?.gpa}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}




              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* User Info Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">User Information</h3>
                  <div className="space-y-3">
                    <InfoItem icon={UserIcon} label="Full Name" value={userData.name} />
                    <InfoItem icon={EnvelopeIcon} label="Email" value={userData.email} />
                    <InfoItem icon={PhoneIcon} label="Phone" value={userData.phone} />
                    <InfoItem icon={MapPinIcon} label="Location" value={userData.location || " "} />
                    {/* <InfoItem icon={GlobeAltIcon} label="Timezone" value={userData.timezone || " "} /> */}
                    <InfoItem icon={CalendarIcon} label="Join Date" value={new Date(userData.createdAt).toLocaleDateString()} />
                    <InfoItem icon={ClockIcon} label="Last Login" value={new Date(userData.lastLogin).toLocaleString()} />
                  </div>
                </div>

                {/* Learning Goals (for students)
                {userData.role === 'student' && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Goals</h3>
                    <div className="space-y-4">
                      {userData?.studentProfile?.learningGoals?.map((goal) => (
                        <div key={goal.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{goal?.goal}</span>
                            <span className="font-medium">{goal?.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.progress}%` }}
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Due: {new Date(goal?.deadline).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}

                {/* Instructor Stats (for instructors) */}
                {userData?.role === 'instructor' && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Instructor Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Students</span>
                        <span className="font-bold">{userData.instructorProfile.totalStudents.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Revenue</span>
                        <span className="font-bold text-green-600">${userData.instructorProfile.totalRevenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">This Month</span>
                        <span className="font-bold text-green-600">${userData.instructorProfile.earnings.thisMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending</span>
                        <span className="font-bold text-yellow-600">${userData.instructorProfile.earnings.pending}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Rating</span>
                        <span className="font-bold flex items-center">
                          {userData.instructorProfile.rating}
                          <StarIcon className="h-4 w-4 text-yellow-500 ml-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Permissions (for admins) */}
                {userData.role === 'admin' && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Permissions</h3>
                    <div className="space-y-2">
                      {userData.adminProfile.permissions.map((perm, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                          <span className="capitalize">{perm.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mt-6 mb-4">Managed Sections</h3>
                    <div className="flex flex-wrap gap-2">
                      {userData.adminProfile.managedSections.map((section, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {activityLogs.slice(0, 3).map((log) => (
                      <div key={log.id} className="flex items-start p-2 hover:bg-gray-50 rounded-lg">
                        <div className="p-1 bg-blue-100 rounded-lg mr-3">
                          <ClockIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{log.action}</p>
                          <p className="text-xs text-gray-500">{log.timestamp} • {log.device}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('activity')}
                    className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All Activity
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-8">
              {/* Enrolled/Purchased Courses */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {userData.role === 'instructor' ? 'Published Courses' : 'Enrolled Courses'}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {userData.role === 'instructor' 
                      ? userData.instructorProfile.totalCourses 
                      : userData.studentProfile.enrolledCourses} Courses
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(userData.role === 'instructor' ? userData.instructorProfile.courses : enrolledCourses).map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ y: -5 }}
                      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs">
                          {course.status || 'active'}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 mb-2">{course.title}</h4>
                        
                        {userData.role === 'student' && (
                          <>
                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">Enrolled: {course.enrolledDate}</p>
                          </>
                        )}
                        
                        {userData.role === 'instructor' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Students</span>
                              <span className="font-medium">{course.students}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Revenue</span>
                              <span className="font-medium text-green-600">{course.revenue}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Rating</span>
                              <span className="font-medium flex items-center">
                                {course.rating}
                                <StarIcon className="h-3 w-3 text-yellow-500 ml-1" />
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4 flex justify-end">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Learning Progress (for students) */}
              {userData.role === 'student' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Learning Progress</h3>
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-900">{course.title}</span>
                            <span className="text-sm text-gray-600">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Last access: {course.lastAccess}</span>
                            {course.certificate && (
                              <span className="flex items-center text-green-600">
                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                Certificate Available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Activity Log</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.device}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-8">
              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <p className="text-sm text-gray-600 mb-2">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">$349.96</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <p className="text-sm text-gray-600 mb-2">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <p className="text-sm text-gray-600 mb-2">Refunds</p>
                  <p className="text-2xl font-bold text-gray-900">$129.99</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <p className="text-sm text-gray-600 mb-2">Last Payment</p>
                  <p className="text-2xl font-bold text-gray-900">Mar 1</p>
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Payment History</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.course}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${payment.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              payment.status === 'refunded' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.method}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h3>
                <div className="space-y-4">
                  {userData.paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <CreditCardIcon className="h-6 w-6 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {method.type === 'visa' ? 'Visa' : method.type} ending in {method.last4}
                          </p>
                          <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                        </div>
                      </div>
                      {method.default && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Default</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Security Settings */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Security Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add extra layer of security</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        userData.security.twoFactorEnabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {userData.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Last Password Change</p>
                        <p className="text-sm text-gray-600">{userData.security.lastPasswordChange}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                {/* Trusted Devices */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Trusted Devices</h3>
                  <div className="space-y-4">
                    {userData.security.trustedDevices.map((device, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <DevicePhoneMobileIcon className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{device.device}</p>
                            <p className="text-sm text-gray-500">{device.location} • {device.lastSeen}</p>
                          </div>
                        </div>
                        <button className="text-red-600 hover:text-red-800">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Login History */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Logins</h3>
                  <div className="space-y-3">
                    {activityLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-start p-2 hover:bg-gray-50 rounded-lg">
                        <div className="p-1 bg-blue-100 rounded-lg mr-3">
                          <ClockIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{log.action}</p>
                          <p className="text-xs text-gray-500">{log.timestamp} • {log.device}</p>
                          <p className="text-xs text-gray-400">{log.location} • {log.ip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Moderation History */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Moderation History</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">{userData.moderation.warnings}</p>
                      <p className="text-sm text-gray-600">Warnings</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">{userData.moderation.reported}</p>
                      <p className="text-sm text-gray-600">Reports</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">{userData.moderation.suspensions}</p>
                      <p className="text-sm text-gray-600">Suspensions</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">{userData.moderation.flagged}</p>
                      <p className="text-sm text-gray-600">Flagged</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Earnings Tab (for instructors) */}
          {activeTab === 'earnings' && userData.role === 'instructor' && (
            <div className="space-y-8">
              {/* Earnings Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <p className="text-sm text-gray-600 mb-2">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${userData.instructorProfile.earnings.total}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <p className="text-sm text-gray-600 mb-2">This Month</p>
                  <p className="text-2xl font-bold text-green-600">${userData.instructorProfile.earnings.thisMonth}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <p className="text-sm text-gray-600 mb-2">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">${userData.instructorProfile.earnings.pending}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <p className="text-sm text-gray-600 mb-2">Withdrawn</p>
                  <p className="text-2xl font-bold text-gray-900">${userData.instructorProfile.earnings.withdrawn}</p>
                </div>
              </div>

              {/* Payout Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Payout Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">PayPal Email</p>
                    <p className="font-medium text-gray-900">{userData.instructorProfile.paypalEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bank Account</p>
                    <p className="font-medium text-gray-900">{userData.instructorProfile.bankDetails.accountNumber}</p>
                    <p className="text-sm text-gray-500">{userData.instructorProfile.bankDetails.bankName}</p>
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Request Payout
                  </button>
                  <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                    Update Bank Details
                  </button>
                </div>
              </div>

              {/* Course Revenue Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue by Course</h3>
                <div className="space-y-4">
                  {userData.instructorProfile.courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{course.title}</p>
                        <p className="text-sm text-gray-600">{course.students} students</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{course.revenue}</p>
                        <p className="text-sm text-gray-500">{course.rating} rating</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Notification Settings */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={userData.notifications.email} readOnly />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive push notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={userData.notifications.push} readOnly />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Marketing Emails</p>
                      <p className="text-sm text-gray-600">Receive promotional content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={userData.notifications.marketing} readOnly />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Visibility
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Public</option>
                      <option>Private</option>
                      <option>Connections Only</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Show Online Status
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                    Reset Password
                  </button>
                  <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                    Send Verification Email
                  </button>
                  <button className="w-full text-left p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100">
                    Export User Data
                  </button>
                  <button 
                  
                  className="w-full text-left p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Suspend User Modal */}
      <AnimatePresence>
        {showSuspendModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Suspend User</h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to suspend {userData.name}? They won't be able to access their account during this period.
                </p>
                
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => handleSuspendUser('24h')}
                    className="w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Suspend for 24 Hours
                  </button>
                  <button
                    onClick={() => handleSuspendUser('7d')}
                    className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Suspend for 7 Days
                  </button>
                  <button
                    onClick={() => handleSuspendUser('permanent')}
                    className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Suspend Permanently
                  </button>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSuspendModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete User Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete User Account</h3>
                <p className="text-gray-600 text-center mb-6">
                  This action cannot be undone. This will permanently delete the user account and all associated data.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Warning:</strong> Deleting this account will remove:
                  </p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• All user information and profile data</li>
                    <li>• Course enrollments and progress</li>
                    <li>• Certificates and achievements</li>
                    <li>• Payment history and receipts</li>
                  </ul>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Message User Modal */}
      <AnimatePresence>
        {showMessageModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Send Message</h3>
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {userData.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{userData.name}</p>
                      <p className="text-sm text-gray-500">{userData.email}</p>
                    </div>
                  </div>
                  
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type your message here..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-center">
      <div className={`p-2 bg-${color}-100 rounded-lg`}>
        <Icon className={`h-5 w-5 text-${color}-600`} />
      </div>
      <div className="ml-3">
        <div className="text-xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start">
    <Icon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  </div>
);

export default UserDetail;