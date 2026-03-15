// pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiBriefcase,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
  FiEye,
  FiEyeOff,
  FiAward,
  FiSettings,
  FiShield,
  FiCreditCard,
  FiDownload,
  FiShare2,
  FiTrash2,
  FiPlus,
  FiExternalLink,
  FiCamera,
  FiLinkedin,
  FiTwitter,
  FiGithub,
  FiInstagram,
} from "react-icons/fi";
import {
  MdVerified,
  MdWork,
  MdSchool,
  MdLanguage,
  MdAdminPanelSettings,
  MdPerson,
  MdClass,
} from "react-icons/md";
import {
  FaYoutube,
  FaStackOverflow,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { Link } from "lucide-react";
import { NavLink } from "react-router-dom";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("student"); // 'student', 'instructor', 'admin'

  // Role-specific skills
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newSocialLink, setNewSocialLink] = useState({ platform: "", url: "" });

  const [profile, setProfile] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // console.log(profile?.avatar?.url);

  // Mock user data based on role
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    title: "",
    company: "",
    website: "",
    avatar: "",
    cover: "",
    joinDate: "",
    verified: false,
    role: "student",
    stats: {},
  });

  // console.log(user);

  useEffect(() => {
    if (!profile) return;

    setUser((prev) => ({
      ...prev,
      id: user._id,
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
      bio: user?.bio || "",
      title: user?.title || "",
      company: user?.company || "",
      website: user.website || "",
      avatar: user?.avatar || "",
      cover: user?.cover || "",
      role: user?.role || "student",
    }));

    setUserRole(profile?.role || "student");
    setSkills(profile?.skills || []);
    setExperience(profile?.experience || []);
    setEducation(profile?.education || []);
    setSocialLinks(profile?.socialLinks || []);
  }, [profile]);

  // console.log(user)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   const [user,setUser]=useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getUser = async () => {
      try {
        const userRes = await axios.get(
          "http://localhost:5000/api/auth/getMe",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        // console.log(userRes?.data.user)
        setProfile(userRes?.data?.user);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      getUser();
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: user,
  });

  useEffect(() => {
    if (!profile) return;

    reset({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      location: profile.location || "",
      bio: profile.bio || "",
      title: profile.title || "",
      company: profile.company || "",
      website: profile.website || "",
      avatar: profile.avatar || "",
      cover: profile.cover || "",
      role: profile.role || "student",
    });
  }, [profile, reset]);

  // Role-specific tabs configuration
  const getTabs = () => {
    const baseTabs = [
      { id: "personal", label: "Personal Info", icon: <FiUser /> },
      { id: "security", label: "Security", icon: <FiShield /> },
    ];

    if (userRole === "student") {
      return [
        ...baseTabs,
        // { id: "academics", label: "Academic Info", icon: <FiBookOpen /> },
        // { id: "education", label: "Education", icon: <MdSchool /> },
        { id: "social", label: "Social Links", icon: <FiShare2 /> },
        { id: "preferences", label: "Preferences", icon: <FiSettings /> },
      ];
    } else if (userRole === "instructor") {
      return [
        ...baseTabs,
        { id: "professional", label: "Professional", icon: <FiBriefcase /> },
        { id: "experience", label: "Experience", icon: <MdWork /> },
        // { id: "education", label: "Education", icon: <MdSchool /> },
        { id: "social", label: "Social Links", icon: <FiShare2 /> },
        { id: "preferences", label: "Preferences", icon: <FiSettings /> },
      ];
    } else {
      // admin
      return [
        ...baseTabs,
        {
          id: "admin",
          label: "Admin Settings",
          icon: <MdAdminPanelSettings />,
        },
        { id: "experience", label: "Experience", icon: <MdWork /> },
        { id: "education", label: "Education", icon: <MdSchool /> },
        { id: "preferences", label: "Preferences", icon: <FiSettings /> },
      ];
    }
  };

  const tabs = getTabs();

  // Handle form submission to update user profile text data
  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.put("http://localhost:5000/api/users/me", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(res?.data?.user);
      console.log(res?.data?.user);
      toast.success("Profile updated");
      setIsEditing(false);
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // password update  change
  const handleUpdatePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.put(
        "http://localhost:5000/api/auth/password",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success(res.data.message || "Password updated successfully");

      // Clear fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // 1️⃣ Preview immediately
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);

      // 2️⃣ Send to backend
      const formData = new FormData();
      formData.append("avatar", file); // must match multer field name

      const token = localStorage.getItem("token");
      console.log(file);
      const avatarRes = await axios.put(
        "http://localhost:5000/api/users/avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(avatarRes);
      setProfile(avatarRes?.data?.user);

      toast.success("Avatar updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update avatar");
    }
  };

  // Handle cover upload
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target.result);
        toast.success("Cover photo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      toast.success("Skill added!");
    }
  };

  // Remove skill
  const handleRemoveSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
    toast.success("Skill removed!");
  };

  // Add experience
  const handleAddExperience = () => {
    const newExp = {
      id: Date.now(),
      title: "",
      company: "",
      from: "",
      to: "",
      current: false,
    };
    setExperience([...experience, newExp]);
  };

  // Update experience
  const handleUpdateExperience = (id, field, value) => {
    setExperience((exp) =>
      exp.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  // Remove experience
  const handleRemoveExperience = (id) => {
    setExperience((exp) => exp.filter((item) => item.id !== id));
    toast.success("Experience removed!");
  };

  // Add education
  const handleAddEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: "",
      school: "",
      year: "",
    };
    setEducation([...education, newEdu]);
  };

  // Update education
  const handleUpdateEducation = (id, field, value) => {
    setEducation((edu) =>
      edu.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  // Remove education
  const handleRemoveEducation = (id) => {
    setEducation((edu) => edu.filter((item) => item.id !== id));
    toast.success("Education removed!");
  };

  // Add social link
  const handleAddSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      const iconMap = {
        linkedin: <FiLinkedin />,
        github: <FiGithub />,
        twitter: <FiTwitter />,
        instagram: <FiInstagram />,
        youtube: <FaYoutube />,
        stackoverflow: <FaStackOverflow />,
      };

      setSocialLinks([
        ...socialLinks,
        {
          ...newSocialLink,
          icon: iconMap[newSocialLink.platform] || <FiExternalLink />,
        },
      ]);
      setNewSocialLink({ platform: "", url: "" });
      toast.success("Social link added!");
    }
  };

  // Remove social link
  const handleRemoveSocialLink = (index) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
    toast.success("Social link removed!");
  };

  // Platform options for social links
  const platformOptions = [
    { value: "linkedin", label: "LinkedIn", icon: <FiLinkedin /> },
    { value: "github", label: "GitHub", icon: <FiGithub /> },
    { value: "twitter", label: "Twitter", icon: <FiTwitter /> },
    { value: "instagram", label: "Instagram", icon: <FiInstagram /> },
    { value: "youtube", label: "YouTube", icon: <FaYoutube /> },
    {
      value: "stackoverflow",
      label: "Stack Overflow",
      icon: <FaStackOverflow />,
    },
  ];

  // Reset form when editing is cancelled
  const handleCancelEdit = () => {
    reset(user);
    setIsEditing(false);
  };

  // Role badge component
  const RoleBadge = () => {
    const roleConfig = {
      student: {
        color: "bg-blue-100 text-blue-800",
        icon: <MdPerson />,
        label: "Student",
      },
      instructor: {
        color: "bg-purple-100 text-purple-800",
        icon: <FaChalkboardTeacher />,
        label: "Instructor",
      },
      admin: {
        color: "bg-red-100 text-red-800",
        icon: <MdAdminPanelSettings />,
        label: "Administrator",
      },
    };

    const config = roleConfig[userRole];
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${config.color}`}
      >
        {config.icon} <span className="ml-1">{config.label}</span>
      </span>
    );
  };

  // Role-specific stats display
  const renderStats = () => {
    if (userRole === "student") {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {user?.stats?.enrolledCourses || 0}
            </div>
            <div className="text-xs text-gray-600">Courses Enrolled</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {user?.stats?.completedCourses || 0}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {user?.stats?.averageGrade || 0}
            </div>
            <div className="text-xs text-gray-600">Avg. Grade</div>
          </div>
        </div>
      );
    } else if (userRole === "instructor") {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {user.stats.coursesCreated}
            </div>
            <div className="text-xs text-gray-600">Courses</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {user.stats.totalStudents?.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Students</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {user.stats.averageRating}
            </div>
            <div className="text-xs text-gray-600">Avg. Rating</div>
          </div>
        </div>
      );
    } else {
      // admin
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {user.stats.totalUsers?.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Users</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {user.stats.activeCourses}
            </div>
            <div className="text-xs text-gray-600">Active Courses</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {user.stats.platformUptime}
            </div>
            <div className="text-xs text-gray-600">Uptime</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold">Profile Settings</h1>
                <RoleBadge />
              </div>
              <p className="text-blue-100 mt-2">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center"
                  >
                    <FiX className="mr-2" /> Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" /> Save Changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                >
                  <FiEdit2 className="mr-2" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Cover Photo */}
              <div className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500">
                {coverPreview && (
                  <img
                    src={coverPreview || user.cover}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                )}
                <label className="absolute bottom-2 right-2 p-2 bg-white/90 rounded-lg cursor-pointer hover:bg-white transition-colors">
                  <FiCamera className="w-5 h-5 text-gray-700" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Avatar & Info */}
              <div className="px-6 pb-6 -mt-12 relative">
                <div className="relative inline-block">
                  <img
                    src={avatarPreview || profile?.avatar?.url}
                    alt={profile?.name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                  <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <FiCamera className="w-4 h-4 text-gray-700" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      {profile?.name}
                    </h2>
                    {
                      // user.verified
                      true && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center">
                          <MdVerified className="mr-1" /> Verified
                        </span>
                      )
                    }
                  </div>
                  <p className="text-gray-600 mt-1">
                    {user?.title || "software engineer"}{" "}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{user.company}</p>

                  {/* Role-specific Stats */}
                  {renderStats()}

                  {/* Join Date */}
                  <div className="mt-4 text-center text-sm text-gray-500">
                    <FiCalendar className="inline mr-1" />
                    Member since{" "}
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : ""}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <FiAward className="mr-2" />
                {userRole === "student"
                  ? "Skills & Interests"
                  : userRole === "instructor"
                    ? "Expertise Areas"
                    : "Administrative Skills"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center group"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="ml-2 text-blue-400 hover:text-blue-600"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="mt-4 flex">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder={
                      userRole === "student"
                        ? "Add skill or interest"
                        : "Add expertise"
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                  >
                    <FiPlus />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
              <div className="flex flex-wrap border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Personal Info Tab (Common for all roles) */}
                {activeTab === "personal" && (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiUser className="inline mr-2" />
                          Full Name *
                        </label>
                        <input
                          {...register("name", {
                            required: "Name is required",
                          })}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            isEditing ? "bg-white" : "bg-gray-50"
                          } ${errors.name ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiMail className="inline mr-2" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          readOnly
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          className={`w-full px-4 py-3 border rounded-lg bg-gray-50 cursor-not-allowed
    focus:ring-0 focus:border-gray-300
    ${errors.email ? "border-red-500" : "border-gray-300"}`}
                        />

                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiPhone className="inline mr-2" />
                          Phone Number
                        </label>
                        <input
                          {...register("phone")}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            isEditing ? "bg-white" : "bg-gray-50"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiMapPin className="inline mr-2" />
                          Location
                        </label>
                        <input
                          {...register("location")}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            isEditing ? "bg-white" : "bg-gray-50"
                          }`}
                        />
                      </div>
                    </div>

                    {userRole !== "student" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiBriefcase className="inline mr-2" />
                          {userRole === "instructor"
                            ? "Professional Title"
                            : "Administrative Title"}
                        </label>
                        <input
                          {...register("title")}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            isEditing ? "bg-white" : "bg-gray-50"
                          }`}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiGlobe className="inline mr-2" />
                        Personal Website/Portfolio
                      </label>
                      <input
                        onChange={handleChange}
                        {...register("website")}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isEditing ? "bg-white" : "bg-gray-50"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio / About Me
                      </label>
                      <textarea
                        {...register("bio")}
                        disabled={!isEditing}
                        rows="4"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isEditing ? "bg-white" : "bg-gray-50"
                        }`}
                        placeholder={
                          userRole === "student"
                            ? "Tell us about your academic interests, projects, and career goals..."
                            : userRole === "instructor"
                              ? "Share your professional background, teaching philosophy, and expertise..."
                              : "Describe your administrative experience and platform management approach..."
                        }
                      />
                    </div>
                  </form>
                )}

                {/* Security Tab (Common for all roles) */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    {/* password change start  */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdatePassword();
                      }}
                      className="space-y-6"
                    >
                      <h3 className="font-medium text-gray-900 mb-4">
                        Change Password
                      </h3>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              name="currentPassword"
                              type={showPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              autoComplete="current-password"
                            />
                            <button
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              type={showPassword ? "text" : "password"}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              autoComplete="new-password"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              type={showPassword ? "text" : "password"}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              autoComplete="new-password"
                            />
                          </div>

                          <NavLink
                            to="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Forgot password?
                          </NavLink>
                        </div>
                        <button
                          onClick={handleUpdatePassword}
                          disabled={loading}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                        >
                          {loading ? "Updating..." : "Update Password"}
                        </button>
                      </div>
                    </form>
                    {/* password change end  */}

                    {/* two factor authentication  start */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-medium text-gray-900 mb-4">
                        Two-Factor Authentication
                      </h3>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            2FA Status
                          </p>
                          <p className="text-sm text-gray-600">
                            Add an extra layer of security
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                          Enable
                        </button>
                      </div>
                    </div>
                    {/* two factor authentication  end*/}
                  </div>
                )}

                {/* Academics Tab (Student Only) */}
                {/* {activeTab === "academics" && userRole === "student" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Student ID
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg ${
                            isEditing ? "bg-white" : "bg-gray-50"
                          }`}
                          placeholder="STU-2023-001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Graduation
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg ${
                            isEditing ? "bg-white" : "bg-gray-50"
                          }`}
                          placeholder="2024"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GPA
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg ${
                            isEditing ? "bg-white" : "bg-gray-50"
                          }`}
                          placeholder="3.8"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Academic Standing
                        </label>
                        <select
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg ${
                            isEditing ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <option>Good Standing</option>
                          <option>Probation</option>
                          <option>Honors</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Academic Interests
                      </label>
                      <textarea
                        disabled={!isEditing}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? "bg-white" : "bg-gray-50"
                        }`}
                        placeholder="List your academic interests, research areas, or specialization..."
                      />
                    </div>
                  </div>
                )} */}

                {/* Professional Tab (Instructor Only) */}
                {activeTab === "professional" && userRole === "instructor" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instructor ID
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg ${
                            isEditing ? "bg-white" : "bg-gray-50"
                          }`}
                          placeholder="INST-001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hourly Rate
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            disabled={!isEditing}
                            className={`w-full pl-8 pr-4 py-3 border rounded-lg ${
                              isEditing ? "bg-white" : "bg-gray-50"
                            }`}
                            placeholder="50"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teaching Philosophy
                        </label>
                        <textarea
                          disabled={!isEditing}
                          rows="4"
                          className={`w-full px-4 py-3 border rounded-lg ${
                            isEditing ? "bg-white" : "bg-gray-50"
                          }`}
                          placeholder="Describe your teaching approach and methodology..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Certifications
                      </label>
                      <textarea
                        disabled={!isEditing}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? "bg-white" : "bg-gray-50"
                        }`}
                        placeholder="List your professional certifications..."
                      />
                    </div>
                  </div>
                )}

                {/* Admin Tab (Admin Only) */}
                {activeTab === "admin" && userRole === "admin" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin ID
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg ${
                            isEditing ? "bg-white" : "bg-gray-50"
                          }`}
                          placeholder="ADM-001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Level
                        </label>
                        <select
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg ${
                            isEditing ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <option>Super Admin</option>
                          <option>Content Admin</option>
                          <option>Support Admin</option>
                          <option>Moderator</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Permissions
                        </label>
                        <div className="space-y-2">
                          {[
                            "User Management",
                            "Content Moderation",
                            "Course Approval",
                            "Payment Processing",
                            "System Configuration",
                            "Analytics Access",
                          ].map((permission, index) => (
                            <label
                              key={index}
                              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                            >
                              <input
                                type="checkbox"
                                disabled={!isEditing}
                                defaultChecked={index < 3}
                                className="rounded"
                              />
                              <span className="text-gray-700">
                                {permission}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Notes
                      </label>
                      <textarea
                        disabled={!isEditing}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? "bg-white" : "bg-gray-50"
                        }`}
                        placeholder="Internal notes or remarks..."
                      />
                    </div>
                  </div>
                )}

                {/* Experience Tab (Instructor & Admin) */}
                {activeTab === "experience" &&
                  (userRole === "instructor" || userRole === "admin") && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {experience.map((exp) => (
                          <div
                            key={exp.id}
                            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                          >
                            {isEditing ? (
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <input
                                    value={exp.title}
                                    onChange={(e) =>
                                      handleUpdateExperience(
                                        exp.id,
                                        "title",
                                        e.target.value,
                                      )
                                    }
                                    placeholder={
                                      userRole === "instructor"
                                        ? "Job Title"
                                        : "Position"
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                  />
                                  <input
                                    value={exp.company}
                                    onChange={(e) =>
                                      handleUpdateExperience(
                                        exp.id,
                                        "company",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Company/Organization"
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                  />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <input
                                    value={exp.from}
                                    onChange={(e) =>
                                      handleUpdateExperience(
                                        exp.id,
                                        "from",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="From (Year)"
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                  />
                                  <input
                                    value={exp.to}
                                    onChange={(e) =>
                                      handleUpdateExperience(
                                        exp.id,
                                        "to",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="To (Year)"
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                    disabled={exp.current}
                                  />
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={exp.current}
                                      onChange={(e) =>
                                        handleUpdateExperience(
                                          exp.id,
                                          "current",
                                          e.target.checked,
                                        )
                                      }
                                      className="rounded"
                                    />
                                    <span className="text-sm text-gray-600">
                                      Current Position
                                    </span>
                                  </label>
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    onClick={() =>
                                      handleRemoveExperience(exp.id)
                                    }
                                    className="px-3 py-1 text-red-600 hover:text-red-800"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {exp.title}
                                  </h4>
                                  <p className="text-gray-600">{exp.company}</p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {exp.from} -{" "}
                                    {exp.current ? "Present" : exp.to}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {isEditing && (
                        <button
                          onClick={handleAddExperience}
                          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center"
                        >
                          <FiPlus className="mr-2" /> Add Experience
                        </button>
                      )}
                    </div>
                  )}

                {/* Education Tab (All roles) */}
                {/* {activeTab === "education" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {education.map((edu) => (
                        <div
                          key={edu.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                        >
                          {isEditing ? (
                            <div className="space-y-3">
                              <input
                                value={edu.degree}
                                onChange={(e) =>
                                  handleUpdateEducation(
                                    edu.id,
                                    "degree",
                                    e.target.value,
                                  )
                                }
                                placeholder="Degree/Program"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                  value={edu.school}
                                  onChange={(e) =>
                                    handleUpdateEducation(
                                      edu.id,
                                      "school",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="School/University"
                                  className="px-3 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                  value={edu.year}
                                  onChange={(e) =>
                                    handleUpdateEducation(
                                      edu.id,
                                      "year",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Year"
                                  className="px-3 py-2 border border-gray-300 rounded-lg"
                                />
                              </div>
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleRemoveEducation(edu.id)}
                                  className="px-3 py-1 text-red-600 hover:text-red-800"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {edu.degree}
                                </h4>
                                <p className="text-gray-600">{edu.school}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Graduated {edu.year}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {isEditing && (
                      <button
                        onClick={handleAddEducation}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center"
                      >
                        <FiPlus className="mr-2" /> Add Education
                      </button>
                    )}
                  </div>
                )} */}

                {/* Social Links Tab (Student & Instructor) */}
                {activeTab === "social" &&
                  (userRole === "student" || userRole === "instructor") && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {socialLinks.map((link, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-xl text-gray-500">
                                {link.icon}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900 capitalize">
                                  {link.platform}
                                </p>
                                <p className="text-sm text-gray-600 truncate max-w-xs">
                                  {link.url}
                                </p>
                              </div>
                            </div>
                            {isEditing && (
                              <button
                                onClick={() => handleRemoveSocialLink(index)}
                                className="p-2 text-red-600 hover:text-red-800"
                              >
                                <FiTrash2 />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {isEditing && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                          <h4 className="font-medium text-gray-900 mb-4">
                            Add Social Link
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Platform
                              </label>
                              <select
                                value={newSocialLink.platform}
                                onChange={(e) =>
                                  setNewSocialLink({
                                    ...newSocialLink,
                                    platform: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Platform</option>
                                {platformOptions.map((platform) => (
                                  <option
                                    key={platform.value}
                                    value={platform.value}
                                  >
                                    {platform.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile URL
                              </label>
                              <input
                                type="url"
                                value={newSocialLink.url}
                                onChange={(e) =>
                                  setNewSocialLink({
                                    ...newSocialLink,
                                    url: e.target.value,
                                  })
                                }
                                placeholder="https://"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <button
                              onClick={handleAddSocialLink}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Add Link
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {/* Preferences Tab (All roles) */}
                {activeTab === "preferences" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">
                        Notification Preferences
                      </h3>
                      <div className="space-y-3">
                        {userRole === "student"
                          ? [
                              {
                                label: "Course announcements",
                                desc: "Updates from your enrolled courses",
                              },
                              {
                                label: "Assignment reminders",
                                desc: "Deadline notifications for assignments",
                              },
                              {
                                label: "Grade updates",
                                desc: "When grades are posted",
                              },
                              {
                                label: "Forum activity",
                                desc: "Replies to your forum posts",
                              },
                            ]
                          : userRole === "instructor"
                            ? [
                                {
                                  label: "Student inquiries",
                                  desc: "Questions from students in your courses",
                                },
                                {
                                  label: "Assignment submissions",
                                  desc: "When students submit assignments",
                                },
                                {
                                  label: "Course reviews",
                                  desc: "New course reviews and ratings",
                                },
                                {
                                  label: "Revenue updates",
                                  desc: "Earnings and payment notifications",
                                },
                              ]
                            : [
                                {
                                  label: "System alerts",
                                  desc: "Critical system notifications",
                                },
                                {
                                  label: "User reports",
                                  desc: "Reports from users",
                                },
                                {
                                  label: "Payment issues",
                                  desc: "Payment processing problems",
                                },
                                {
                                  label: "Security alerts",
                                  desc: "Security-related notifications",
                                },
                              ].map((pref, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {pref.label}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {pref.desc}
                                    </p>
                                  </div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="sr-only peer"
                                      defaultChecked
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  </label>
                                </div>
                              ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-medium text-gray-900 mb-4">
                        Language & Region
                      </h3>
                      <div className="max-w-md">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MdLanguage className="inline mr-2" />
                          Preferred Language
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                          <option>English</option>
                          <option>Hindi</option>

                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Role-specific Danger Zone */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200">
              <h3 className="font-bold text-red-700 mb-4">Danger Zone</h3>
              <div className="space-y-4">
                {userRole === "student" && (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-700">
                        Request Transcript
                      </p>
                      <p className="text-sm text-yellow-600">
                        Download your academic transcript
                      </p>
                    </div>
                    <button className="mt-2 sm:mt-0 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center">
                      <FiDownload className="mr-2" /> Request Transcript
                    </button>
                  </div>
                )}

                {userRole === "instructor" && (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-700">
                        Payment Settings
                      </p>
                      <p className="text-sm text-blue-600">
                        Update your payment and payout information
                      </p>
                    </div>
                    <button className="mt-2 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                      <FiCreditCard className="mr-2" /> Payment Settings
                    </button>
                  </div>
                )}

                {userRole === "admin" && (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-700">
                        System Backup
                      </p>
                      <p className="text-sm text-purple-600">
                        Create a complete system backup
                      </p>
                    </div>
                    <button className="mt-2 sm:mt-0 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                      <FiDownload className="mr-2" /> Backup System
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-700">Delete Account</p>
                    <p className="text-sm text-red-600">
                      Once deleted, your account cannot be recovered
                    </p>
                  </div>
                  <button className="mt-2 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Export Data</p>
                    <p className="text-sm text-gray-600">
                      Download all your personal data
                    </p>
                  </div>
                  <button className="mt-2 sm:mt-0 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center">
                    <FiDownload className="mr-2" /> Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
