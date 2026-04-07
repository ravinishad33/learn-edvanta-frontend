import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Calendar,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  Shield,
  Camera,
  Linkedin,
  Github,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profile, setProfile] = useState(null);

  const role = useSelector((state) => state?.auth?.user?.role);
  const [userRole, setUserRole] = useState(role);

  const apiUrl = import.meta.env.VITE_API_URL;

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const linkedin = watch("linkedin");
  const github = watch("github");

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const getUser = async () => {
      try {
        const userRes = await axios.get(
          `${apiUrl}/api/auth/getMe`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setProfile(userRes?.data?.user);
        setUserRole(userRes?.data?.user?.role);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      }
    };

    if (token) getUser();
  }, []);

  // Reset form when profile loads
  useEffect(() => {
    if (!profile) return;
    reset({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      location: profile.location || "",
      bio: profile.bio || "",
      website: profile.website || "",
      linkedin: profile.linkedin || "",
      github: profile.github || "",
    });
  }, [profile, reset]);

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const token = localStorage.getItem("token");

      const toastId = toast.loading("Uploading avatar...");
      setUploadingAvatar(true);

      const avatarRes = await axios.put(
        `${apiUrl}/api/users/avatar`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setProfile(avatarRes?.data?.user);
      toast.success("Avatar updated!", { id: toastId });
      dispatch(loginSuccess({ user: avatarRes?.data?.user, token }));
    } catch (error) {
      toast.error("Failed to update avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Update profile
  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    const toastId = toast.loading("Saving changes...");

    try {
      const res = await axios.put(`${apiUrl}/api/users/me`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(res?.data?.user);
      toast.success("Profile updated!", { id: toastId });
      dispatch(loginSuccess({ user: res?.data?.user, token }));
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update password
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
      const toastId = toast.loading("Updating password...");
      setLoading(true);

      const res = await axios.put(
        `${apiUrl}/api/auth/password`,
        passwordData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      toast.success(res.data.message || "Password updated!", { id: toastId });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  // handle delete user
  const deleteUser = async (userId) => {
    const toastId = toast.loading("Deleting your account...");
    try {
      const res = await axios.delete(`${apiUrl}/api/users/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success(res.data.message || "User deleted successfully", {
        id: toastId,
      });

      setProfile(null);

      // logout + redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting user", {
        id: toastId,
      });
    }
  };

  // Get role-based tabs
  const getTabs = () => {
    const baseTabs = [
      { id: "personal", label: "Personal Info", icon: User },
      { id: "security", label: "Security", icon: Shield },
    ];

    if (userRole === "student" || userRole === "instructor") {
      return [
        ...baseTabs,
        { id: "social", label: "Social Links", icon: Globe },
      ];
    }
    return baseTabs;
  };

  const tabs = getTabs();

  // Role badge config (Lavender theme adjusted)
  const roleConfig = {
    student: {
      color: "bg-[#FAF7FF] text-[#7A589B] border-[#E6E6FA]",
      label: "Student",
    },
    instructor: {
      color: "bg-[#F4EFFF] text-[#5E4B8A] border-[#D8BFD8]",
      label: "Instructor",
    },
    admin: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      label: "Administrator",
    },
  };

  const currentRole = roleConfig[userRole] || roleConfig.student;

  if (!profile) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#FAF7FF] via-white to-[#E6E6FA] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#B19CD9] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#FAF7FF] via-white to-[#E6E6FA] font-sans pb-12">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Profile Settings
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold border shadow-sm ${currentRole.color}`}
                >
                  {currentRole.label}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-500 font-medium">
                Manage your account settings and preferences
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 md:flex-none px-4 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-bold flex items-center justify-center gap-2"
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-[#B19CD9] to-[#967BB6] text-white rounded-xl hover:from-[#A685E2] hover:to-[#8A63A6] shadow-lg shadow-[#B19CD9]/30 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-[#B19CD9] to-[#967BB6] text-white rounded-xl hover:from-[#A685E2] hover:to-[#8A63A6] shadow-lg shadow-[#B19CD9]/30 transition-all font-bold flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile Card */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-[#E6E6FA]/60 border border-white overflow-hidden"
            >
              {/* Cover */}
              <div className="h-32 sm:h-40 bg-gradient-to-r from-[#B19CD9] to-[#7A589B]"></div>

              {/* Avatar & Info */}
              <div className="px-6 pb-6 sm:pb-8 -mt-12 sm:-mt-16 relative text-center sm:text-left flex flex-col sm:block items-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white p-1.5 shadow-xl shadow-[#B19CD9]/20">
                    <img
                      src={
                        profile?.avatar?.url ||
                        `https://api.dicebear.com/9.x/notionists/svg?seed=${profile?.name}`
                      }
                      alt={profile?.name}
                      className="w-full h-full rounded-xl object-cover bg-gray-50"
                    />
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-2 sm:p-2.5 bg-[#967BB6] text-white rounded-xl shadow-lg cursor-pointer hover:bg-[#7A589B] transition-colors hover:scale-105 transform duration-200">
                    <Camera size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="mt-4 sm:mt-5 w-full">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                    {profile?.name}
                  </h2>
                  <p className="text-[#7A589B] text-sm font-medium mt-1">{profile?.email}</p>

                  {profile?.bio && (
                    <p className="text-gray-600 text-sm mt-3 sm:mt-4 leading-relaxed line-clamp-3">
                      {profile?.bio}
                    </p>
                  )}

                  <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap justify-center sm:justify-start items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
                    <Calendar size={16} className="text-[#B19CD9]" />
                    <span>
                      Joined{" "}
                      {new Date(profile?.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" },
                      )}
                    </span>
                  </div>

                  {profile?.isVerified && (
                    <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-50 border border-green-100 text-green-700 rounded-xl text-xs sm:text-sm font-bold shadow-sm">
                      <CheckCircle size={16} className="text-green-500" />
                      Verified Account
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-[#E6E6FA]/60 border border-white p-6 sm:p-8"
            >
              <h3 className="font-extrabold text-gray-900 mb-5 sm:mb-6 text-lg">
                Account Overview
              </h3>
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7FF] border border-[#E6E6FA]">
                  <div className="flex items-center gap-3 text-gray-600">
                    <BookOpen size={18} className="text-[#967BB6]" />
                    <span className="text-sm font-semibold">Role</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#5E4B8A] capitalize">
                    {userRole}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Shield size={18} className="text-[#967BB6]" />
                    <span className="text-sm font-semibold">Status</span>
                  </div>
                  <span className="text-sm font-extrabold text-green-600">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock size={18} className="text-[#967BB6]" />
                    <span className="text-sm font-semibold">Member Since</span>
                  </div>
                  <span className="text-sm font-extrabold text-gray-900">
                    {new Date(profile?.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            
            {/* Tabs */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-[#E6E6FA]/60 border border-white overflow-hidden mb-6">
              <div className="border-b border-gray-100 overflow-x-auto no-scrollbar">
                <nav className="flex min-w-max">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-5 text-sm sm:text-base font-bold transition-colors relative whitespace-nowrap ${
                        activeTab === tab.id
                          ? "text-[#5E4B8A]"
                          : "text-gray-400 hover:text-gray-700 bg-gray-50/50"
                      }`}
                    >
                      <tab.icon size={18} className={activeTab === tab.id ? "text-[#967BB6]" : ""} />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-[#967BB6] rounded-t-full"
                        />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  
                  {/* Personal Info Tab */}
                  {activeTab === "personal" && (
                    <motion.div
                      key="personal"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 sm:space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                        <div className="space-y-2.5">
                          <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-2">
                            <User size={16} className="text-[#B19CD9]" />
                            Full Name
                          </label>
                          <input
                            {...register("name", {
                              required: "Name is required",
                            })}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all outline-none text-sm sm:text-base font-medium ${
                              isEditing
                                ? "bg-white border-gray-200 focus:border-[#B19CD9] focus:ring-4 focus:ring-[#E6E6FA]/50"
                                : "bg-gray-50 border-transparent text-gray-600"
                            } ${errors.name ? "border-red-400 focus:ring-red-100" : ""}`}
                          />
                          {errors.name && (
                            <p className="text-xs font-semibold text-red-500 mt-1">
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2.5">
                          <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Mail size={16} className="text-[#B19CD9]" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            {...register("email")}
                            disabled
                            className="w-full px-4 py-3.5 rounded-xl border-2 border-transparent bg-gray-100/80 text-gray-500 font-medium text-sm sm:text-base cursor-not-allowed"
                          />
                        </div>

                        <div className="space-y-2.5">
                          <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Phone size={16} className="text-[#B19CD9]" />
                            Phone Number
                          </label>
                          <input
                            {...register("phone")}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all outline-none text-sm sm:text-base font-medium ${
                              isEditing
                                ? "bg-white border-gray-200 focus:border-[#B19CD9] focus:ring-4 focus:ring-[#E6E6FA]/50"
                                : "bg-gray-50 border-transparent text-gray-600"
                            }`}
                          />
                        </div>

                        <div className="space-y-2.5">
                          <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-2">
                            <MapPin size={16} className="text-[#B19CD9]" />
                            Location
                          </label>
                          <input
                            {...register("location")}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all outline-none text-sm sm:text-base font-medium ${
                              isEditing
                                ? "bg-white border-gray-200 focus:border-[#B19CD9] focus:ring-4 focus:ring-[#E6E6FA]/50"
                                : "bg-gray-50 border-transparent text-gray-600"
                            }`}
                            placeholder="City, Country"
                          />
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Globe size={16} className="text-[#B19CD9]" />
                          Website / Portfolio
                        </label>
                        <input
                          {...register("website")}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all outline-none text-sm sm:text-base font-medium ${
                            isEditing
                              ? "bg-white border-gray-200 focus:border-[#B19CD9] focus:ring-4 focus:ring-[#E6E6FA]/50"
                              : "bg-gray-50 border-transparent text-gray-600"
                          }`}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      <div className="space-y-2.5">
                        <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Edit2 size={16} className="text-[#B19CD9]" />
                          Bio
                        </label>
                        <textarea
                          {...register("bio")}
                          disabled={!isEditing}
                          rows={5}
                          className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all outline-none resize-none text-sm sm:text-base font-medium ${
                            isEditing
                              ? "bg-white border-gray-200 focus:border-[#B19CD9] focus:ring-4 focus:ring-[#E6E6FA]/50"
                              : "bg-gray-50 border-transparent text-gray-600"
                          }`}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div className="max-w-xl">
                        <h3 className="text-xl font-extrabold text-gray-900 mb-6">
                          Change Password
                        </h3>
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">
                              Current Password
                            </label>
                            <div className="relative group">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                  setPasswordData({
                                    ...passwordData,
                                    currentPassword: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#B19CD9] focus:ring-4 focus:ring-[#E6E6FA]/50 transition-all outline-none text-sm font-medium pr-12"
                                placeholder="••••••••"
                              />
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#7A589B] hover:bg-[#FAF7FF] rounded-lg transition-colors"
                              >
                                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">
                              New Password
                            </label>
                            <input
                              type={showPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  newPassword: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#B19CD9] focus:ring-4 focus:ring-[#E6E6FA]/50 transition-all outline-none text-sm font-medium"
                              placeholder="••••••••"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">
                              Confirm New Password
                            </label>
                            <input
                              type={showPassword ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  confirmPassword: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#B19CD9] focus:ring-4 focus:ring-[#E6E6FA]/50 transition-all outline-none text-sm font-medium"
                              placeholder="••••••••"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 mt-6">
                            <NavLink
                              to="/forgot-password"
                              className="text-sm text-[#7A589B] hover:text-[#5E4B8A] font-bold transition-colors"
                            >
                              Forgot your password?
                            </NavLink>
                            <button
                              onClick={handleUpdatePassword}
                              disabled={loading}
                              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#B19CD9] to-[#967BB6] text-white rounded-xl hover:from-[#A685E2] hover:to-[#8A63A6] shadow-lg shadow-[#B19CD9]/30 transition-all font-bold disabled:opacity-50"
                            >
                              {loading ? "Updating..." : "Update Password"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border-t-2 border-red-50 pt-8 mt-10">
                        <h3 className="text-lg font-extrabold text-red-600 mb-4 flex items-center gap-2">
                          <AlertCircle size={22} />
                          Danger Zone
                        </h3>
                        <div className="bg-red-50/50 rounded-2xl p-6 sm:p-8 border border-red-100">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                            <div>
                              <p className="font-bold text-gray-900 text-lg">
                                Delete Account
                              </p>
                              <p className="text-sm text-gray-600 mt-1 font-medium">
                                Once deleted, your account and all associated data cannot be recovered.
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                const confirmDelete = window.confirm(
                                  "Are you sure you want to delete your account?\n\nThis action is permanent and will delete all your data including enrollments, payments, and courses. This cannot be undone.",
                                );
                                if (confirmDelete) {
                                  deleteUser();
                                }
                              }}
                              className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all font-bold whitespace-nowrap"
                            >
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Social Links Tab */}
                  {activeTab === "social" && (
                    <motion.div
                      key="social"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Linkedin size={18} className="text-[#0077b5]" />
                            LinkedIn Profile
                          </label>
                          <input
                            {...register("linkedin")}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all outline-none text-sm font-medium ${
                              isEditing
                                ? "bg-white border-gray-200 focus:border-[#B19CD9] focus:ring-4 focus:ring-[#E6E6FA]/50"
                                : "bg-gray-50 border-transparent text-gray-600"
                            }`}
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>

                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Github size={18} className="text-gray-900" />
                            GitHub Profile
                          </label>
                          <input
                            {...register("github")}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all outline-none text-sm font-medium ${
                              isEditing
                                ? "bg-white border-gray-200 focus:border-[#B19CD9] focus:ring-4 focus:ring-[#E6E6FA]/50"
                                : "bg-gray-50 border-transparent text-gray-600"
                            }`}
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>

                      {(linkedin || github) && (
                        <div className="mt-8 p-6 sm:p-8 bg-[#FAF7FF] rounded-2xl border border-[#E6E6FA]">
                          <h4 className="text-sm font-extrabold text-[#7A589B] mb-5 uppercase tracking-wider">
                            Profile Links Preview
                          </h4>
                          <div className="flex flex-wrap gap-4">
                            {linkedin && (
                              <a
                                href={linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border-2 border-[#E6E6FA] rounded-xl text-[#5E4B8A] hover:border-[#B19CD9] hover:shadow-md transition-all font-bold text-sm"
                              >
                                <Linkedin size={18} className="text-[#0077b5]" />
                                LinkedIn
                              </a>
                            )}
                            {github && (
                              <a
                                href={github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border-2 border-[#E6E6FA] rounded-xl text-[#5E4B8A] hover:border-gray-800 hover:text-gray-900 hover:shadow-md transition-all font-bold text-sm"
                              >
                                <Github size={18} />
                                GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;