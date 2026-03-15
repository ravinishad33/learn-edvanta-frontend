// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CreditCardIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ServerIcon,
  CloudIcon,
  BellIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  UserPlusIcon,
  ArrowDownTrayIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("month");

  const [loading, setLoading] = useState(false);

  // filter
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("");

  const [users, setUsers] = useState(null);
  const navigate = useNavigate();

  const [topCourses, setTopCourses] = useState(null);
  const [distribution, setDistribution] = useState([]);
  const [stats, setStats] = useState(null);
  const [platformReports, setPlatformReports] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);

  // console.log(platformReports)

  const [revenueData, setRevenueData] = useState(null);
  const [userGrowthData, setUserGrowthData] = useState(null);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // filter user
  const filteredUsers = users?.filter((user) => {
    const roleMatch =
      roleFilter === "All Roles" || user.role === roleFilter.toLowerCase();

    const statusMatch =
      statusFilter === "All Status" || user.status === statusFilter;

    const dateMatch =
      !dateFilter ||
      new Date(user.createdAt).toISOString().split("T")[0] === dateFilter;

    return roleMatch && statusMatch && dateMatch;
  });

  // console.log(stats)
  // Platform Statistics
  const platformStats = [
    {
      label: "Total Users",
      value: stats?.users?.total,
      change:
        stats?.users?.growthPercent < 0
          ? stats?.users?.growthPercent
          : "+" + stats?.users?.growthPercent,
      trend: stats?.users?.growthPercent >= 0 ? "up" : "down",
      icon: UserGroupIcon,
      color: "blue",
      details: `Active: ${stats?.users?.active} | New: ${stats?.users?.newThisMonth}`,
    },
    {
      label: "Active Courses",
      value: stats?.courses?.total,
      change:
        stats?.courses?.growthPercent < 0
          ? stats?.courses?.growthPercent
          : "+" + stats?.courses?.growthPercent,
      trend: stats?.courses?.growthPercent >= 0 ? "up" : "down",
      icon: AcademicCapIcon,
      color: "green",
      details: `Published: ${stats?.courses?.published} | Draft:  ${stats?.courses?.draft}`,
    },
    {
      label: "Total Revenue",
      value: stats?.revenue?.total,
      change:
        stats?.revenue?.growthPercent < 0
          ? stats?.revenue?.growthPercent
          : "+" + stats?.revenue?.growthPercent,
      trend: stats?.revenue?.growthPercent >= 0 ? "up" : "down",
      icon: CurrencyDollarIcon,
      color: "purple",
      details: `This month: ${stats?.revenue?.thisMonth}`,
    },
    {
      label: "Avg. Rating",
      value: stats?.rating?.avgRating,
      change:
        stats?.rating?.growthPercent < 0
          ? stats?.rating?.growthPercent
          : "+" + stats?.rating?.growthPercent,
      trend: stats?.rating?.growthPercent >= 0 ? "up" : "down",
      icon: ChartBarIcon,
      color: "yellow",
      details: `Reviews: ${stats?.rating?.totalReviews}`,
    },
    {
      label: "Pending Approvals",
      value: stats?.pendingApprovals?.pendingApprovals,
      change:
        stats?.pendingApprovals?.growthPercent < 0
          ? stats?.pendingApprovals?.growthPercent
          : "+" + stats?.pendingApprovals?.growthPercent,

      trend: stats?.pendingApprovals?.growthPercent >= 0 ? "up" : "down",
      icon: ShieldCheckIcon,
      color: "orange",
      details: `Courses: ${stats?.pendingApprovals?.courses} | Instructors: ${stats?.pendingApprovals?.instructors} `,
    },
    {
      label: "System Health",
      value: stats?.systemHealth?.percent,
      change:
        stats?.systemHealth?.growthPercent < 0
          ? stats?.systemHealth?.growthPercent
          : "+" + stats?.systemHealth?.growthPercent,
      trend: stats?.systemHealth?.growthPercent >= 0 ? "up" : "down",
      icon: ServerIcon,
      color: "green",
      details: `Uptime: ${stats?.systemHealth?.uptimeDays}`,
    },
  ];

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      user: "Alex Johnson",
      action: "completed course",
      course: "React Masterclass",
      time: "2 hours ago",
      type: "success",
      icon: CheckCircleIcon,
    },
    {
      id: 2,
      user: "Emma Davis",
      action: "purchased course",
      course: "Python Data Science",
      time: "4 hours ago",
      type: "info",
      icon: CreditCardIcon,
    },
    {
      id: 3,
      user: "Sarah Miller",
      action: "reported content",
      course: "Node.js Backend",
      time: "1 day ago",
      type: "warning",
      icon: ExclamationTriangleIcon,
    },
    {
      id: 4,
      user: "Mike Chen",
      action: "applied as instructor",
      course: "",
      time: "2 days ago",
      type: "info",
      icon: UserPlusIcon,
    },
    {
      id: 5,
      user: "John Wilson",
      action: "requested refund",
      course: "Web Development",
      time: "3 days ago",
      type: "danger",
      icon: CurrencyDollarIcon,
    },
  ];

  // api calling top courses
  useEffect(() => {
    const getTopCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/top-courses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        // console.log(res.data.data);
        setTopCourses(res?.data?.data);
      } catch (error) {}
    };
    getTopCourses();
  }, []);

  // Pending Approvals
  const pendingApprovals = [
    {
      id: 1,
      type: "course",
      title: "Advanced React Patterns",
      instructor: "Sarah Johnson",
      submitted: "2 days ago",
      status: "pending",
      category: "Web Development",
    },
    {
      id: 2,
      type: "instructor",
      name: "Michael Chen",
      email: "michael@example.com",
      submitted: "1 day ago",
      status: "pending",
      specialty: "Data Science",
    },
    {
      id: 3,
      type: "course",
      title: "Machine Learning Basics",
      instructor: "David Wilson",
      submitted: "3 days ago",
      status: "pending",
      category: "AI/ML",
    },
    {
      id: 4,
      type: "refund",
      title: "Course Refund Request",
      student: "Lisa Brown",
      submitted: "4 hours ago",
      status: "pending",
      amount: "$89.99",
    },
  ];

  // System Health
  const systemHealth = [
    { component: "Web Server", status: "optimal", value: 98, color: "green" },
    { component: "Database", status: "healthy", value: 95, color: "green" },
    { component: "API Gateway", status: "stable", value: 99, color: "green" },
    { component: "Storage", status: "warning", value: 78, color: "yellow" },
    { component: "Cache", status: "optimal", value: 92, color: "green" },
    { component: "CDN", status: "healthy", value: 96, color: "green" },
  ];

  // get all users api calling

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUsers(res?.data?.users);
        // console.log(res?.data?.users);
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();
  }, []);

  // handleDeleteUser api calling
  const handleDeleteUser = async (userId) => {
    try {
      const deleteUser = await axios.delete(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // console.log(deleteUser?.data.message);
      alert(deleteUser?.data?.message);
      // Remove deleted user from state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.log(error);
    }
  };

  // User Management Data
  // const users = [
  //   { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'student', status: 'active', joinDate: '2024-01-15', lastLogin: '2 hours ago' },
  //   { id: 2, name: 'Sarah Miller', email: 'sarah@example.com', role: 'instructor', status: 'active', joinDate: '2024-01-10', lastLogin: '1 day ago' },
  //   { id: 3, name: 'Mike Chen', email: 'mike@example.com', role: 'student', status: 'inactive', joinDate: '2024-01-05', lastLogin: '1 week ago' },
  //   { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'admin', status: 'active', joinDate: '2024-01-01', lastLogin: '3 hours ago' },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/chart-stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        // console.log(res)

        const revenueApi = res?.data?.data?.revenueData;
        const usersApi = res?.data?.data?.userGrowthData;

        // Convert month number to month name
        setRevenueData({
          labels: revenueApi?.map((item) => monthNames[item._id - 1]),
          datasets: [
            {
              label: "Revenue (₹)",
              data: revenueApi?.map((item) => item?.totalRevenue),
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              fill: true,
              tension: 0.4,
            },
          ],
        });

        setUserGrowthData({
          labels: usersApi?.map((item) => monthNames[item._id - 1]),
          datasets: [
            {
              label: "New Users",
              data: usersApi.map((item) => item.newUsers),
              backgroundColor: "rgba(34, 197, 94, 0.6)",
              borderColor: "rgb(34, 197, 94)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchData();
  }, []);

  // // Chart Data
  // const revenueData = {
  //   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  //   datasets: [
  //     {
  //       label: "Revenue ($)",
  //       data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
  //       borderColor: "rgb(59, 130, 246)",
  //       backgroundColor: "rgba(59, 130, 246, 0.1)",
  //       fill: true,
  //       tension: 0.4,
  //     },
  //   ],
  // };

  // const userGrowthData = {
  //   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  //   datasets: [
  //     {
  //       label: "New Users",
  //       data: [500, 800, 1200, 1500, 1800, 2200, 2500],
  //       backgroundColor: "rgba(34, 197, 94, 0.6)",
  //       borderColor: "rgb(34, 197, 94)",
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // fetching admin dashboard

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/dashboard-stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        // console.log(res.data.data);
        setStats(res?.data?.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // fetching platformReports api
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/platform-reports",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        // console.log(res?.data?.data);
        setPlatformReports(res?.data?.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // fetching system status  api
  useEffect(() => {
    const fetchSystemStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/system-status",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setSystemStatus(res?.data?.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        setLoading(false);
      }
    };

    fetchSystemStats();
  }, []);

  // course pie chart distribution
  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/course-distribution/category",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setDistribution(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDistribution();
  }, []);

  // pie chart data setting
  const courseDistributionData = {
    labels: distribution?.map((item) => item?._id),
    datasets: [
      {
        data: distribution?.map((item) => item?.count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(139, 92, 246)",
          "rgb(239, 68, 68)",
          "rgb(236, 72, 153)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
  };

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

  const handleApprove = (id) => {
    alert(`Approved item ${id}`);
  };

  const handleReject = (id) => {
    alert(`Rejected item ${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-lg border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Tabs */}
          <div className="mt-6">
            <div className="flex space-x-1 overflow-x-auto pb-2">
              {[
                "overview",
                "users",
                "courses",
                "reports",
                "settings",
                "system",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              {platformStats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                    <div
                      className={`flex items-center text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {stat.details}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Revenue Chart */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Revenue Overview
                  </h2>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
                <div className="h-64">
                  {revenueData && (
                    <Line data={revenueData} options={chartOptions} />
                  )}
                </div>
              </motion.div>

              {/* User Growth Chart */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  User Growth
                </h2>
                <div className="h-64">
                  {userGrowthData && (
                    <Bar data={userGrowthData} options={chartOptions} />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Pending Approvals */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <ShieldCheckIcon className="h-6 w-6 text-orange-500 mr-2" />
                    Pending Approvals
                  </h2>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                    {pendingApprovals.length} pending
                  </span>
                </div>

                <div className="space-y-4">
                  {pendingApprovals.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gradient-to-r from-orange-50 to-white rounded-xl border border-orange-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center mb-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium mr-2 ${
                                item.type === "course"
                                  ? "bg-blue-100 text-blue-800"
                                  : item.type === "instructor"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {item.type.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              Submitted {item.submitted}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900">
                            {item.title || item.name}
                          </h4>
                          {item.instructor && (
                            <p className="text-sm text-gray-600">
                              by {item.instructor}
                            </p>
                          )}
                          {item.email && (
                            <p className="text-sm text-gray-600">
                              {item.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-600">
                          {item.category ||
                            item.specialty ||
                            `Amount: ${item.amount}`}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activities */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Recent Activities
                </h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-2 rounded-lg mr-3 ${
                            activity.type === "success"
                              ? "bg-green-100"
                              : activity.type === "warning"
                                ? "bg-yellow-100"
                                : activity.type === "danger"
                                  ? "bg-red-100"
                                  : "bg-blue-100"
                          }`}
                        >
                          <activity.icon
                            className={`h-5 w-5 ${
                              activity.type === "success"
                                ? "text-green-600"
                                : activity.type === "warning"
                                  ? "text-yellow-600"
                                  : activity.type === "danger"
                                    ? "text-red-600"
                                    : "text-blue-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">
                              {activity.user}
                            </span>
                            <span className="text-xs text-gray-500">
                              {activity.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.action}
                            {activity.course && (
                              <span className="font-medium">
                                {" "}
                                "{activity.course}"
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* System Health */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <ServerIcon className="h-6 w-6 text-blue-500 mr-2" />
                  System Health
                </h2>
                <div className="space-y-4">
                  {systemHealth.map((component, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>{component.component}</span>
                        <span className="font-medium">{component.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${component.value}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-2 rounded-full ${
                            component.color === "green"
                              ? "bg-green-500"
                              : component.color === "yellow"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            component.status === "optimal"
                              ? "bg-green-100 text-green-800"
                              : component.status === "healthy"
                                ? "bg-green-100 text-green-800"
                                : component.status === "stable"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {component.status}
                        </span>
                        <span className="text-gray-500">
                          {component.value >= 90
                            ? "Excellent"
                            : component.value >= 80
                              ? "Good"
                              : "Needs Attention"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                User Management
              </h2>
              <button 
               onClick={()=>{
              navigate("/user-add")
             }}
              className="btn-primary flex items-center">
                <UserPlusIcon 
                className="h-5 w-5 mr-2" />
                Add User
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option>All Roles</option>
                  <option>Student</option>
                  <option>Instructor</option>
                  <option>Admin</option>
                </select>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers?.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user?.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user?.role === "instructor"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user?.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user?.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user?.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user?.lastLogin
                          ? formatDistanceToNow(new Date(user.lastLogin), {
                              addSuffix: true,
                            })
                          : "Never logged in"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon
                              onClick={() => {
                                navigate(`/user/${user?._id}`);
                              }}
                              className="h-5 w-5"
                            />
                          </button>
                          <button
                            onClick={() => {
                              navigate(`/user/edit/${user?._id}`);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              const sure = confirm(
                                "Are you sure you want to delete this user?",
                              );
                              if (sure) {
                                handleDeleteUser(user?._id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "courses" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Course Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats?.courses?.total}
                </div>
                <div className="text-gray-600">Total Courses</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats?.courses?.published}
                </div>
                <div className="text-gray-600">Published Courses</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {stats?.courses?.pendingApproval}
                </div>
                <div className="text-gray-600">Pending Approval</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats?.courses?.avgRating}
                </div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>

            {/* Course Distribution Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Course Distribution
                </h2>
                <div className="h-64">
                  <Pie data={courseDistributionData} options={chartOptions} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Top Performing Courses
                </h2>
                <div className="space-y-4">
                  {/* {[
                    {
                      title: "React Masterclass",
                      revenue: "$24,580",
                      students: 1245,
                      rating: 4.9,
                    },
                    {
                      title: "Python Data Science",
                      revenue: "$18,450",
                      students: 985,
                      rating: 4.8,
                    },
                    {
                      title: "UI/UX Design",
                      revenue: "$15,620",
                      students: 756,
                      rating: 4.7,
                    },
                    {
                      title: "Node.js Backend",
                      revenue: "$12,340",
                      students: 612,
                      rating: 4.6,
                    },
                  ]; */}
                  {topCourses?.map((course, index) => (
                    <div
                      key={course?._id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-gray-900">
                          {course?.title}
                        </h3>
                        <span className="text-lg font-bold text-blue-600">
                          ₹{course?.revenue}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{course?.totalStudents} students</span>
                        <span>Rating: {course?.rating}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "reports" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Platform Reports
                </h2>
                <button className="btn-secondary flex items-center">
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Export Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹ {platformReports?.platformReports?.totalRevenue}
                  </div>
                  <div className="text-gray-600">Total Revenue</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {" "}
                    {platformReports?.platformReports?.totalUsers}
                  </div>
                  <div className="text-gray-600">Total Users</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {" "}
                    {platformReports?.platformReports?.userRetention}%
                  </div>
                  <div className="text-gray-600">User Retention</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {platformReports?.platformReports?.avgSatisfaction}/5
                  </div>
                  <div className="text-gray-600">Avg. Satisfaction</div>
                </div>
              </div>

              {/* Report Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Financial Reports
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span>Monthly Revenue</span>
                      <span className="font-semibold">
                        ₹{platformReports?.financialReports?.monthlyRevenue}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Course Sales</span>
                      <span className="font-semibold">
                        {platformReports?.financialReports?.courseSales}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Refund Rate</span>
                      <span className="font-semibold text-green-600">
                        {platformReports?.financialReports?.refundRate}%
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-4">
                    User Engagement
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span>Active Users</span>
                      <span className="font-semibold">
                        {platformReports?.userEngagement?.activeUsers}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Avg. Session Time</span>
                      <span className="font-semibold">
                        {platformReports?.userEngagement?.avgSessionTime}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Completion Rate</span>
                      <span className="font-semibold text-green-600">
                        {platformReports?.userEngagement?.completionRate}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Platform Settings
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* General Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Cog6ToothIcon className="h-5 w-5 mr-2" />
                  General Settings
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    defaultValue="EduPlatform"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Currency
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600"
                      defaultChecked
                    />
                    <span className="ml-2 text-gray-700">
                      Enable user registration
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600"
                      defaultChecked
                    />
                    <span className="ml-2 text-gray-700">
                      Require email verification
                    </span>
                  </label>
                </div>
              </div>

              {/* Payment Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Payment Settings
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stripe API Key
                  </label>
                  <input
                    type="password"
                    placeholder="sk_live_..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="15"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button className="btn-primary px-8">Save Settings</button>
            </div>
          </motion.div>
        )}

        {activeTab === "system" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* System Monitoring */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <CircleStackIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Database Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Connection Pool</span>
                      <span>
                        {systemStatus?.databaseStatus?.connectionPool}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: systemStatus?.databaseStatus?.poolPercent,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Query Performance</span>
                      <span>{systemStatus?.databaseStatus?.avgQueryTime}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: systemStatus?.databaseStatus?.queryTimePercent,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <CloudIcon className="h-5 w-5 mr-2 text-purple-500" />
                  Server Resources
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>CPU Usage</span>
                      <span>{systemStatus?.serverResources?.cpuUsage}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: systemStatus?.serverResources?.cpuUsage,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Memory</span>
                      <span>{systemStatus?.serverResources?.memory}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: systemStatus?.serverResources?.memoryPercent,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-green-500" />
                  System Logs
                </h3>
                <div className="space-y-3">
                  <div className="text-sm">
            
{systemStatus?.systemLogs?.length > 0 ? (
  systemStatus.systemLogs.map((log) => (
    <div
      key={log?.task + log?.time}
      className="flex justify-between py-1"
    >
      <span className="text-red-600">{log?.task}</span>
      <span className="text-red-600">{log?.time}</span>
    </div>
  ))
) : (
<div className="text-gray-500 text-center py-4">
  System is running smoothly. No alerts at the moment.
</div>
)}
                  </div>
                </div>
              </div>
            </div>

            {/* System Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                System Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                  <div className="text-center">
                    <CloudIcon className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-medium">Backup Now</div>
                  </div>
                </button>
                <button className="p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors">
                  <div className="text-center">
                    <ServerIcon className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-medium">Clear Cache</div>
                  </div>
                </button>
                <button className="p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors">
                  <div className="text-center">
                    <CircleStackIcon className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-medium">Optimize DB</div>
                  </div>
                </button>
                <button className="p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors">
                  <div className="text-center">
                    <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-medium">Emergency Mode</div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
