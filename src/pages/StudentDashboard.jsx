// src/pages/StudentDashboard.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  ChartBarIcon,
  PlayIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Award, Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const [studentCourses, setStudentCourses] = useState([]);
  const [studentStats, setStudentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  const reduxUser = useSelector((state) => state?.auth?.user);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(date.toLocaleDateString("en-US", options));
  }, []);

  useEffect(() => {
    const getStudentCourses = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/api/student/enrolled-courses`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStudentCourses(res?.data?.courses || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    getStudentCourses();
  }, []);

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
      console.log("Download failed:", error);
      toast.error(error.response?.data?.message || "Download failed");
    }
  };

  useEffect(() => {
    const getStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const statsRes = await axios.get(
          `${apiUrl}/api/student/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (statsRes?.data?.success) {
          setStudentStats(statsRes?.data?.stats);
        }
      } catch (error) {
        console.error("Failed to fetch student stats:", error);
      }
    };
    getStats();
  }, []);

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

  const statsCards = [
    {
      title: "Enrolled Courses",
      value: studentStats?.totalEnrolledCourses || 0,
      icon: BookOpenIcon,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Completed",
      value: studentStats?.totalCompleted || 0,
      icon: CheckCircleIcon,
      gradient: "from-emerald-400 to-teal-500", 
    },
    {
      title: "Learning Hours",
      value: studentStats?.totalLearningHours || 0,
      icon: ClockIcon,
      gradient: "from-fuchsia-500 to-pink-500",
    },
    {
      title: "Certificates",
      value: studentStats?.totalCertificates || 0,
      icon: TrophyIcon,
      gradient: "from-indigo-400 to-violet-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7fa] text-slate-800">
      {/* Header Section */}
      <div className="bg-white border-b border-violet-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Welcome back, {reduxUser?.name || "Student"}
              </h1>
              <p className="mt-1 md:mt-2 text-slate-500">
                Continue your learning journey
              </p>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-violet-50 text-violet-800 rounded-full text-sm font-medium border border-violet-100 w-fit">
              <CalendarIcon className="w-5 h-5 mr-2 text-violet-600" />
              <span>{currentDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          {statsCards.map((stat) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-violet-50 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-sm`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Courses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 xl:col-span-9"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-violet-50 overflow-hidden">
              <div className="p-5 md:p-6 border-b border-violet-50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-900">
                    My Courses
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {studentCourses.length} courses in progress
                  </p>
                </div>
                <Link
                  to="/courses"
                  className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center transition-colors"
                >
                  View All
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="p-5 md:p-6">
                {studentCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpenIcon className="w-12 h-12 text-violet-200 mx-auto mb-4" />
                    <p className="text-slate-500">No courses enrolled yet</p>
                    <Link
                      to="/courses"
                      className="mt-4 inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {studentCourses.map((course, index) => (
                      <motion.div
                        key={course._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white rounded-xl border border-violet-100 overflow-hidden hover:shadow-md hover:border-violet-200 transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Course Image */}
                          <div className="w-full sm:w-56 h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
                            <img
                              src={
                                course?.thumbnail?.url ||
                                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400"
                              }
                              alt={course?.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/10" />

                            <div className="absolute top-3 left-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                                  course?.enrollment?.progress === 100
                                    ? "bg-emerald-500 text-white"
                                    : "bg-violet-600 text-white"
                                }`}
                              >
                                {course?.enrollment?.progress || 0}%
                              </span>
                            </div>
                          </div>

                          {/* Course Content */}
                          <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 mb-2">
                                    {course?.category?.name || "General"}
                                  </span>
                                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2 md:line-clamp-1">
                                    {course?.title}
                                  </h3>
                                </div>
                              </div>

                              <p className="text-sm text-slate-500 mb-3">
                                by {course?.instructor?.name || "Unknown Instructor"}
                              </p>

                              {/* Progress Bar */}
                              <div className="mb-4">
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${course?.enrollment?.progress || 0}%` }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                    className={`h-full rounded-full ${
                                      course?.enrollment?.progress === 100
                                        ? "bg-emerald-500"
                                        : "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Footer / Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-100 gap-3">
                              <div className="flex items-center text-sm text-slate-500">
                                <ClockIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                <span className="line-clamp-1">
                                  {course?.nextLesson
                                    ? `Next: ${course.nextLesson.title}`
                                    : course?.enrollment?.progress === 100
                                    ? "Course completed"
                                    : "Start learning"}
                                </span>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-2">
                                {course?.enrollment?.status === "completed" && (
                                  <button
                                    onClick={() => handleDownloadCertificate(course?._id)}
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex-1 sm:flex-none"
                                  >
                                    <Award className="h-4 w-4 mr-1.5" />
                                    Certificate
                                  </button>
                                )}

                                <Link
                                  to={`/mycourses/learn/${course?._id}`}
                                  className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 sm:flex-none ${
                                    course?.enrollment?.progress === 100
                                      ? "bg-violet-50 text-violet-700 hover:bg-violet-100"
                                      : "bg-violet-600 text-white hover:bg-violet-700 shadow-sm hover:shadow-md"
                                  }`}
                                >
                                  {course?.enrollment?.progress === 100 ? (
                                    <>
                                      Review
                                      <CheckCircleIcon className="w-4 h-4 ml-1.5" />
                                    </>
                                  ) : (
                                    <>
                                      Continue
                                      <PlayIcon className="w-4 h-4 ml-1.5" />
                                    </>
                                  )}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4 xl:col-span-3 space-y-6"
          >
            {/* Overall Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-violet-50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Overall Progress
                </h3>
                <ChartBarIcon className="w-5 h-5 text-violet-500" />
              </div>

              <div className="relative flex items-center justify-center py-2">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 339.29" }}
                    animate={{
                      strokeDasharray: `${(studentStats?.avgProgress || 0) * 3.3929} 339.29`,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-violet-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-slate-900">
                      {studentStats?.avgProgress || 0}%
                    </span>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Avg</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm pb-2 border-b border-slate-50">
                  <span className="text-slate-500">Completed</span>
                  <span className="font-semibold text-slate-900">
                    {studentStats?.totalCompleted || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">In Progress</span>
                  <span className="font-semibold text-slate-900">
                    {(studentStats?.totalEnrolledCourses || 0) -
                      (studentStats?.totalCompleted || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl shadow-md p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
              <h3 className="text-lg font-bold mb-1 relative z-10">Keep Learning</h3>
              <p className="text-violet-100 text-sm mb-4 relative z-10">
                Continue exactly where you left off.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-white text-violet-700 rounded-lg text-sm font-bold hover:bg-violet-50 transition-colors shadow-sm relative z-10"
              >
                Explore Courses
              </Link>
            </div>

            {/* Mini Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-violet-50 p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2.5 shadow-sm"></div>
                    <span className="text-sm font-medium text-slate-600">
                      Completion Rate
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {studentStats?.totalEnrolledCourses > 0
                      ? Math.round(
                          (studentStats?.totalCompleted /
                            studentStats?.totalEnrolledCourses) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-400 mr-2.5 shadow-sm"></div>
                    <span className="text-sm font-medium text-slate-600">Active Now</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {(studentStats?.totalEnrolledCourses || 0) -
                      (studentStats?.totalCompleted || 0)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;