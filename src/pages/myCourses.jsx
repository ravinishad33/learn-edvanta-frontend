// src/pages/MyCourses.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  PlusCircle,
  Download,
  Search,
  LayoutGrid,
  List,
  TrendingUp,
  Award,
  MoreVertical,
  PlayCircle,
  Edit3,
  Trash2,
  Eye,
  Check,
  X,
} from "lucide-react";
import CourseTable from "../components/Layout/CourseTable";
import RoleBasedView from "../components/Layout/RoleBasedView";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const MyCourses = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [instructorCourse, setInstructorCourse] = useState([]);
  const [studentCourse, setStudentCourse] = useState([]);
  const [adminCourse, setAdminCourse] = useState([]);

  const user = useSelector((state) => state?.auth?.user);
  const [role, setRole] = useState(user?.role);
  const [instructorStats, setInstructorStats] = useState([]);
  const [studentStats, setStudentStats] = useState([]);
  const [adminStats, setAdminStats] = useState([]);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Data fetching functions
  const getInstructorCourses = async () => {
    if (role !== "instructor") return;
    try {
      const res = await axios.get(`${apiUrl}/api/course/instructor`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setInstructorCourse(res?.data?.courses);
    } catch (error) {
      console.log(error);
    }
  };

  const getStudentCourses = async () => {
    if (role !== "student") return;
    try {
      const res = await axios.get(`${apiUrl}/api/student/enrolled-courses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStudentCourse(res?.data?.courses);
    } catch (error) {
      console.log(error);
    }
  };

  const getAdminCourses = async () => {
    if (role !== "admin") return;
    try {
      const res = await axios.get(`${apiUrl}/api/admin/courses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAdminCourse(res?.data?.courses);
    } catch (error) {
      console.log(error);
    }
  };

  const getInstructorStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (role !== "instructor") return;
      const statsRes = await axios.get(`${apiUrl}/api/instructor/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes?.data?.success) setInstructorStats(statsRes?.data?.stats);
    } catch (error) {
      console.error("Failed to fetch instructor stats:", error);
    }
  };

  const getStudentStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (role !== "student") return;
      const statsRes = await axios.get(`${apiUrl}/api/student/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes?.data?.success) setStudentStats(statsRes?.data?.stats);
    } catch (error) {
      console.error("Failed to fetch student stats:", error);
    }
  };

  const getAdminStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (role !== "admin") return;
      const statsRes = await axios.get(` ${apiUrl}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes?.data?.success) setAdminStats(statsRes?.data?.stats);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    }
  };

  useEffect(() => {
    getInstructorCourses();
    getStudentCourses();
    getAdminCourses();
  }, []);

  useEffect(() => {
    getStudentStats();
    getInstructorStats();
    getAdminStats();
  }, []);

  useEffect(() => {
    getStudentStats();
    getInstructorStats();
    getAdminStats();
  }, [refresh]);

  // download certificate
  const handleDownloadCertificate = async (courseId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${apiUrl}/api/certificate/download/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const downloadUrl = response.data.downloadUrl;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `certificate-${courseId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error(error.response?.data?.message || "Download failed");
      console.log("Download failed:", error);
    }
  };

  // Action handlers
  const handleDeleteCourse = async (courseId) => {
    if (!courseId) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the course?\nAll lessons, enrollments, and payments related to this course will also be permanently deleted.`
    );
    if (!confirmDelete) return;

    const toastId = toast.loading("Deleting course...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/api/course/delete/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course deleted successfully!", { id: toastId });
      setRefresh((prev) => !prev);
      setInstructorCourse((prev) =>
        prev.filter((course) => course._id !== courseId)
      );
      setAdminCourse((prev) =>
        prev.filter((course) => course._id !== courseId)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course", {
        id: toastId,
      });
      console.error(error);
    }
  };

  const handleApproveCourse = async (courseId) => {
    if (!courseId) return;
    const toastId = toast.loading("Approving course...");
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${apiUrl}/api/admin/approve/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Course approved!", { id: toastId });
      setAdminCourse((prev) =>
        prev.map((course) =>
          course._id === courseId ? { ...course, status: "published" } : course
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve course", {
        id: toastId,
      });
      console.error(error);
    }
  };

  const handleRejectCourse = async (courseId) => {
    if (!courseId) return;
    const toastId = toast.loading("Rejecting course...");
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${apiUrl}/api/admin/reject/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Course rejected!", { id: toastId });
      setAdminCourse((prev) =>
        prev.map((course) =>
          course._id === courseId ? { ...course, status: "rejected" } : course
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject course", {
        id: toastId,
      });
      console.error(error);
    }
  };

  // Enhanced stats configuration with gradients matching the lavender theme
  const statsConfig = {
    student: [
      {
        label: "Total Courses",
        value: studentStats?.totalEnrolledCourses || 0,
        icon: BookOpen,
        gradient: "from-violet-500 to-purple-600",
      },
      {
        label: "In Progress",
        value: studentStats?.inProgress || 0,
        icon: Clock,
        gradient: "from-fuchsia-500 to-pink-500",
      },
      {
        label: "Completed",
        value: studentStats?.totalCompleted || 0,
        icon: CheckCircle,
        gradient: "from-emerald-400 to-teal-500",
      },
      {
        label: "Avg. Progress",
        value: (studentStats?.avgProgress || 0) + "%",
        icon: TrendingUp,
        gradient: "from-indigo-400 to-violet-500",
      },
    ],
    instructor: [
      {
        label: "Total Courses",
        value: instructorStats?.totalCourses || 0,
        icon: BookOpen,
        gradient: "from-violet-500 to-purple-600",
      },
      {
        label: "Published",
        value: instructorStats?.totalPublished || 0,
        icon: CheckCircle,
        gradient: "from-emerald-400 to-teal-500",
      },
      {
        label: "Total Students",
        value: instructorStats?.totalStudents || 0,
        icon: Users,
        gradient: "from-fuchsia-500 to-pink-500",
      },
      {
        label: "Total Revenue",
        value: "₹" + (instructorStats?.totalRevenue || 0),
        icon: BarChart3,
        gradient: "from-indigo-400 to-violet-500",
      },
    ],
    admin: [
      {
        label: "Total Courses",
        value: adminStats?.totalCourses || 0,
        icon: BookOpen,
        gradient: "from-violet-500 to-purple-600",
      },
      {
        label: "Active Courses",
        value: adminStats?.activeCourses || 0,
        icon: CheckCircle,
        gradient: "from-emerald-400 to-teal-500",
      },
      {
        label: "Total Students",
        value: adminStats?.totalStudents || 0,
        icon: Users,
        gradient: "from-fuchsia-500 to-pink-500",
      },
      {
        label: "Enrolled Students",
        value: adminStats?.totalEnrolledStudents || 0,
        icon: Award,
        gradient: "from-rose-400 to-red-500",
      },
      {
        label: "Total Revenue",
        value: "₹" + (adminStats?.totalRevenue || 0),
        icon: BarChart3,
        gradient: "from-indigo-400 to-violet-500",
      },
    ],
  };

  const getFilteredCourses = () => {
    let courses =
      role === "student"
        ? studentCourse
        : role === "instructor"
          ? instructorCourse
          : role === "admin"
            ? adminCourse
            : [];

    if (searchTerm) {
      courses = courses?.filter(
        (course) =>
          course?.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
          course?.category?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (activeTab !== "all") {
      const tab = activeTab?.toLowerCase();
      courses = courses?.filter((course) => {
        const visibility = course?.visibility?.toLowerCase();
        const enrollmentStatus = course?.enrollment?.status?.toLowerCase();
        const courseStatus = course?.status?.toLowerCase();

        if (role === "instructor") {
          const instructorMap = {
            published: "public",
            draft: "draft",
            private: "private",
          };
          return visibility === instructorMap[tab];
        }

        if (role === "student") {
          const studentMap = { active: "active", completed: "completed" };
          return enrollmentStatus === studentMap[tab];
        }

        if (role === "admin") {
          const adminMap = {
            published: "published",
            pending: "review",
            rejected: "rejected",
          };
          return courseStatus === adminMap[tab];
        }

        return true;
      });
    }

    return courses;
  };

  const handleCreateCourse = () => {
    navigate("/createcourse");
  };

  const tabs = {
    student: ["all", "active", "completed"],
    instructor: ["all", "published", "draft", "private"],
    admin: ["all", "published", "pending", "rejected"],
  };

  const getRoleTitle = () => {
    switch (role) {
      case "student":
        return "My Learning";
      case "instructor":
        return "My Courses";
      case "admin":
        return "Course Management";
      default:
        return "Courses";
    }
  };

  const getRoleSubtitle = () => {
    switch (role) {
      case "student":
        return "Track your learning progress and access your courses";
      case "instructor":
        return "Manage and create your courses";
      case "admin":
        return "Manage all courses in the platform";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7fa] text-slate-800">
      {/* Header Section */}
      <div className="bg-white border-b border-violet-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {getRoleTitle()}
              </h1>
              <p className="mt-1 md:mt-2 text-slate-500">{getRoleSubtitle()}</p>
            </div>

            <RoleBasedView
              role={role}
              student={null}
              instructor={
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateCourse}
                  className="flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-2.5 md:py-3 rounded-xl hover:bg-violet-700 transition shadow-sm shadow-violet-200 font-medium w-full md:w-auto"
                >
                  <PlusCircle size={20} />
                  Create New Course
                </motion.button>
              }
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid gap-4 md:gap-6 mb-8 ${role === "admin"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            }`}
        >
          {statsConfig[role]?.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-violet-50 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-sm`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-violet-50 p-4 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-2.5 bg-slate-50 border border-violet-100 rounded-xl w-full focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all text-sm md:text-base outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Tabs */}
              <div className="flex w-full sm:w-auto space-x-1 bg-slate-50 p-1 rounded-xl overflow-x-auto border border-violet-50">
                {tabs[role]?.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap ${activeTab === tab
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      }`}
                  >
                    {tab === "active" ? "In Progress" : tab}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex bg-slate-50 p-1 rounded-xl border border-violet-50">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid"
                    ? "bg-white text-violet-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-700"
                    }`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list"
                    ? "bg-white text-violet-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-700"
                    }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Courses Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {getFilteredCourses()?.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl border border-violet-100 overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all duration-300 flex flex-col"
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img
                      src={course?.thumbnail?.url}
                      alt={course?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${role === "student"
                          ? course?.enrollment?.progress === 100
                            ? "bg-emerald-500 text-white"
                            : "bg-violet-600 text-white"
                          : course?.status === "published"
                            ? "bg-emerald-500 text-white"
                            : course?.status === "review"
                              ? "bg-amber-500 text-white"
                              : "bg-slate-500 text-white"
                          }`}
                      >
                        {role === "student"
                          ? `${course?.enrollment?.progress || 0}%`
                          : course?.status || "Draft"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700">
                        {course?.category?.name || "General"}
                      </span>
                      {role === "student" && (
                        <span className="text-xs text-slate-500 flex items-center">
                          <Clock size={14} className="mr-1" />
                          {course?.totalDuration || "0h"}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-violet-600 transition-colors">
                      {course?.title}
                    </h3>

                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                      {course?.description || "No description available"}
                    </p>

                    {/* Progress Bar for Students */}
                    {role === "student" && (
                      <div className="mb-4">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${course?.enrollment?.progress === 100
                              ? "bg-emerald-500"
                              : "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                              }`}
                            style={{
                              width: `${course?.enrollment?.progress || 0}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
                          <span className="line-clamp-1">
                            {course?.nextLesson
                              ? `Next: ${course.nextLesson.title}`
                              : course?.enrollment?.progress === 100
                                ? "Completed"
                                : "Start learning"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Footer Actions - IMPROVED BUTTON UI */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-100 gap-3 mt-auto">
                      <div className="flex items-center text-sm text-slate-500">
                        {role === "instructor" ? (
                          <>
                            <Users size={16} className="mr-1.5" />
                            {course?.enrolledStudents?.length || 0} students
                          </>
                        ) : (
                          <span className="text-xs line-clamp-1">
                            By {course?.instructor?.name || "Unknown"}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* Student: Certificate Button */}
                        {role === "student" && course?.enrollment?.status === "completed" && (
                          <button
                            onClick={() => handleDownloadCertificate(course?._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:scale-105 active:scale-95"
                          >
                            <Award className="h-3.5 w-3.5" />
                            <span>Certificate</span>
                          </button>
                        )}

                        {/* Student: Continue/Review Button */}
                        {role === "student" && (
                          <button
                            onClick={() => navigate(`/mycourses/learn/${course?._id}`)}
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${course?.enrollment?.progress === 100
                              ? "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-md hover:scale-105 active:scale-95"
                              : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-md hover:scale-105 active:scale-95"
                              }`}
                          >
                            {course?.enrollment?.progress === 100 ? (
                              <>
                                <CheckCircle size={14} />
                                <span>Review</span>
                              </>
                            ) : (
                              <>
                                <PlayCircle size={14} />
                                <span>Continue</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Instructor: View Button */}
                        {role === "instructor" && (
                          <>
                            <button
                              onClick={() => navigate(`/mycourses/learn/${course?._id}`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-slate-100 text-slate-700 hover:bg-violet-100 hover:text-violet-700 hover:scale-105 active:scale-95"
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </button>

                            {/* Instructor: Edit Button */}
                            <button
                              onClick={() => navigate(`/mycourses/edit/${course?._id}`)}
                              className="inline-flex items-center gap-1.5 p-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:scale-105 active:scale-95"
                              title="Edit Course"
                            >
                              <Edit3 size={16} />
                            </button>

                            {/* Instructor: Delete Button */}
                            <button
                              onClick={() => handleDeleteCourse(course?._id)}
                              className="inline-flex items-center gap-1.5 p-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:scale-105 active:scale-95"
                              title="Delete Course"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}

                        {/* Admin: Approve/Reject Buttons */}
                        {role === "admin" && course.status === "review" && (
                          <>
                            <button
                              onClick={() => handleApproveCourse(course?._id)}
                              disabled={course?.status === "published"}
                              className="inline-flex items-center gap-1.5 p-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                              title="Approve Course"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleRejectCourse(course?._id)}
                              disabled={course?.status === "rejected"}
                              className="inline-flex items-center gap-1.5 p-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                              title="Reject Course"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}

                        {/* Admin: View & Delete Buttons */}
                        {role === "admin" && (
                          <>
                            <button
                              onClick={() => navigate(`/mycourses/learn/${course?._id}`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-slate-100 text-slate-700 hover:bg-violet-100 hover:text-violet-700 hover:scale-105 active:scale-95"
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course?._id)}
                              className="inline-flex items-center gap-1.5 p-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:scale-105 active:scale-95"
                              title="Delete Course"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-violet-50 overflow-hidden">
              <CourseTable
                courses={getFilteredCourses()}
                role={role}
                onEdit={(id) =>
                  role === "instructor" && navigate(`/mycourses/edit/${id}`)
                }
                onDelete={(id) =>
                  (role === "admin" || role === "instructor") &&
                  handleDeleteCourse(id)
                }
                onView={(id) => navigate(`/mycourses/learn/${id}`)}
                onApprove={(id) => role === "admin" && handleApproveCourse(id)}
                onReject={(id) => role === "admin" && handleRejectCourse(id)}
              />
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {getFilteredCourses()?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-violet-50 shadow-sm mt-6"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <BookOpen className="h-10 w-10 text-violet-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No courses found
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms or filters"
                : role === "student"
                  ? "Enroll in courses to get started with your learning journey"
                  : role === "instructor"
                    ? "Create your first course to begin teaching"
                    : "No courses available in the system"}
            </p>

            <RoleBasedView
              student={
                <button
                  onClick={() => navigate("/courses")}
                  className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition font-medium shadow-sm shadow-violet-200"
                >
                  Browse Courses
                </button>
              }
              instructor={
                <button
                  onClick={handleCreateCourse}
                  className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition font-medium shadow-sm shadow-violet-200"
                >
                  <PlusCircle size={20} className="mr-2" />
                  Create First Course
                </button>
              }
              admin={null}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;