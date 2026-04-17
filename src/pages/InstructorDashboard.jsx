import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusIcon,
  ChartBarIcon,
  UserGroupIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [instructorStats, setInstructorStats] = useState([]);
  const [instructorCourse, setInstructorCourse] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

const getColor = (value) => {
  if (value > 0) return "green";
  if (value < 0) return "red";
  return "gray";
};






const stats = [
  {
    label: "Total Courses",
    value: instructorStats?.totalCourses,
    change: instructorStats?.courseGrowth,
    icon: ChartBarIcon,
    color: getColor(instructorStats?.courseGrowth),
  },
  {
    label: "Total Students",
    value: instructorStats?.totalStudents,
    change: instructorStats?.studentGrowth,
    icon: UserGroupIcon,
    color: getColor(instructorStats?.studentGrowth),
  },
  {
    label: "Total Revenue",
    value: "₹" + instructorStats?.totalRevenue,
    change: instructorStats?.revenueGrowthPercent +'%',
    icon: CurrencyRupeeIcon,
    color: getColor(instructorStats?.revenueGrowthPercent),
  },
  {
    label: "Avg Rating",
    value: instructorStats?.avgRating,
    change: instructorStats?.ratingGrowth,
    icon: StarIcon,
    color: getColor(instructorStats?.ratingGrowth),
  },
];

  const getRecentStudents = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `${apiUrl}/api/enrollments/instructor/recent-students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRecentStudents(res?.data?.students || []);
    } catch (error) {
      console.error(error);
    }
  };

  // fetching dashboard stats api
  useEffect(() => {
    const getStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const statsRes = await axios.get(
          `${apiUrl}/api/instructor/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ correct string format
            },
          },
        );

        if (statsRes?.data?.success) {
          setInstructorStats(statsRes?.data?.stats);
        }
      } catch (error) {
        console.error("Failed to fetch instructor stats:", error);
      }
    };

    getStats();
  }, []);

  // calling to get all instructor  courses
  useEffect(() => {
    const getInstructorCourses = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/api/course/instructor`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        // console.log(res?.data?.courses);
        setInstructorCourse(res?.data?.courses);
      } catch (error) {
        console.log(error);
      }
    };
    getInstructorCourses();
    getRecentStudents();
  }, []);

  const courses = [
    {
      id: 1,
      title: "React Masterclass",
      students: 1245,
      revenue: "$12,450",
      rating: 4.9,
      status: "active",
    },
    {
      id: 2,
      title: "Node.js Backend",
      students: 856,
      revenue: "$8,560",
      rating: 4.7,
      status: "active",
    },
    {
      id: 3,
      title: "Python Data Science",
      students: 357,
      revenue: "$3,570",
      rating: 4.8,
      status: "draft",
    },
  ];

  // const recentStudents = [
  //   { id: 1, name: 'Alex Johnson', email: 'alex@example.com', enrolled: '2 days ago', progress: '75%' },
  //   { id: 2, name: 'Sarah Miller', email: 'sarah@example.com', enrolled: '1 week ago', progress: '45%' },
  //   { id: 3, name: 'Mike Chen', email: 'mike@example.com', enrolled: '3 days ago', progress: '90%' },
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-end">
            <Link to="/createcourse" className="btn-primary flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create New Course
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats?.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
          
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold text-${stat.color}-900 mt-2`}>
                    {stat.value}
                  </p>
            <p className={`text-sm text-${stat.color}-600 mt-1`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div
                  className={`p-3 bg-${stat.color || [green]}-100 rounded-lg`}
                >
                  <stat.icon
                    className={`h-8 w-8 text-${stat.color || [grean]}-600`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                <button className="text-blue-600 hover:text-blue-800 font-semibold">
                  View All Courses
                </button>
              </div>

              <div className="space-y-4">
                {instructorCourse?.map((course) => (
                  <motion.div
                    key={course?._id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {course?.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600">
                          <UserGroupIcon className="inline h-4 w-4 mr-1" />
                          {course?.enrolledStudents?.length || 0} students
                        </span>
                        <span className="text-sm text-gray-600">
                          <CurrencyRupeeIcon className="inline h-4 w-4 mr-1" />
                          {(course?.price - (course?.discountPrice || 0)) *
                            (course?.enrolledStudents?.length || 0)}
                        </span>
                        <span className="text-sm text-gray-600">
                          <StarIcon className="inline h-4 w-4 mr-1" />
                       {course?.avgRating?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${course?.visibility === "public"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {course?.visibility}
                      </span>
                      <button
                        onClick={() => {
                          navigate(`/mycourses/learn/${course?._id}`);
                        }}
                        className="px-4 py-2 text-green-600 hover:text-green-800 font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/mycourses/edit/${course?._id}`);
                        }}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Revenue Overview
              </h2>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <div className="text-center">
                  <ArrowTrendingUpIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {instructorStats?.thisMonthRevenuePercent}
                  </div>
                  <p className="text-gray-600">Revenue growth this month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Students */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Recent Students
              </h3>
              <div className="space-y-4">
                {recentStudents?.map((student) => (
                  <div
                    key={student?._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {student?.name}
                      </p>
                      <p className="text-sm text-gray-600">{student?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Enrolled{" "}
                        {student?.enrolledAt &&
                          formatDistanceToNow(new Date(student?.enrolledAt), {
                            addSuffix: true,
                          })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {student?.progress}%
                      </div>
                      <div className="text-sm text-gray-500">Progress</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            {/* <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  Create New Announcement
                </button>
                <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  Grade Assignments
                </button>
                <button className="w-full text-left p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  View Student Analytics
                </button>
                <button className="w-full text-left p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                  Update Course Content
                </button>
              </div>
            </div> */}

            {/* Performance Metrics */}
            {/* <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Course Completion Rate</span>
                    <span>82%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "82%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Student Satisfaction</span>
                    <span>4.8/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "96%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Response Time</span>
                    <span>2.4 hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
