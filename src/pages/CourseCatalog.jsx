import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NewCoursesCounter from "../components/Layout/NewCoursesCounter";
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  ClockIcon,
  PlayCircleIcon,
  HeartIcon,
  ArrowRightIcon,
  BookOpenIcon,
  FireIcon,
  CheckBadgeIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

// Skeleton Component
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col animate-pulse">
    <div className="h-44 sm:h-48 md:h-52 bg-slate-200" />
    <div className="p-4 md:p-5 flex flex-col flex-grow space-y-4">
      <div className="h-5 bg-slate-200 rounded-md w-3/4" />
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-slate-200" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
      </div>
      <div className="flex gap-3">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-4 bg-slate-200 rounded w-1/4" />
      </div>
      <div className="pt-4 border-t border-gray-100 mt-auto flex justify-between items-center">
        <div className="h-6 bg-slate-200 rounded-full w-20" />
        <div className="h-6 bg-slate-200 rounded w-16" />
      </div>
      <div className="h-12 bg-slate-200 rounded-xl w-full mt-2" />
    </div>
  </div>
);

const CourseCatalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [course, setCourse] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [newlyAddedCount, setNewlyAddedCount] = useState(0);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const reduxUser = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/enrollments/my`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const enrolledIds = res.data.map((item) =>
          typeof item.courseId === "object"
            ? item.courseId?._id?.toString()
            : item.courseId?.toString(),
        );
        setEnrolledCourses(enrolledIds);
      } catch (error) {
        console.log(
          error.response?.data?.message || error.response?.data?.error,
        );
      }
    };
    fetchEnrollments();
  }, [apiUrl]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) setSearchQuery(query);
  }, [location.search]);

  const handleEnroll = async (courseId) => {
    navigate(`/course/${courseId}`);
  };

  useEffect(() => {
    const getCategory = async () => {
      try {
        const categoryRes = await axios.get(`${apiUrl}/api/category/active`);
        setCategories([{ _id: "all", name: "All" }, ...categoryRes?.data]);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    getCategory();
  }, [apiUrl]);

  useEffect(() => {
    const getAllPublishedCourses = async () => {
      try {
        setLoading(true); // Start Skeleton
        const courseRes = await axios.get(`${apiUrl}/api/course/published`);
        setCourse(courseRes?.data?.courses);
        setNewlyAddedCount(courseRes?.data?.newCoursesCount);
      } catch (error) {
        console.log("error to fetch course ", error);
      } finally {
        setLoading(false); // Stop Skeleton
      }
    };
    getAllPublishedCourses();
  }, [apiUrl]);

  const filteredCourses = course.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course?.instructor?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category.name === selectedCategory;
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "free"
        ? course?.priceType === "free"
        : course?.priceType === "paid");
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 scroll-smooth">
      {/* Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.2),transparent_50%)]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-18">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            {newlyAddedCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg">
                <FireIcon className="h-5 w-5 text-orange-400" />
                
                  <NewCoursesCounter newlyAddedCount={newlyAddedCount} />
             
              </div>
            </motion.div>
               )}

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Discover Your Next
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Skill
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-8 md:mb-10 px-4">
              Learn from industry experts and transform your career with our
              premium courses
            </p>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-2xl mx-auto px-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20" />
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
                <MagnifyingGlassIcon className="ml-4 md:ml-6 h-5 w-5 md:h-6 md:w-6 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search courses, instructors..."
                  className="w-full px-3 md:px-4 py-4 md:py-5 text-gray-900 focus:outline-none text-base md:text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="mr-2 px-4 md:px-6 py-2.5 md:py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors text-sm md:text-base whitespace-nowrap">
                  Search
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Filters - Responsive */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between md:hidden mb-3">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>Filters</span>
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium"
            >
              {isFilterOpen ? "Hide" : "Show"} Filters
            </button>
          </div>

          <div className={`${isFilterOpen ? "block" : "hidden"} md:block`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <div className="hidden md:flex items-center gap-2 text-gray-700 font-semibold mr-2">
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  <span>Categories:</span>
                </div>
                <div className="flex gap-2">
                  {categories?.map((category) => (
                    <button
                      key={category._id}
                      onClick={() =>
                        setSelectedCategory(
                          category.name === "All" ? "all" : category.name,
                        )
                      }
                      className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                        (
                          category.name === "All"
                            ? selectedCategory === "all"
                            : selectedCategory === category.name
                        )
                          ? "bg-gray-900 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3">
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="px-3 md:px-4 py-2 rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 text-xs md:text-sm font-medium"
                >
                  <option value="all">All Prices</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
                <div className="text-xs md:text-sm text-gray-500 font-medium whitespace-nowrap">
                  {loading ? "..." : filteredCourses.length} courses
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={loading ? "loading" : "grid"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6"
          >
            {loading
              ? // Lazy Loading Skeleton State
                [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              : filteredCourses?.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    onMouseEnter={() => setHoveredCard(course?._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="group relative bg-white rounded-2xl md:rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col"
                  >
                    {/* Image Container */}
                    <div className="relative h-44 sm:h-48 md:h-52 overflow-hidden">
                      <Link
                        to={`/course/${course._id}`}
                        className="block w-full h-full"
                      >
                        <motion.img
                          src={course?.thumbnail?.url}
                          alt={course?.title}
                          className="w-full h-full object-cover"
                          animate={{
                            scale: hoveredCard === course?._id ? 1.08 : 1,
                          }}
                          transition={{ duration: 0.6 }}
                        />
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Badges */}
                      <div className="absolute top-2 md:top-3 left-2 md:left-3 flex flex-col gap-1.5 md:gap-2">
                        <span className="px-2 md:px-3 py-1 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] md:text-xs font-bold rounded-md md:rounded-lg shadow-sm">
                          {course?.category?.name}
                        </span>
                        {course?.priceType === "free" && (
                          <span className="px-2 md:px-3 py-1 bg-green-500 text-white text-[10px] md:text-xs font-bold rounded-md md:rounded-lg shadow-sm">
                            FREE
                          </span>
                        )}
                        {course?.discountPrice > 0 && (
                          <span className="px-2 md:px-3 py-1 bg-red-500 text-white text-[10px] md:text-xs font-bold rounded-md md:rounded-lg shadow-sm flex items-center gap-1">
                            <FireIcon className="h-3 w-3" /> SALE
                          </span>
                        )}
                      </div>

                      <button className="absolute top-2 md:top-3 right-2 md:right-3 p-1.5 md:p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                        <HeartIcon className="h-4 w-4 md:h-5 md:w-5" />
                      </button>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: hoveredCard === course._id ? 1 : 0,
                          scale: hoveredCard === course._id ? 1 : 0.8,
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <button
                          onClick={() =>
                            setPreviewVideoUrl(course?.promotionalVideo?.url)
                          }
                          className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 bg-white/95 backdrop-blur-md rounded-full text-gray-900 font-semibold shadow-xl hover:scale-105 transition-transform text-xs md:text-sm"
                        >
                          <PlayCircleIcon className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                          Preview
                        </button>
                      </motion.div>

                      <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 px-2 md:px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-[10px] md:text-xs rounded-md flex items-center gap-1">
                        <VideoCameraIcon className="h-3 w-3" />
                        {course?.totalDuration || "10h"}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-5 flex flex-col flex-grow">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2 leading-tight">
                        {course?.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {course?.instructor?.name?.charAt(0) || "I"}
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 truncate">
                          {course?.instructor?.name}
                        </p>
                        <CheckBadgeIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      </div>

                      <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                        <div className="flex items-center gap-1">
                          <StarIconSolid className="h-3.5 w-3.5 md:h-4 md:w-4 text-yellow-500" />
                          <span className="font-semibold">
                            {course?.averageRating || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UsersIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400" />
                          <span>{course?.enrolledStudents?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400" />
                          <span>{course?.totalLessons} lessons</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100 mt-auto">
                        <span
                          className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold ${
                            course?.level === "Beginner"
                              ? "bg-green-100 text-green-700"
                              : course?.level === "Intermediate"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {course?.level || "All Levels"}
                        </span>
                        <div className="text-right">
                          {course?.discountPrice > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg md:text-xl font-bold text-gray-900">
                                ₹{course?.price - course?.discountPrice}
                              </span>
                              <span className="text-xs md:text-sm text-gray-400 line-through">
                                ₹{course?.price}
                              </span>
                            </div>
                          ) : (
                            <span
                              className={`text-lg md:text-xl font-bold ${course?.priceType === "free" ? "text-green-600" : "text-gray-900"}`}
                            >
                              {course?.priceType === "free"
                                ? "Free"
                                : `₹${course?.price}`}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleEnroll(course?._id)}
                        className="w-full mt-3 md:mt-4 py-2.5 md:py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group/btn text-sm md:text-base"
                      >
                        {reduxUser?._id === course?.instructor?._id || enrolledCourses.includes(course?._id)
                          ? "View Course"
                          : course?.priceType === "free"
                            ? "Get Started"
                            : "Enroll Now"}
                        <ArrowRightIcon className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 md:py-20 px-4"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpenIcon className="h-10 w-10 md:h-12 md:w-12 text-gray-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500 mb-6 text-sm md:text-base">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setPriceFilter("all");
              }}
              className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm md:text-base"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Video Preview Modal Logic*/}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden">
            <video
              src={previewVideoUrl}
              controls
              autoPlay
              className="w-full h-full"
            />
            <button
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-full hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;