import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  PencilIcon,
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
  CakeIcon,
  LinkIcon,
  TagIcon,
  SparklesIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isAvatarloding, setIsAvatarLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    email: "",
    phone: "",
    role: "student",
    status: "active",
    verified: true,
    bio: "",
    location: "",
    timezone: "UTC-8",
    language: "Hindi",

    // Professional Information
    skills: [],
    interests: [],

    // Social Links
    social: {
      website: "",
      github: "",
      linkedin: "",
      twitter: "",
    },

    // Experience
    experience: [],

    // Education
    education: [],

    // Security
    security: {
      twoFactorEnabled: false,
      password: "",
      confirmPassword: "",
    },

    // Notifications
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },

    // Privacy
    privacy: {
      profileVisibility: "public",
      showOnlineStatus: true,
    },

    // Avatar and Cover
    avatar: null,
    coverPhoto: null,
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admin/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        // setUser(res.data.data);
        console.log(res?.data?.user);
        setFormData(res?.data?.user);
        setIsLoading(false);
      } catch (err) {
        // setError(
        //   err.response?.data?.message || "Failed to fetch user"
        // );
      } finally {
        // setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Mock data fetch - in real app, this would be an API call
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockUserData = {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "+1 (555) 123-4567",
        role: "student",
        status: "active",
        verified: true,
        bio: "Passionate learner focused on web development and data science. Currently mastering React, Python, and machine learning.",
        location: "San Francisco, CA",
        timezone: "UTC-8",
        language: "English",
        skills: [
          "React",
          "Node.js",
          "Python",
          "JavaScript",
          "TypeScript",
          "GraphQL",
        ],
        interests: ["Web Development", "Machine Learning", "Open Source"],
        social: {
          website: "https://alexjohnson.dev",
          github: "https://github.com/alexjohnson",
          linkedin: "https://linkedin.com/in/alexjohnson",
          twitter: "https://twitter.com/alexjohnson",
        },
        experience: [
          {
            id: 1,
            company: "TechCorp",
            position: "Senior Frontend Engineer",
            period: "2020-Present",
            description: "Leading React development team",
            current: true,
          },
          {
            id: 2,
            company: "StartupXYZ",
            position: "Frontend Developer",
            period: "2018-2020",
            description: "Built responsive web applications",
            current: false,
          },
        ],
        education: [
          {
            id: 1,
            institution: "Stanford University",
            degree: "M.S. Computer Science",
            year: "2018-2020",
            gpa: "3.9",
          },
          {
            id: 2,
            institution: "UC Berkeley",
            degree: "B.S. Computer Science",
            year: "2014-2018",
            gpa: "3.8",
          },
        ],
        security: {
          twoFactorEnabled: true,
          password: "",
          confirmPassword: "",
        },
        notifications: {
          email: true,
          push: true,
          marketing: false,
        },
        privacy: {
          profileVisibility: "public",
          showOnlineStatus: true,
        },
      };

      // setFormData(mockUserData);
      // setIsLoading(false);
    }, 1000);
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name.includes(".")) {
      // Handle nested objects (e.g., social.website)
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle array fields (skills, interests)
  const handleArrayAdd = (field, value) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const handleArrayRemove = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Handle experience
  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          company: "",
          position: "",
          period: "",
          description: "",
          current: false,
        },
      ],
    }));
  };

  const updateExperience = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    }));
  };

  const removeExperience = (id) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  // Handle education
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          institution: "",
          degree: "",
          year: "",
          gpa: "",
        },
      ],
    }));
  };

  const updateEducation = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu,
      ),
    }));
  };

  const removeEducation = (id) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  // // Handle file uploads
  // const handleAvatarChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     if (file.size > 5 * 1024 * 1024) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         avatar: "File size should be less than 5MB",
  //       }));
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       setAvatarPreview(event.target.result);
  //       setFormData((prev) => ({ ...prev, avatar: file }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleAvatarUpload = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) {
        alert("Please select a file");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      const formData = new FormData();
      formData.append("avatar", file);
      setIsAvatarLoading(true);
      const res = await axios.put(
        `http://localhost:5000/api/admin/users/avatar/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      alert("Avatar updated successfully");
      console.log(res);
      // console.log(res.data.user.avatar.url)
      setIsAvatarLoading(false);
      // setFormData((prev) => ({ ...prev, avatar: res?.data?.user?.avatar }));
      navigate(`/user/edit/${id}`);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Upload failed");
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          coverPhoto: "File size should be less than 10MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverPreview(event.target.result);
        setFormData((prev) => ({ ...prev, coverPhoto: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (formData.security.password && formData.security.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.security.password !== formData.security.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // update api
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/users/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      console.log(formData);
      console.log(res.data);

      if (res.data.success) {
        alert("User updated successfully");
        navigate(`/user/edit/${id}`);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update user");
    }
  };

  // Role options
  const roles = [
    { value: "student", label: "Student", icon: UserIcon, color: "blue" },
    {
      value: "instructor",
      label: "Instructor",
      icon: AcademicCapIcon,
      color: "green",
    },
    {
      value: "admin",
      label: "Administrator",
      icon: ShieldCheckIcon,
      color: "purple",
    },
  ];

  // Status options
  const statuses = [
    { value: "active", label: "Active", color: "green" },
    { value: "inactive", label: "Inactive", color: "gray" },
    { value: "suspended", label: "Suspended", color: "red" },
    { value: "pending", label: "Pending Verification", color: "yellow" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/admin-dashboard`)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
                <p className="text-sm text-gray-500">
                  Update user information and settings
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/admin-dashboard`)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
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
                <p className="text-green-700">
                  User information updated successfully!
                </p>
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
                <p className="text-red-700">
                  Please fix the validation errors.
                </p>
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Edit Sections
              </h3>

              <nav className="space-y-2">
                {[
                  { id: "basic", label: "Basic Information", icon: UserIcon },
                  {
                    id: "professional",
                    label: "Professional",
                    icon: BriefcaseIcon,
                  },
                  { id: "social", label: "Social Links", icon: GlobeAltIcon },
                  { id: "security", label: "Security", icon: LockClosedIcon },
                  {
                    id: "notifications",
                    label: "Notifications",
                    icon: Cog6ToothIcon,
                  },
                  { id: "privacy", label: "Privacy", icon: ShieldCheckIcon },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">User ID</span>
                    <span className="font-mono text-gray-900">{id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined</span>
                    <span className="text-gray-900">Jan 15, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Active</span>
                    <span className="text-gray-900">2 hours ago</span>
                  </div>
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
                {activeTab === "basic" && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Basic Information
                    </h2>

                    {/* Avatar and Cover Photo */}

                    <div className="space-y-6">
                      {/* Cover Photo */}
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cover Photo
                        </label>
                        <div className="relative h-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl overflow-hidden">
                          {(coverPreview || formData.coverPhoto) && (
                            <img
                              src={coverPreview || formData.coverPhoto}
                              alt="Cover"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <label className="cursor-pointer">
                              <div className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 flex items-center">
                                <CameraIcon className="h-5 w-5 mr-2" />
                                Change Cover
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
                      </div> */}

                      {/* Avatar */}
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden border-4 border-white shadow-lg">
                            {avatarPreview || formData?.avatar?.url ? (
                              <img
                                src={avatarPreview || formData?.avatar?.url}
                                alt="Avatar"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-white text-3xl font-bold">
                                {formData.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <label className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100">
                            <CameraIcon className="h-4 w-4 text-gray-600" />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                            />
                          </label>
                        </div>
                        <div className="ml-6">
                          <p className="text-sm text-gray-500">Profile Photo</p>
                          <p className="text-xs text-gray-400 mt-1">
                            JPG, PNG, GIF up to 5MB
                          </p>

                          {isAvatarloding && (
                            <div className="flex gap-1 items-center">
                         
                                <div className="w-4 h-4 border-2 border-[grey] border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[grey]">Uploading...</span>
                            </div>
                       
                          )}



                        </div>
                      </div>
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
                            className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.name ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.name}
                          </p>
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
                            value={formData?.email}
                            onChange={handleChange}
                            className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.email
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                          </p>
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
                            className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.phone
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phone}
                          </p>
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
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Role and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User Role
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {roles.map((role) => (
                            <label
                              key={role.value}
                              className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                formData.role === role.value
                                  ? `border-${role.color}-500 bg-${role.color}-50`
                                  : "border-gray-200 hover:border-gray-300"
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
                              <role.icon
                                className={`h-6 w-6 mb-1 ${
                                  formData.role === role.value
                                    ? `text-${role.color}-600`
                                    : "text-gray-500"
                                }`}
                              />
                              <span
                                className={`text-sm font-medium ${
                                  formData.role === role.value
                                    ? `text-${role.color}-700`
                                    : "text-gray-700"
                                }`}
                              >
                                {role.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {statuses.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Verification Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Email Verification
                        </p>
                        <p className="text-sm text-gray-600">
                          User email has been verified
                        </p>
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

                    {/* Timezone and Language */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="UTC-8">Pacific Time (UTC-8)</option>
                          <option value="UTC-5">Eastern Time (UTC-5)</option>
                          <option value="UTC+0">UTC</option>
                          <option value="UTC+1">Central European Time (UTC+1)</option>
                        </select>
                      </div> */}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Hindi">Hindi</option>
                          <option value="English">English</option>
                          <option value="Gujarati">Gujarati</option>
                          <option value="Awadi">Awadi</option>
                          <option value="Marathi">Marathi</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Professional Information Tab */}
                {activeTab === "professional" && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Professional Information
                    </h2>

                    {/* Skills */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills & Expertise
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleArrayRemove("skills", index)}
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
                          placeholder="Add a skill (press Enter)"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleArrayAdd("skills", e.target.value);
                              e.target.value = "";
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.target.previousSibling;
                            handleArrayAdd("skills", input.value);
                            input.value = "";
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
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                          >
                            {interest}
                            <button
                              type="button"
                              onClick={() =>
                                handleArrayRemove("interests", index)
                              }
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
                          placeholder="Add an interest (press Enter)"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleArrayAdd("interests", e.target.value);
                              e.target.value = "";
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.target.previousSibling;
                            handleArrayAdd("interests", input.value);
                            input.value = "";
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
                          <div
                            key={exp.id}
                            className="p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex justify-between mb-3">
                              <h4 className="font-medium text-gray-900">
                                {exp.position || "New Position"}
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
                                placeholder="Company"
                                value={exp.company}
                                onChange={(e) =>
                                  updateExperience(
                                    exp.id,
                                    "company",
                                    e.target.value,
                                  )
                                }
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <input
                                type="text"
                                placeholder="Position"
                                value={exp.position}
                                onChange={(e) =>
                                  updateExperience(
                                    exp.id,
                                    "position",
                                    e.target.value,
                                  )
                                }
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <input
                                type="text"
                                placeholder="Period (e.g., 2020-Present)"
                                value={exp.period}
                                onChange={(e) =>
                                  updateExperience(
                                    exp.id,
                                    "period",
                                    e.target.value,
                                  )
                                }
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <div className="flex items-center">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={exp.current}
                                    onChange={(e) =>
                                      updateExperience(
                                        exp.id,
                                        "current",
                                        e.target.checked,
                                      )
                                    }
                                    className="h-4 w-4 text-blue-600 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Current Position
                                  </span>
                                </label>
                              </div>
                              <div className="md:col-span-2">
                                <textarea
                                  placeholder="Description"
                                  value={exp.description}
                                  onChange={(e) =>
                                    updateExperience(
                                      exp.id,
                                      "description",
                                      e.target.value,
                                    )
                                  }
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
                          <div
                            key={edu.id}
                            className="p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex justify-between mb-3">
                              <h4 className="font-medium text-gray-900">
                                {edu.degree || "New Education"}
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
                                placeholder="Institution"
                                value={edu.institution}
                                onChange={(e) =>
                                  updateEducation(
                                    edu.id,
                                    "institution",
                                    e.target.value,
                                  )
                                }
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <input
                                type="text"
                                placeholder="Degree"
                                value={edu.degree}
                                onChange={(e) =>
                                  updateEducation(
                                    edu.id,
                                    "degree",
                                    e.target.value,
                                  )
                                }
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <input
                                type="text"
                                placeholder="Year (e.g., 2018-2020)"
                                value={edu.year}
                                onChange={(e) =>
                                  updateEducation(
                                    edu.id,
                                    "year",
                                    e.target.value,
                                  )
                                }
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              <input
                                type="text"
                                placeholder="GPA"
                                value={edu.gpa}
                                onChange={(e) =>
                                  updateEducation(edu.id, "gpa", e.target.value)
                                }
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Links Tab */}
                {activeTab === "social" && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Social Links
                    </h2>

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
                          <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                          <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                          <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Security Settings
                    </h2>

                    {/* Change Password */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="password"
                            name="security.password"
                            value={formData.security.password}
                            onChange={handleChange}
                            className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.password
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="password"
                            name="security.confirmPassword"
                            value={formData.security.confirmPassword}
                            onChange={handleChange}
                            className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.confirmPassword
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-gray-600">
                          Add extra layer of security to the account
                        </p>
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

                    {/* Force Logout */}
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Force Logout
                          </p>
                          <p className="text-sm text-gray-600">
                            Sign out from all devices
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                          Force Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Notification Settings
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            Email Notifications
                          </p>
                          <p className="text-sm text-gray-600">
                            Receive updates and alerts via email
                          </p>
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
                          <p className="font-medium text-gray-900">
                            Push Notifications
                          </p>
                          <p className="text-sm text-gray-600">
                            Receive push notifications in browser
                          </p>
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
                          <p className="font-medium text-gray-900">
                            Marketing Emails
                          </p>
                          <p className="text-sm text-gray-600">
                            Receive promotional content and offers
                          </p>
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
                )}

                {/* Privacy Tab */}
                {activeTab === "privacy" && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Privacy Settings
                    </h2>

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
                        <option value="public">
                          Public - Anyone can view profile
                        </option>
                        <option value="private">
                          Private - Only logged in users
                        </option>
                        <option value="connections">Connections Only</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Show Online Status
                        </p>
                        <p className="text-sm text-gray-600">
                          Display when user is active on the platform
                        </p>
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
                  </div>
                )}

                {/* Form Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin-dashboard`)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
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

// Add missing XMarkIcon import
const XMarkIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default UserEdit;
