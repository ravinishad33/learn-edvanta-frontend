import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
} from "lucide-react";
import CourseCard from "../components/Layout/CourseCard ";
import CourseTable from "../components/Layout/CourseTable";
import RoleBasedView from "../components/Layout/RoleBasedView";
import axios from "axios";
import { useSelector } from "react-redux";
// import { useAuth } from '../contexts/AuthContext';

const MyCourses = () => {
  //   const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const [instructorCourse, setInstructorCourse] = useState([]);
  const [studentCourse, setStudentCourse] = useState([]);
  const [adminCourse, setAdminCourse] = useState([]);

  const user = useSelector((state) => state?.auth?.user);

  const [role, setRole] = useState(user?.role);

  const [instructorStats, setInstructorStats] = useState([]);
  const [studentStats, setStudentStats] = useState([]);
  const [adminStats, setAdminStats] = useState([]);

  const navigate = useNavigate();

  // calling to get all instructor  courses
  useEffect(() => {
    const getInstructorCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/course/instructor",
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
  }, []);





  // calling to get all student enrolled  courses
  useEffect(() => {
    const getStudentCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/student/enrolled-courses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        // console.log(res?.data.courses);
        setStudentCourse(res?.data?.courses);
      } catch (error) {
        console.log(error);
      }
    };
    getStudentCourses();
  }, []);






  
  useEffect(() => {
    const getStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (role !== "instructor") {
          return;
        }
        const statsRes = await axios.get(
          "http://localhost:5000/api/instructor/stats",
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

  //  to get student stats
  useEffect(() => {
    const getStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (role !== "student") {
          return;
        }

        const statsRes = await axios.get(
          "http://localhost:5000/api/student/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ correct string format
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

  //  to get admin stats
  useEffect(() => {
    const getStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (role !== "admin") {
          return;
        }
        const statsRes = await axios.get(
          "http://localhost:5000/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ correct string format
            },
          },
        );

        if (statsRes?.data?.success) {
          setAdminStats(statsRes?.data?.stats);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      }
    };

    getStats();
  }, []);

  // Mock data - replace with API calls
  const coursesData = {
    student: [
      {
        id: 1,
        title: "Introduction to React",
        instructor: "John Doe",
        progress: 75,
        status: "In Progress",
        category: "Frontend",
        enrolledDate: "2024-01-15",
        nextLesson: "State Management",
        deadline: "2024-03-30",
        color: "bg-blue-100",
      },
      {
        id: 2,
        title: "Advanced JavaScript",
        instructor: "Jane Smith",
        progress: 100,
        status: "Completed",
        category: "Programming",
        enrolledDate: "2024-01-10",
        nextLesson: null,
        deadline: "2024-02-28",
        color: "bg-green-100",
      },
    ],
    instructor: [
      {
        id: 1,
        title: "React Fundamentals",
        students: 45,
        published: true,
        rating: 4.8,
        lessons: 12,
        revenue: 2450,
        createdDate: "2024-01-05",
        category: "Frontend",
      },
      {
        id: 2,
        title: "Node.js Backend",
        students: 32,
        published: false,
        rating: 4.5,
        lessons: 15,
        revenue: 1800,
        createdDate: "2024-01-20",
        category: "Backend",
      },
    ],
    admin: [
      {
        id: 1,
        title: "React Masterclass",
        instructor: "John Doe",
        students: 120,
        status: "Active",
        category: "Frontend",
        revenue: 12000,
        createdAt: "2024-01-01",
        rating: 4.9,
      },
      {
        id: 2,
        title: "Python for Beginners",
        instructor: "Alice Johnson",
        students: 85,
        status: "Pending",
        category: "Programming",
        revenue: 8500,
        createdAt: "2024-01-10",
        rating: 4.7,
      },
    ],
  };

  const stats = {
    student: [
      {
        label: "Total Courses",
        value: studentStats?.totalCourses,
        icon: BookOpen,
        color: "bg-blue-500",
      },
      {
        label: "In Progress",
        value: studentStats?.inProgress,
        icon: Clock,
        color: "bg-yellow-500",
      },
      {
        label: "Completed",
        value: studentStats?.completed,
        icon: CheckCircle,
        color: "bg-green-500",
      },
      {
        label: "Avg. Progress",
        value: studentStats?.avgProgress,
        icon: BarChart3,
        color: "bg-purple-500",
      },
    ],

    instructor: [
      {
        label: "Total Courses",
        value: instructorStats?.totalCourses,
        icon: BookOpen,
        color: "bg-blue-500",
      },
      {
        label: "Published",
        value: instructorStats?.totalPublished,
        icon: CheckCircle,
        color: "bg-green-500",
      },
      {
        label: "Total Students",
        value: instructorStats?.totalStudents,
        icon: Users,
        color: "bg-orange-500",
      },
      {
        label: "Total Revenue",
        value: "₹" + instructorStats?.totalRevenue,
        icon: BarChart3,
        color: "bg-purple-500",
      },
    ],
    admin: [
      {
        label: "Total Courses",
        value: adminStats?.totalCourses || 0,
        icon: BookOpen,
        color: "bg-blue-500",
      },
      {
        label: "Active Courses",
        value: adminStats?.activeCourses || 0,
        icon: CheckCircle,
        color: "bg-green-500",
      },
      {
        label: "Total Students",
        value: adminStats?.totalStudents || 0,
        icon: Users,
        color: "bg-orange-500",
      },
      {
        label: "Total Revenue",
        value: "₹" + (adminStats?.totalRevenue || 0),
        icon: BarChart3,
        color: "bg-purple-500",
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

    // console.log(courses)

    // Apply search filter
    if (searchTerm) {
      courses = courses?.filter(
        (course) =>
          course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course?.category?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Apply role-based status filter
    if (activeTab !== "all") {
      courses = courses?.filter((course) => {
        if (role === "instructor") {
          return (
            course?.visibility?.toLowerCase() === activeTab.toLowerCase() ||
            (activeTab === "published" && course?.visibility === "public") ||
            (activeTab === "draft" && course?.visibility === "draft") ||
            (activeTab === "private" && course?.visibility === "private")
          );
        } else if (role === "student") {
          return course?.status?.toLowerCase() === activeTab.toLowerCase();
        } else if (role === "admin") {
          return course?.status?.toLowerCase() === activeTab.toLowerCase();
        }
        return true; // fallback
      });
    }

    return courses;
  };

  const handleCreateCourse = () => {
    navigate("/createcourse");
  };

  const tabs = {
    student: ["all", "in progress", "completed"],
    instructor: ["all", "published", "draft", "private"],
    admin: ["all", "active", "pending", "archived"],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {role === "student"
                  ? "My Learning"
                  : role === "instructor"
                    ? "My Courses"
                    : "Course Management"}
              </h1>
              <p className="text-gray-600 mt-2">
                {role === "student"
                  ? "Track your learning progress and access your courses"
                  : role === "instructor"
                    ? "Manage and create your courses"
                    : "Manage all courses in the platform"}
              </p>
            </div>

            <RoleBasedView
              role={role}
              student={null}
              instructor={
                <button
                  onClick={handleCreateCourse}
                  className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <PlusCircle size={20} />
                  Create New Course
                </button>
              }
              admin={
                <button
                  onClick={() => navigate("/admin/courses/import")}
                  className="mt-4 md:mt-0 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Download size={20} />
                  Bulk Import
                </button>
              }
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats[role]?.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {tabs[role]?.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition ${
                      activeTab === tab
                        ? "bg-white text-blue-600 shadow"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow" : ""}`}
                >
                  <div className="grid grid-cols-2 gap-1 w-6 h-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-400 rounded-sm"></div>
                    ))}
                  </div>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow" : ""}`}
                >
                  <div className="space-y-1 w-6 h-6">
                    <div className="bg-gray-400 h-1 rounded"></div>
                    <div className="bg-gray-400 h-1 rounded"></div>
                    <div className="bg-gray-400 h-1 rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Content */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredCourses()?.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                role={role}
                // role={"instructor"}
                // role={"student"}
                // onEdit={() => navigate(`/courses/${course.id}/edit`)}
                onEdit={() => navigate(`/mycourses/edit`)}
                onDelete={() => console.log("Delete", course.id)}
                onView={() => navigate(`/courses/${course.id}`)}
              />
            ))}
          </div>
        ) : (
          <CourseTable
            courses={getFilteredCourses()}
            role={role}
            // role={"instructor"}
            onEdit={(id) => navigate(`/courses/${id}/edit`)}
            onDelete={(id) => console.log("Delete", id)}
            onView={(id) => navigate(`/courses/${id}`)}
          />
        )}

        {/* Empty State */}
        {getFilteredCourses()?.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : role === "student"
                  ? "Enroll in courses to get started"
                  : role === "instructor"
                    ? "Create your first course"
                    : "No courses in the system"}
            </p>

            <RoleBasedView
              student={
                <button
                  onClick={() => navigate("/courses")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Browse Courses
                </button>
              }
              instructor={
                <button
                  onClick={handleCreateCourse}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Create First Course
                </button>
              }
              admin={null}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
