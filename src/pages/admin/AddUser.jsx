// src/pages/UserAdd.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  CameraIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  HeartIcon,
  Cog6ToothIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  LinkIcon,
  TagIcon,
  SparklesIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
  KeyIcon,
  IdentificationIcon,
  CreditCardIcon,
  CakeIcon,
  FlagIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const UserAdd = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    phone: '',
    role: 'student',
    status: 'active',
    verified: false,
    bio: '',
    location: '',
    timezone: 'UTC-8',
    language: 'English',
    dob: '',
    gender: 'prefer-not-to-say',
    
    // Account Information
    username: '',
    password: '',
    confirmPassword: '',
    
    // Professional Information
    skills: [],
    interests: [],
    
    // Social Links
    social: {
      website: '',
      github: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    
    // Experience
    experience: [],
    
    // Education
    education: [],
    
    // Security
    security: {
      twoFactorEnabled: false,
      requirePasswordChange: false
    },
    
    // Notifications
    notifications: {
      email: true,
      push: true,
      marketing: false,
      courseUpdates: true,
      assignmentReminders: true,
      discussionReplies: true
    },
    
    // Privacy
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      showEmail: false,
      showPhone: false
    },
    
    // Avatar and Cover
    avatar: null,
    coverPhoto: null,
    
    // Additional Info
    department: '',
    employeeId: '',
    studentId: '',
    joinDate: new Date().toISOString().split('T')[0],
    tags: []
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

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

  // Role options
  const roles = [
    { 
      value: 'student', 
      label: 'Student', 
      icon: UserIcon, 
      color: 'blue',
      description: 'Can enroll in courses and track progress',
      permissions: ['View courses', 'Enroll in courses', 'Complete assignments', 'Earn certificates']
    },
    { 
      value: 'instructor', 
      label: 'Instructor', 
      icon: AcademicCapIcon, 
      color: 'green',
      description: 'Can create and manage courses',
      permissions: ['Create courses', 'Upload content', 'Grade assignments', 'View analytics']
    },
    { 
      value: 'admin', 
      label: 'Administrator', 
      icon: ShieldCheckIcon, 
      color: 'purple',
      description: 'Full platform access and management',
      permissions: ['Manage users', 'Manage courses', 'View reports', 'System settings']
    }
  ];

  // Status options
  const statuses = [
    { value: 'active', label: 'Active', color: 'green', description: 'User can access the platform' },
    { value: 'inactive', label: 'Inactive', color: 'gray', description: 'User cannot log in' },
    { value: 'pending', label: 'Pending Verification', color: 'yellow', description: 'Awaiting email verification' },
    { value: 'suspended', label: 'Suspended', color: 'red', description: 'Temporarily restricted' }
  ];

  // Gender options
  const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  // Timezone options
  const timezones = [
    'UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6', 'UTC-5', 'UTC-4',
    'UTC-3', 'UTC-2', 'UTC-1', 'UTC+0', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5',
    'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12'
  ];

  // Language options
  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Bengali', 'Urdu'
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: checked
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle array fields (skills, interests, tags)
  const handleArrayAdd = (field, value) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Handle experience
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          location: ''
        }
      ]
    }));
  };

  const updateExperience = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  // Handle education
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          institution: '',
          degree: '',
          field: '',
          startYear: '',
          endYear: '',
          current: false,
          grade: '',
          activities: ''
        }
      ]
    }));
  };

  const updateEducation = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Handle file uploads
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'File size should be less than 5MB' }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Please upload an image file' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target.result);
        setFormData(prev => ({ ...prev, avatar: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, coverPhoto: 'File size should be less than 10MB' }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, coverPhoto: 'Please upload an image file' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverPreview(event.target.result);
        setFormData(prev => ({ ...prev, coverPhoto: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Basic Information
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters and can only contain letters, numbers, and underscores';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Date of birth validation
    if (formData.dob) {
      const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
      if (age < 13) {
        newErrors.dob = 'User must be at least 13 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
    }, 2000);
  };

  // Generate username from email
  const generateUsername = () => {
    if (formData.email) {
      const username = formData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      setFormData(prev => ({ ...prev, username }));
    }
  };

  // Generate random password
  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData(prev => ({ ...prev, password, confirmPassword: password }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/users')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
                <p className="text-sm text-gray-500">Create a new user account</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin-dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating User...
                  </>
                ) : (
                  'Create User'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 max-w-md"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-green-700">User created successfully! Redirecting...</p>
              </div>
            </div>
          </motion.div>
        )}

        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 max-w-md"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
              <div className="flex items-center">
                <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">Please fix the validation errors.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create New User</h3>
              
              <nav className="space-y-2">
                {[
                  { id: 'basic', label: 'Basic Information', icon: UserIcon, color: 'blue' },
                  { id: 'account', label: 'Account Settings', icon: KeyIcon, color: 'green' },
                  { id: 'professional', label: 'Professional', icon: BriefcaseIcon, color: 'purple' },
                  { id: 'social', label: 'Social Links', icon: GlobeAltIcon, color: 'pink' },
                  { id: 'preferences', label: 'Preferences', icon: Cog6ToothIcon, color: 'orange' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? `bg-${tab.color}-50 text-${tab.color}-600`
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className={`h-5 w-5 mr-3 ${
                      activeTab === tab.id ? `text-${tab.color}-600` : 'text-gray-400'
                    }`} />
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Role Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Selected Role</h4>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    {formData.role === 'student' && <UserIcon className="h-5 w-5 text-blue-600 mr-2" />}
                    {formData.role === 'instructor' && <AcademicCapIcon className="h-5 w-5 text-green-600 mr-2" />}
                    {formData.role === 'admin' && <ShieldCheckIcon className="h-5 w-5 text-purple-600 mr-2" />}
                    <span className="font-medium capitalize text-gray-900">{formData.role}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {roles.find(r => r.value === formData.role)?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                {/* Basic Information Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>

                    {/* Avatar and Cover Photo */}
                    <div className="space-y-6">
                      {/* Cover Photo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cover Photo
                        </label>
                        <div className="relative h-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl overflow-hidden">
                          {coverPreview && (
                            <img
                              src={coverPreview}
                              alt="Cover Preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <label className="cursor-pointer">
                              <div className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 flex items-center">
                                <CameraIcon className="h-5 w-5 mr-2" />
                                Upload Cover
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleCoverChange}
                              />
                            </label>
                          </div>
                        </div>
                        {errors.coverPhoto && (
                          <p className="mt-1 text-sm text-red-600">{errors.coverPhoto}</p>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden border-4 border-white shadow-lg">
                            {avatarPreview ? (
                              <img
                                src={avatarPreview}
                                alt="Avatar Preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-white text-3xl font-bold">
                                {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                              </div>
                            )}
                          </div>
                          <label className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100">
                            <CameraIcon className="h-4 w-4 text-gray-600" />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleAvatarChange}
                            />
                          </label>
                        </div>
                        <div className="ml-6">
                          <p className="text-sm text-gray-500">Profile Photo</p>
                          <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</p>
                        </div>
                      </div>
                      {errors.avatar && (
                        <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
                      )}
                    </div>

                    {/* Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone and Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <div className="relative">
                          <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="San Francisco, CA"
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Date of Birth and Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.dob ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.dob && (
                          <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {genders.map(gender => (
                            <option key={gender.value} value={gender.value}>
                              {gender.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us about this user..."
                      />
                    </div>

                    {/* Role and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          User Role *
                        </label>
                        <div className="space-y-3">
                          {roles.map((role) => (
                            <label
                              key={role.value}
                              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                formData.role === role.value
                                  ? `border-${role.color}-500 bg-${role.color}-50`
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="role"
                                value={role.value}
                                checked={formData.role === role.value}
                                onChange={handleChange}
                                className="sr-only"
                              />
                              <role.icon className={`h-6 w-6 mr-3 ${
                                formData.role === role.value
                                  ? `text-${role.color}-600`
                                  : 'text-gray-400'
                              }`} />
                              <div>
                                <div className={`font-medium ${
                                  formData.role === role.value
                                    ? `text-${role.color}-700`
                                    : 'text-gray-700'
                                }`}>
                                  {role.label}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {role.description}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Account Status
                        </label>
                        <div className="space-y-3">
                          {statuses.map((status) => (
                            <label
                              key={status.value}
                              className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                                formData.status === status.value
                                  ? `border-${status.color}-500 bg-${status.color}-50`
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="status"
                                value={status.value}
                                checked={formData.status === status.value}
                                onChange={handleChange}
                                className="sr-only"
                              />
                              <div>
                                <div className={`font-medium ${
                                  formData.status === status.value
                                    ? `text-${status.color}-700`
                                    : 'text-gray-700'
                                }`}>
                                  {status.label}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {status.description}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Verification Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Email Verification</p>
                        <p className="text-sm text-gray-600">Mark email as verified</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="verified"
                          checked={formData.verified}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Timezone and Language */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {timezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Language
                        </label>
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {languages.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleArrayRemove('tags', index)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Add a tag (press Enter)"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleArrayAdd('tags', e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.target.previousSibling;
                            handleArrayAdd('tags', input.value);
                            input.value = '';
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Settings Tab */}
                {activeTab === 'account' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username *
                      </label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="johndoe_123"
                            className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.username ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={generateUsername}
                          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          Generate
                        </button>
                      </div>
                      {errors.username && (
                        <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="flex space-x-2 mb-3">
                        <div className="relative flex-1">
                          <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                              <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={generatePassword}
                          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          Generate
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 8 characters with uppercase, lowercase, and numbers
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Security Options */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Require Password Change on First Login</p>
                          <p className="text-sm text-gray-600">User will be prompted to change password</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="security.requirePasswordChange"
                            checked={formData.security.requirePasswordChange}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Enable Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">Add extra security layer</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="security.twoFactorEnabled"
                            checked={formData.security.twoFactorEnabled}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Additional IDs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Student/Employee ID
                        </label>
                        <div className="relative">
                          <IdentificationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name={formData.role === 'student' ? 'studentId' : 'employeeId'}
                            value={formData.role === 'student' ? formData.studentId : formData.employeeId}
                            onChange={handleChange}
                            placeholder={formData.role === 'student' ? 'STU-2024-001' : 'EMP-2024-001'}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <div className="relative">
                          <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="Engineering"
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Join Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Join Date
                      </label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          name="joinDate"
                          value={formData.joinDate}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Professional Information Tab */}
                {activeTab === 'professional' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">Professional Information</h2>

                    {/* Skills */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.skills.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleArrayRemove('skills', index)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Add a skill (e.g., React, Python)"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleArrayAdd('skills', e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.target.previousSibling;
                            handleArrayAdd('skills', input.value);
                            input.value = '';
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Interests */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interests
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.interests.map((interest, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                            {interest}
                            <button
                              type="button"
                              onClick={() => handleArrayRemove('interests', index)}
                              className="ml-2 text-purple-600 hover:text-purple-800"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Add an interest (e.g., Machine Learning, Design)"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleArrayAdd('interests', e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.target.previousSibling;
                            handleArrayAdd('interests', input.value);
                            input.value = '';
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Work Experience */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Work Experience
                        </label>
                        <button
                          type="button"
                          onClick={addExperience}
                          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Experience
                        </button>
                      </div>

                      <div className="space-y-4">
                        {formData.experience.map((exp) => (
                          <div key={exp.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between mb-3">
                              <h4 className="font-medium text-gray-900">
                                {exp.position || 'New Position'}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeExperience(exp.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="Company *"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <input
                                type="text"
                                placeholder="Position *"
                                value={exp.position}
                                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <input
                                type="text"
                                placeholder="Location"
                                value={exp.location}
                                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="month"
                                  placeholder="Start Date"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                  className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                  type="month"
                                  placeholder="End Date"
                                  value={exp.endDate}
                                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                  disabled={exp.current}
                                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={exp.current}
                                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">I currently work here</span>
                                </label>
                              </div>
                              <div className="md:col-span-2">
                                <textarea
                                  placeholder="Description"
                                  value={exp.description}
                                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                  rows="2"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Education
                        </label>
                        <button
                          type="button"
                          onClick={addEducation}
                          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Education
                        </button>
                      </div>

                      <div className="space-y-4">
                        {formData.education.map((edu) => (
                          <div key={edu.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between mb-3">
                              <h4 className="font-medium text-gray-900">
                                {edu.degree || 'New Education'}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeEducation(edu.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="Institution *"
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <input
                                type="text"
                                placeholder="Degree *"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <input
                                type="text"
                                placeholder="Field of Study"
                                value={edu.field}
                                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="number"
                                  placeholder="Start Year"
                                  value={edu.startYear}
                                  onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                                  className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                  type="number"
                                  placeholder="End Year"
                                  value={edu.endYear}
                                  onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                                  disabled={edu.current}
                                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  placeholder="Grade/GPA"
                                  value={edu.grade}
                                  onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                                  className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={edu.current}
                                    onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">I currently study here</span>
                                </label>
                              </div>
                              <div className="md:col-span-2">
                                <textarea
                                  placeholder="Activities and Societies"
                                  value={edu.activities}
                                  onChange={(e) => updateEducation(edu.id, 'activities', e.target.value)}
                                  rows="2"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Links Tab */}
                {activeTab === 'social' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">Social Links</h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Personal Website
                        </label>
                        <div className="relative">
                          <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="url"
                            name="social.website"
                            value={formData.social.website}
                            onChange={handleChange}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GitHub Profile
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                          <input
                            type="url"
                            name="social.github"
                            value={formData.social.github}
                            onChange={handleChange}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn Profile
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          <input
                            type="url"
                            name="social.linkedin"
                            value={formData.social.linkedin}
                            onChange={handleChange}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twitter Profile
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.553-12.566 9.05 9.05 0 002.21-2.297z" />
                          </svg>
                          <input
                            type="url"
                            name="social.twitter"
                            value={formData.social.twitter}
                            onChange={handleChange}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://twitter.com/username"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook Profile
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                          </svg>
                          <input
                            type="url"
                            name="social.facebook"
                            value={formData.social.facebook}
                            onChange={handleChange}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://facebook.com/username"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram Profile
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                          </svg>
                          <input
                            type="url"
                            name="social.instagram"
                            value={formData.social.instagram}
                            onChange={handleChange}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://instagram.com/username"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">User Preferences</h2>

                    {/* Notification Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive updates and alerts via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="notifications.email"
                              checked={formData.notifications.email}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="notifications.push"
                              checked={formData.notifications.push}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Course Updates</p>
                            <p className="text-sm text-gray-600">Get notified about course changes</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="notifications.courseUpdates"
                              checked={formData.notifications.courseUpdates}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Assignment Reminders</p>
                            <p className="text-sm text-gray-600">Get reminded about upcoming deadlines</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="notifications.assignmentReminders"
                              checked={formData.notifications.assignmentReminders}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Discussion Replies</p>
                            <p className="text-sm text-gray-600">Get notified when someone replies to you</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="notifications.discussionReplies"
                              checked={formData.notifications.discussionReplies}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Marketing Emails</p>
                            <p className="text-sm text-gray-600">Receive promotional content and offers</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="notifications.marketing"
                              checked={formData.notifications.marketing}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Visibility
                          </label>
                          <select
                            name="privacy.profileVisibility"
                            value={formData.privacy.profileVisibility}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="public">Public - Anyone can view profile</option>
                            <option value="private">Private - Only logged in users</option>
                            <option value="connections">Connections Only</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Show Online Status</p>
                            <p className="text-sm text-gray-600">Display when user is active on the platform</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="privacy.showOnlineStatus"
                              checked={formData.privacy.showOnlineStatus}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Show Email Address</p>
                            <p className="text-sm text-gray-600">Display email on public profile</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="privacy.showEmail"
                              checked={formData.privacy.showEmail}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Show Phone Number</p>
                            <p className="text-sm text-gray-600">Display phone number on public profile</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="privacy.showPhone"
                              checked={formData.privacy.showPhone}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Theme Preference */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            value="light"
                            className="sr-only peer"
                          />
                          <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50">
                            <div className="h-20 bg-white border border-gray-200 rounded-lg mb-2"></div>
                            <p className="text-sm font-medium text-center">Light Mode</p>
                          </div>
                        </label>

                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            value="dark"
                            className="sr-only peer"
                          />
                          <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50">
                            <div className="h-20 bg-gray-900 border border-gray-700 rounded-lg mb-2"></div>
                            <p className="text-sm font-medium text-center">Dark Mode</p>
                          </div>
                        </label>

                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            value="system"
                            className="sr-only peer"
                          />
                          <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50">
                            <div className="h-20 bg-gradient-to-r from-white to-gray-900 border border-gray-300 rounded-lg mb-2"></div>
                            <p className="text-sm font-medium text-center">System Default</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/admin-dashboard')}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create User'
                    )}
                  </button>
                </div>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAdd;