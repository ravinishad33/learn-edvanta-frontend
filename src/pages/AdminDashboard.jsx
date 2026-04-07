import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ServerIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CloudIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  TrashIcon,
  UserPlusIcon,
  CircleStackIcon,
  CurrencyRupeeIcon,
  CommandLineIcon,
  CheckBadgeIcon,
  NoSymbolIcon,
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
import toast from "react-hot-toast";
import { ClockIcon, StarIcon, UserIcon, XCircleIcon } from "lucide-react";

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
  // Add these with your other state declarations
  const [searchTerm, setSearchTerm] = useState("");
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
  const [pendingApprovals, setPendingApprovals] = useState(null);
  const [activities, setActivities] = useState([]);
  const [payments, setPayments] = useState([]);

  const [revenueData, setRevenueData] = useState(null);
  const [userGrowthData, setUserGrowthData] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
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

  // Filter users based on search, role, and date
  const filteredUsers = users?.filter((user) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase());

    // Role filter
    const matchesRole =
      roleFilter === "" ||
      roleFilter === "All Roles" ||
      user.role?.toLowerCase() === roleFilter.toLowerCase();

    // Date filter
    const matchesDate =
      !dateFilter ||
      new Date(user.createdAt).toISOString().split("T")[0] === dateFilter;

    return matchesSearch && matchesRole && matchesDate;
  });

  useEffect(() => {
    const fetchPendingCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // admin token
        const response = await axios.get(
          `${apiUrl}/api/admin/pending-courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setPendingApprovals(response?.data?.pendingApprovals || []);
      } catch (err) {
        console.error("Error fetching pending courses:", err);
        setError("Failed to load pending courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCourses();
  }, []);

  // Platform Statistics
  const platformStats = [
    {
      label: "Total Users",
      value: stats?.users?.total ?? 0,
      change:
        stats?.users?.growthPercent < 0
          ? stats?.users?.growthPercent + "%"
          : "+" + (stats?.users?.growthPercent ?? 0) + "%",
      trend: (stats?.users?.growthPercent ?? 0) >= 0 ? "up" : "down",
      icon: UserGroupIcon,
      color: "blue",
      details: `Active: ${stats?.users?.active ?? 0} | New: ${
        stats?.users?.newThisMonth ?? 0
      }`,
    },
    {
      label: "Active Courses",
      value: stats?.courses?.total ?? 0,
      change:
        stats?.courses?.growthPercent < 0
          ? stats?.courses?.growthPercent + "%"
          : "+" + (stats?.courses?.growthPercent ?? 0) + "%",
      trend: (stats?.courses?.growthPercent ?? 0) >= 0 ? "up" : "down",
      icon: AcademicCapIcon,
      color: "green",
      details: `Published: ${stats?.courses?.published ?? 0} | Draft: ${
        stats?.courses?.draft ?? 0
      }`,
    },
    {
      label: "Total Revenue",
      value: stats?.revenue?.total ?? 0,
      change:
        stats?.revenue?.growthPercent < 0
          ? stats?.revenue?.growthPercent + "%"
          : "+" + (stats?.revenue?.growthPercent ?? 0) + "%",
      trend: (stats?.revenue?.growthPercent ?? 0) >= 0 ? "up" : "down",
      icon: CurrencyRupeeIcon,
      color: "purple",
      details: `This month: ${stats?.revenue?.thisMonth ?? 0}`,
    },
    {
      label: "Avg. Rating",
      value: stats?.rating?.avgRating ?? 0,
      change:
        stats?.rating?.growthPercent < 0
          ? stats?.rating?.growthPercent + "%"
          : "+" + (stats?.rating?.growthPercent ?? 0) + "%",
      trend: (stats?.rating?.growthPercent ?? 0) >= 0 ? "up" : "down",
      icon: ChartBarIcon,
      color: "yellow",
      details: `Reviews: ${stats?.rating?.totalReviews ?? 0}`,
    },
    {
      label: "Pending Approvals",
      value: stats?.pendingApprovals?.pendingApprovals ?? 0,
      change:
        stats?.pendingApprovals?.growthPercent < 0
          ? stats?.pendingApprovals?.growthPercent + "%"
          : "+" + (stats?.pendingApprovals?.growthPercent ?? 0) + "%",
      trend: (stats?.pendingApprovals?.growthPercent ?? 0) >= 0 ? "up" : "down",
      icon: ShieldCheckIcon,
      color: "orange",
      details: `Courses: ${
        stats?.pendingApprovals?.courses ?? 0
      } | Instructors: ${stats?.pendingApprovals?.instructors ?? 0}`,
    },
    {
      label: "System Health",
      value: stats?.systemHealth?.percent ?? 0,
      change:
        stats?.systemHealth?.healthGrowthPercent < 0
          ? stats?.systemHealth?.healthGrowthPercent + "%"
          : "+" + (stats?.systemHealth?.healthGrowthPercent ?? 0) + "%",
      trend:
        (stats?.systemHealth?.healthGrowthPercent ?? 0) >= 0 ? "up" : "down",
      icon: ServerIcon,
      color: "green",
      details: `Uptime: ${stats?.systemHealth?.uptime ?? "0%"}`,
    },
  ];

  // api calling top courses
  useEffect(() => {
    const getTopCourses = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/admin/top-courses`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // console.log(res.data.data);
        setTopCourses(res?.data?.data);
      } catch (error) {}
    };
    getTopCourses();
  }, []);
  // setActivities

  const iconMap = {
    CheckCircleIcon,
    CreditCardIcon,
    UserPlusIcon,
    ExclamationTriangleIcon,
    CurrencyRupeeIcon,
  };

  const getRecentActivities = async () => {
    const token = localStorage.getItem("token");

    try {
      const activitiesRes = await axios.get(
        `${apiUrl}/api/admin/recent-activities`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const formatted = activitiesRes.data.data.map((item) => ({
        ...item,
        icon: iconMap[item.icon] || UserPlusIcon,
      }));

      setActivities(formatted);
    } catch (error) {
      console.error("Error fetching activities", error);
    }
  };

  useEffect(() => {
    getRecentActivities();
  }, []);

  // fetch all payments like recent payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        // Assuming you store your admin token in localStorage
        const token = localStorage.getItem("token");

        const response = await axios.get(`${apiUrl}/api/payment`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setPayments(response.data.payments);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [apiUrl]);

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
        const res = await axios.get(`${apiUrl}/api/admin/users`, {
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
    const loadingToast = toast.loading("Deleting user...");
    try {
      const deleteUser = await axios.delete(
        `${apiUrl}/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.dismiss(loadingToast);
      toast.success(response?.data?.message || "User deleted successfully");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      toast.dismiss(loadingToast);

      toast.error(error?.response?.data?.message || "Failed to delete user");

      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/admin/chart-stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

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

  const handleApproveCourse = async (courseId) => {
    if (!courseId) return;
    const toastId = toast.loading("Approving course...");
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${apiUrl}/api/admin/approve/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Course approved!", { id: toastId });

      // Remove approved course from pending list
      setPendingApprovals((prev) =>
        prev.filter((course) => course.id !== courseId),
      );
      fetchStats();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to approve course",
        {
          id: toastId,
        },
      );
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Course rejected!", { id: toastId });

      // Remove approved course from pending list
      setPendingApprovals((prev) =>
        prev.filter((course) => course.id !== courseId),
      );
      fetchStats();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to reject course",
        {
          id: toastId,
        },
      );
      console.error(error);
    }
  };

  // fetching admin dashboard
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/dashboard-stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStats(res?.data?.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // fetching platformReports api
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/admin/platform-reports`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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
        const res = await axios.get(`${apiUrl}/api/admin/system-status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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
          `${apiUrl}/api/admin/course-distribution/category`,
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
                // "settings",
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
              {/* pending courses for approve or reject  */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mr-2" />
                    Pending Approvals
                  </h2>

                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs sm:text-sm font-medium rounded-full">
                    {pendingApprovals?.length} pending
                  </span>
                </div>

                {/* Scrollable container */}
                <div className="space-y-3 sm:space-y-4 max-h-[420px] overflow-y-auto pr-2 scroll-smooth">
                  {pendingApprovals?.slice(0, 4).map((item) => (
                    <div
                      key={item?.id}
                      className="p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-white rounded-xl border border-orange-100 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center mb-1 flex-wrap gap-1">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              COURSE
                            </span>

                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              Submitted{" "}
                              {item?.submitted &&
                                formatDistanceToNow(new Date(item?.submitted), {
                                  addSuffix: true,
                                })}
                            </span>
                          </div>

                          <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                            {item?.title}
                          </h4>

                          {item.instructor && (
                            <p className="text-sm text-gray-600 truncate">
                              by {item?.instructor}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 sm:mt-4">
                        <span className="text-sm text-gray-600 truncate">
                          {item?.category}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveCourse(item?.id)}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs sm:text-sm"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => handleRejectCourse(item?.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs sm:text-sm"
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
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Recent Activities
                </h2>

                {/* Scrollable container */}
                <div className="space-y-3 sm:space-y-4 max-h-[420px] overflow-y-auto pr-2 scroll-smooth">
                  {activities?.map((activity, idx) => (
                    <div
                      key={idx}
                      className="p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-2 rounded-lg mr-3 flex-shrink-0 ${
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

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {activity.user}
                            </span>

                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatDistanceToNow(new Date(activity?.time), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
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

              {/* Recent Payments Section */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Recent Payments
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                    Revenue Live
                  </span>
                </div>

                {/* Scrollable container */}
                <div className="space-y-3 sm:space-y-4 max-h-[420px] overflow-y-auto pr-2 scroll-smooth custom-scrollbar">
                  {payments?.map((payment) => (
                    <div
                      key={payment?._id}
                      className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all duration-200"
                    >
                      <div className="flex items-start">
                        {/* Dynamic Status Icon Background */}
                        <div
                          className={`p-2 rounded-lg mr-3 flex-shrink-0 ${
                            payment?.status === "paid"
                              ? "bg-green-100 text-green-600"
                              : payment?.status === "failed"
                                ? "bg-red-100 text-red-600"
                                : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {payment?.status === "paid" ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : payment?.status === "failed" ? (
                            <XCircleIcon className="h-5 w-5" />
                          ) : (
                            <ClockIcon className="h-5 w-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="truncate">
                              <span className="font-bold text-gray-900 text-sm sm:text-base block truncate">
                                {payment?.student?.name || "Unknown Student"}
                              </span>
                              <span className="text-[10px] font-mono text-gray-400 uppercase">
                                {payment?.razorpayOrderId || "N/A"}
                              </span>
                            </div>
                            <div className="text-right ml-2">
                              <span className="font-black text-gray-900 text-sm sm:text-lg block">
                                ₹
                                {payment?.amount
                                  ? (payment.amount / 100).toLocaleString(
                                      "en-IN",
                                    )
                                  : "0"}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase ${
                                  payment?.status === "paid"
                                    ? "text-green-500"
                                    : "text-gray-400"
                                }`}
                              >
                                {payment?.status || "unknown"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <p className="text-xs text-gray-600 truncate">
                              Purchased:{" "}
                              <span className="font-semibold text-gray-800">
                                {payment?.course?.title || "Deleted Course"}
                              </span>
                            </p>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap italic">
                              {payment?.createdAt
                                ? formatDistanceToNow(
                                    new Date(payment.createdAt),
                                    {
                                      addSuffix: true,
                                    },
                                  )
                                : "N/A"}
                            </span>
                          </div>

                          {/* Payment Method Tag */}
                          {payment?.paymentMethod && (
                            <div className="mt-2 inline-flex items-center text-[9px] font-bold text-gray-500 bg-gray-200/50 px-2 py-0.5 rounded uppercase tracking-tighter">
                              <CreditCardIcon className="h-3 w-3 mr-1" />
                              {payment.paymentMethod}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!payments || payments?.length === 0) && (
                    <div className="text-center py-10 text-gray-400 text-sm italic">
                      No transactions recorded yet.
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}


{activeTab === "users" && (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-[2.5rem] shadow-2xl shadow-[#E6E6FA]/40 border border-slate-100 overflow-hidden"
  >
    {/* --- HEADER & TOOLBAR --- */}
    <div className="p-6 md:p-10 pb-0">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-3">
            Users
            <span className="text-sm bg-[#FAF7FF] text-[#967BB6] px-3 py-1 rounded-full border border-[#E6E6FA]">
              {filteredUsers.length} Total
            </span>
          </h2>
          <p className="text-slate-500 font-medium mt-1">Manage permissions and monitor user activity</p>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          {/* Enhanced Search */}
          <div className="relative group flex-grow lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-[#B19CD9] group-focus-within:text-[#7A589B] transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Find by name or email..."
              className="w-full pl-12 pr-12 py-3.5 bg-[#FAF7FF] border-2 border-transparent focus:border-[#E6E6FA] focus:bg-white rounded-2xl outline-none text-sm font-bold text-[#5E4B8A] transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <XMarkIcon className="h-5 w-5 text-slate-400 hover:text-red-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- QUICK FILTERS BAR --- */}
      <div className="flex flex-wrap items-center gap-3 pb-8 border-b border-slate-50">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
          <CommandLineIcon className="h-4 w-4 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-transparent text-xs font-black text-[#5E4B8A] uppercase tracking-widest outline-none cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
          <StarIcon className="h-4 w-4 text-slate-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent text-xs font-black text-[#5E4B8A] outline-none"
          />
        </div>
      </div>
    </div>

    {/* --- TABLE CONTENT --- */}
    <div className="relative overflow-hidden bg-white">
      <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
        {/* Desktop View */}
        <table className="min-w-full hidden md:table">
          <thead className="bg-[#FAF7FF]/50 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-10 py-5 text-left text-[10px] font-black text-[#967BB6] uppercase tracking-[0.2em]">Member Profile</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-[#967BB6] uppercase tracking-[0.2em]">Platform Role</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-[#967BB6] uppercase tracking-[0.2em]">Live Status</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-[#967BB6] uppercase tracking-[0.2em]">Security</th>
              <th className="px-10 py-5 text-right text-[10px] font-black text-[#967BB6] uppercase tracking-[0.2em]">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="group hover:bg-[#FAF7FF]/30 transition-all">
                <td className="px-10 py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      {user?.avatar?.url ? (
                        <img 
                          src={user.avatar.url} 
                          alt={user.name} 
                          className="h-12 w-12 rounded-2xl object-cover ring-4 ring-white shadow-md group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#E6E6FA] to-[#B19CD9] flex items-center justify-center text-white font-black text-lg ring-4 ring-white shadow-md">
                          {user?.name?.charAt(0)}
                        </div>
                      )}
                      {/* Live Indicator */}
                      {user?.lastLogin && (new Date() - new Date(user.lastLogin) < 300000) && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-black text-[#1A1A2E] truncate">{user?.name}</div>
                      <div className="text-[11px] text-slate-400 font-bold truncate group-hover:text-[#967BB6] transition-colors">{user?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    {user?.role === "admin" && <CommandLineIcon className="h-4 w-4 text-[#1A1A2E]" />}
                    {user?.role === "instructor" && <AcademicCapIcon className="h-4 w-4 text-[#967BB6]" />}
                    {user?.role === "student" && <UserIcon className="h-4 w-4 text-slate-400" />}
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${
                      user?.role === "admin" ? "text-[#1A1A2E]" : 
                      user?.role === "instructor" ? "text-[#7A589B]" : "text-slate-500"
                    }`}>
                      {user?.role}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#5E4B8A]">
                      {user?.lastLogin ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true }) : "Inactive"}
                    </span>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Last Login</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    user?.isVerified ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                  }`}>
                    {user?.isVerified ? <CheckBadgeIcon className="h-3 w-3" /> : <NoSymbolIcon className="h-3 w-3" />}
                    {user?.isVerified ? "Verified" : "Pending"}
                  </div>
                </td>
                <td className="px-10 py-5 text-right">
                  <div className="flex justify-end gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button onClick={() => navigate(`/user/${user?._id}`)} className="p-2.5 bg-white text-[#967BB6] hover:text-white hover:bg-[#967BB6] rounded-xl shadow-sm border border-slate-100 transition-all">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteUser(user?._id)} className="p-2.5 bg-white text-rose-400 hover:text-white hover:bg-rose-500 rounded-xl shadow-sm border border-slate-100 transition-all">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View - Premium Cards */}
        <div className="md:hidden space-y-4 p-4">
          {filteredUsers.map((user) => (
            <motion.div 
              key={user._id} 
              whileTap={{ scale: 0.98 }}
              className="bg-[#FAF7FF]/50 border border-[#E6E6FA] rounded-3xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                    {user?.avatar?.url ? (
                      <img src={user.avatar.url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#B19CD9] flex items-center justify-center font-black text-white text-xl">
                        {user?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-black text-[#1A1A2E] leading-tight truncate">{user?.name}</p>
                    <span className="text-[10px] font-black text-[#967BB6] uppercase tracking-[0.1em]">{user?.role}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => navigate(`/user/${user?._id}`)} className="p-3 bg-white text-[#B19CD9] rounded-2xl shadow-sm">
                      <EyeIcon className="h-6 w-6" />
                   </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 p-3 rounded-2xl border border-white">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</p>
                  <p className={`text-[11px] font-black uppercase ${user?.isVerified ? "text-green-600" : "text-rose-500"}`}>
                    {user?.isVerified ? "Verified" : "Pending"}
                  </p>
                </div>
                <div className="bg-white/60 p-3 rounded-2xl border border-white text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Last Activity</p>
                  <p className="text-[11px] font-bold text-[#5E4B8A]">
                    {user?.lastLogin ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true }) : "N/A"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- EMPTY STATE --- */}
        {filteredUsers.length === 0 && (
           <div className="py-24 text-center">
              <div className="w-24 h-24 bg-[#FAF7FF] rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-[#E6E6FA]">
                 <UserCircleIcon className="h-12 w-12 text-[#B19CD9]" />
              </div>
              <h3 className="text-xl font-black text-[#1A1A2E]">No Members Found</h3>
              <p className="text-slate-400 text-sm mt-1">Adjust your search or filters to see results</p>
           </div>
        )}
      </div>
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
                  {stats?.rating?.avgRating}
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
                  {/* top performing courses  */}
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
                          ₹ {course?.revenue?.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{course?.totalStudents} students</span>
                        <span>Rating: {course?.avgRating || 0}/5</span>
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
                {/* <button className="btn-secondary flex items-center">
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Export Report
                </button> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{" "}
                    {(platformReports?.platformReports?.totalRevenue).toLocaleString(
                      "en-IN",
                    )}
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
                    {platformReports?.platformReports?.userRetention}
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
                        ₹
                        {platformReports?.financialReports?.monthlyRevenue.toLocaleString(
                          "en-IN",
                        )}
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
                        {platformReports?.financialReports?.refundRate}
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
                        {platformReports?.platformReports?.activeUsers}
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
            {/* <div className="bg-white rounded-2xl shadow-lg p-6">
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
            </div> */}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
