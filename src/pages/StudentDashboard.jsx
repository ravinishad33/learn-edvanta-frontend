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

  // Set current date on mount
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

  // Fetch enrolled courses
  useEffect(() => {
    const getStudentCourses = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/api/student/enrolled-courses`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
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
        },
      );

      const downloadUrl = response.data.downloadUrl;

      // Create an invisible <a> element to trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `certificate-${courseId}.png`; // optional file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Download failed:", error);
      toast.error(error.response.data.message || "Download failed");
      // console.log(error.response.data.message)
    }
  };

  // Fetch student stats
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
          },
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
      transition: {
        staggerChildren: 0.1,
      },
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
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Completed",
      value: studentStats?.totalCompleted || 0,
      icon: CheckCircleIcon,
      color: "green",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Learning Hours",
      value: studentStats?.totalLearningHours || 0,
      icon: ClockIcon,
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Certificates",
      value: studentStats?.totalCertificates || 0,
      icon: TrophyIcon,
      color: "yellow",
      gradient: "from-yellow-500 to-yellow-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {reduxUser?.name || "Student"}
              </h1>
              <p className="mt-2 text-gray-600">
                Continue your learning journey
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
              <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsCards.map((stat) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid - Adjusted proportions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Courses Section - Takes 9 columns (wider) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-9"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    My Courses
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {studentCourses.length} courses in progress
                  </p>
                </div>
                <Link
                  to="/courses"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center transition-colors"
                >
                  View All
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="p-6">
                {studentCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpenIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No courses enrolled yet</p>
                    <Link
                      to="/courses"
                      className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {studentCourses.map((course, index) => (
                      <motion.div
                        key={course._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.005 }}
                        className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Course Image - Slightly wider for new proportions */}
                          <div className="sm:w-56 h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
                            <img
                              src={
                                course?.thumbnail?.url ||
                                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400"
                              }
                              alt={course?.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/10" />

                            {/* Progress Badge on Image */}
                            <div className="absolute top-3 left-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                  course?.enrollment?.progress === 100
                                    ? "bg-green-500 text-white"
                                    : "bg-blue-600 text-white"
                                }`}
                              >
                                {course?.enrollment?.progress || 0}%
                              </span>
                            </div>
                          </div>

                          {/* Course Content */}
                          <div className="flex-1 p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mb-2">
                                    {course?.category?.name || "General"}
                                  </span>
                                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                                    {course?.title}
                                  </h3>
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 mb-3">
                                by{" "}
                                {course?.instructor?.name ||
                                  "Unknown Instructor"}
                              </p>

                              {/* Progress Bar */}
                              <div className="mb-4">
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${course?.enrollment?.progress || 0}%`,
                                    }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={`h-full rounded-full ${
                                      course?.enrollment?.progress === 100
                                        ? "bg-green-500"
                                        : "bg-gradient-to-r from-blue-500 to-blue-600"
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center text-sm text-gray-500">
                                <ClockIcon className="w-4 h-4 mr-1.5" />
                                <span>
                                  {course?.nextLesson
                                    ? `Next: ${course.nextLesson.title}`
                                    : course?.enrollment?.progress === 100
                                      ? "Course completed"
                                      : "Start learning"}
                                </span>
                              </div>
                              {course?.enrollment?.status === "completed" && (
                                <button
                                  onClick={() =>
                                    handleDownloadCertificate(course?._id)
                                  }
                                  className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all bg-green-50 text-green-700 hover:bg-green-100"
                                >
                                  <Award className="h-4 w-4" />
                                  <Download size={18} /> Certificate
                                </button>
                              )}

                              <Link
                                to={`/mycourses/learn/${course?._id}`}
                                className={`inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  course?.enrollment?.progress === 100
                                    ? "bg-green-50 text-green-700 hover:bg-green-100"
                                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
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
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Takes 3 columns (narrower) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Overall Progress Card - Compact */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">
                  Overall Progress
                </h3>
                <ChartBarIcon className="w-5 h-5 text-purple-500" />
              </div>

              <div className="relative flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-100"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 301.59" }}
                    animate={{
                      strokeDasharray: `${
                        (studentStats?.avgProgress || 0) * 3.0159
                      } 301.59`,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-purple-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {studentStats?.avgProgress || 0}%
                    </span>
                    <p className="text-xs text-gray-500">Avg</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-gray-900">
                    {studentStats?.totalCompleted || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-semibold text-gray-900">
                    {(studentStats?.totalEnrolledCourses || 0) -
                      (studentStats?.totalCompleted || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions - Compact */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-5 text-white">
              <h3 className="text-base font-bold mb-1">Keep Learning</h3>
              <p className="text-blue-100 text-xs mb-3">
                Continue where you left off.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Explore Courses
              </Link>
            </div>

            {/* Mini Stats - Additional compact card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Completion Rate
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {studentStats?.totalEnrolledCourses > 0
                      ? Math.round(
                          (studentStats?.totalCompleted /
                            studentStats?.totalEnrolledCourses) *
                            100,
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Active Now</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
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
