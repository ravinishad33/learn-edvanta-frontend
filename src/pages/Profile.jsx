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

  // Role badge config
  const roleConfig = {
    student: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      label: "Student",
    },
    instructor: {
      color: "bg-purple-100 text-purple-700 border-purple-200",
      label: "Instructor",
    },
    admin: {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      label: "Administrator",
    },
  };

  const currentRole = roleConfig[userRole] || roleConfig.student;

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Profile Settings
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${currentRole.color}`}
                >
                  {currentRole.label}
                </span>
              </div>
              <p className="text-gray-600">
                Manage your account settings and preferences
              </p>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium flex items-center gap-2"
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center gap-2 disabled:opacity-50"
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
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center gap-2"
                >
                  <Edit2 size={18} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Cover */}
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>

              {/* Avatar & Info */}
              <div className="px-6 pb-6 -mt-12 relative">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                    <img
                      src={
                        profile?.avatar?.url ||
                        `https://api.dicebear.com/9.x/notionists/svg?seed=${profile?.name}`
                      }
                      alt={profile?.name}
                      className="w-full h-full rounded-xl object-cover bg-gray-100"
                    />
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-lg shadow-lg cursor-pointer hover:bg-blue-700 transition">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {profile?.name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>

                  {profile?.bio && (
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed line-clamp-3">
                      {profile?.bio}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>
                      Joined{" "}
                      {new Date(profile?.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" },
                      )}
                    </span>
                  </div>

                  {profile?.isVerified && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      <CheckCircle size={14} />
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
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                Account Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-600">
                    <BookOpen size={18} />
                    <span className="text-sm">Role</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {userRole}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Shield size={18} />
                    <span className="text-sm">Status</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock size={18} />
                    <span className="text-sm">Member Since</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(profile?.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="border-b border-gray-100">
                <nav className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                        activeTab === tab.id
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {/* Personal Info */}
                  {activeTab === "personal" && (
                    <motion.div
                      key="personal"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            Full Name
                          </label>
                          <input
                            {...register("name", {
                              required: "Name is required",
                            })}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-xl border transition-all ${
                              isEditing
                                ? "bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                : "bg-gray-50 border-gray-100 text-gray-600"
                            } ${errors.name ? "border-red-300" : ""}`}
                          />
                          {errors.name && (
                            <p className="text-sm text-red-600">
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            {...register("email")}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Phone size={16} className="text-gray-400" />
                            Phone Number
                          </label>
                          <input
                            {...register("phone")}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-xl border transition-all ${
                              isEditing
                                ? "bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                : "bg-gray-50 border-gray-100 text-gray-600"
                            }`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            Location
                          </label>
                          <input
                            {...register("location")}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-xl border transition-all ${
                              isEditing
                                ? "bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                : "bg-gray-50 border-gray-100 text-gray-600"
                            }`}
                            placeholder="City, Country"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Globe size={16} className="text-gray-400" />
                          Website / Portfolio
                        </label>
                        <input
                          {...register("website")}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 rounded-xl border transition-all ${
                            isEditing
                              ? "bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              : "bg-gray-50 border-gray-100 text-gray-600"
                          }`}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <textarea
                          {...register("bio")}
                          disabled={!isEditing}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                            isEditing
                              ? "bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              : "bg-gray-50 border-gray-100 text-gray-600"
                          }`}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Security */}
                  {activeTab === "security" && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div className="max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                          Change Password
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                  setPasswordData({
                                    ...passwordData,
                                    currentPassword: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              />
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
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
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
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
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <NavLink
                              to="/forgot-password"
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Forgot password?
                            </NavLink>
                            <button
                              onClick={handleUpdatePassword}
                              disabled={loading}
                              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50"
                            >
                              {loading ? "Updating..." : "Update Password"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-8">
                        <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                          <AlertCircle size={20} />
                          Danger Zone
                        </h3>
                        <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                Delete Account
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Once deleted, your account cannot be recovered
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
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                            >
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Social Links */}
                  {activeTab === "social" && (
                    <motion.div
                      key="social"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Linkedin size={16} className="text-blue-600" />
                            LinkedIn Profile
                          </label>
                          <input
                            {...register("linkedin")}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-xl border transition-all ${
                              isEditing
                                ? "bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                : "bg-gray-50 border-gray-100 text-gray-600"
                            }`}
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Github size={16} className="text-gray-900" />
                            GitHub Profile
                          </label>
                          <input
                            {...register("github")}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 rounded-xl border transition-all ${
                              isEditing
                                ? "bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                : "bg-gray-50 border-gray-100 text-gray-600"
                            }`}
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>

                      {(linkedin || github) && (
                        <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-4">
                            Preview
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {linkedin && (
                              <a
                                href={linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-blue-300 hover:text-blue-600 transition"
                              >
                                <Linkedin size={18} />
                                <span className="text-sm">LinkedIn</span>
                              </a>
                            )}
                            {github && (
                              <a
                                href={github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-gray-400 hover:text-gray-900 transition"
                              >
                                <Github size={18} />
                                <span className="text-sm">GitHub</span>
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
