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
  <div className="bg-white rounded-[2rem] shadow-sm border border-[#E6E6FA] overflow-hidden flex flex-col animate-pulse">
    <div className="h-44 sm:h-48 md:h-52 bg-[#FAF7FF]" />
    <div className="p-4 md:p-5 flex flex-col flex-grow space-y-4">
      <div className="h-5 bg-[#FAF7FF] rounded-md w-3/4" />
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#FAF7FF]" />
        <div className="h-3 bg-[#FAF7FF] rounded w-1/2" />
      </div>
      <div className="flex gap-3">
        <div className="h-4 bg-[#FAF7FF] rounded w-1/4" />
        <div className="h-4 bg-[#FAF7FF] rounded w-1/4" />
      </div>
      <div className="pt-4 border-t border-[#FAF7FF] mt-auto flex justify-between items-center">
        <div className="h-6 bg-[#FAF7FF] rounded-full w-20" />
        <div className="h-6 bg-[#FAF7FF] rounded w-16" />
      </div>
      <div className="h-12 bg-[#FAF7FF] rounded-xl w-full mt-2" />
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
        console.log(error.response?.data?.message || error.response?.data?.error);
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
        setLoading(true);
        const courseRes = await axios.get(`${apiUrl}/api/course/published`);
        setCourse(courseRes?.data?.courses);
        setNewlyAddedCount(courseRes?.data?.newCoursesCount);
      } catch (error) {
        console.log("error to fetch course ", error);
      } finally {
        setLoading(false);
      }
    };
    getAllPublishedCourses();
  }, [apiUrl]);

  const filteredCourses = course.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course?.instructor?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category.name === selectedCategory;
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "free" ? course?.priceType === "free" : course?.priceType === "paid");
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#FAF7FF] via-white to-[#E6E6FA] scroll-smooth font-sans">
      
      {/* Hero Section */}
      <div className="relative bg-[#1A1A2E] overflow-hidden rounded-b-[3rem] sm:rounded-b-[5rem] shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(177,156,217,0.15),transparent_50%)]" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#B19CD9]/20 rounded-full blur-[100px]"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
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
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8 shadow-xl"
              >
                <FireIcon className="h-5 w-5 text-orange-400" />
                <NewCoursesCounter newlyAddedCount={newlyAddedCount} />
              </motion.div>
            )}

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
              Master Your Next
              <span className="block bg-gradient-to-r from-[#B19CD9] to-[#967BB6] bg-clip-text text-transparent">
                Skill Today
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-400 mb-10 px-4 font-medium">
              Explore premium courses from industry leaders and unlock your true potential in our global learning community.
            </p>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-2xl mx-auto px-4"
            >
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl shadow-[#B19CD9]/20 p-1">
                <MagnifyingGlassIcon className="ml-4 h-6 w-6 text-[#B19CD9] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search courses, instructors..."
                  className="w-full px-4 py-4 md:py-5 text-gray-900 focus:outline-none text-base md:text-lg font-medium placeholder-gray-400 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="mr-1 px-6 md:px-8 py-3.5 md:py-4 bg-[#967BB6] text-white rounded-xl font-bold hover:bg-[#7A589B] transition-all shadow-lg active:scale-95">
                  Explore
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Filters Sticky Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E6E6FA] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-5">
          <div className="flex items-center justify-between md:hidden mb-4">
            <div className="flex items-center gap-2 text-[#5E4B8A] font-bold">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>Filters</span>
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 bg-[#FAF7FF] border border-[#E6E6FA] rounded-xl text-xs font-bold text-[#7A589B]"
            >
              {isFilterOpen ? "Hide" : "Show"}
            </button>
          </div>

          <div className={`${isFilterOpen ? "block" : "hidden"} md:block`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <div className="hidden md:flex items-center gap-2 text-[#5E4B8A] font-extrabold mr-2 whitespace-nowrap">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-[#B19CD9]" />
                  <span>Category</span>
                </div>
                <div className="flex gap-2.5">
                  {categories?.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => setSelectedCategory(category.name === "All" ? "all" : category.name)}
                      className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap border-2 ${
                        (category.name === "All" ? selectedCategory === "all" : selectedCategory === category.name)
                          ? "bg-[#967BB6] border-[#967BB6] text-white shadow-lg shadow-[#B19CD9]/30"
                          : "bg-white border-[#E6E6FA] text-gray-500 hover:border-[#B19CD9] hover:text-[#7A589B]"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4">
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white border-2 border-[#E6E6FA] text-[#5E4B8A] focus:outline-none focus:border-[#967BB6] text-xs md:text-sm font-bold shadow-sm"
                >
                  <option value="all">All Prices</option>
                  <option value="free">Free Only</option>
                  <option value="paid">Premium</option>
                </select>
                <div className="text-xs md:text-sm text-[#967BB6] font-extrabold uppercase tracking-widest bg-[#FAF7FF] px-4 py-2.5 rounded-xl border border-[#E6E6FA]">
                  {loading ? "..." : filteredCourses.length} courses
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={loading ? "loading" : "grid"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {loading
              ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              : filteredCourses?.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredCard(course?._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-[#B19CD9]/20 transition-all duration-500 overflow-hidden border border-[#E6E6FA] flex flex-col"
                  >
                    {/* Image Area */}
                    <div className="relative h-52 sm:h-56 overflow-hidden">
                      <Link to={`/course/${course._id}`} className="block w-full h-full">
                        <motion.img
                          src={course?.thumbnail?.url}
                          alt={course?.title}
                          className="w-full h-full object-cover"
                          animate={{ scale: hoveredCard === course?._id ? 1.1 : 1 }}
                          transition={{ duration: 0.7 }}
                        />
                      </Link>
                      
                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#5E4B8A] text-[10px] font-black rounded-lg shadow-sm uppercase tracking-tighter">
                          {course?.category?.name}
                        </span>
                        {course?.priceType === "free" && (
                          <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-lg shadow-md">
                            FREE
                          </span>
                        )}
                      </div>

                      <button className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-lg">
                        <HeartIcon className="h-5 w-5" />
                      </button>

                      <motion.div
                        animate={{ opacity: hoveredCard === course._id ? 1 : 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
                      >
                        <button
                          onClick={() => setPreviewVideoUrl(course?.promotionalVideo?.url)}
                          className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-2xl shadow-2xl hover:scale-105 transition-transform text-sm"
                        >
                          <PlayCircleIcon className="h-5 w-5 text-[#967BB6]" />
                          Preview Course
                        </button>
                      </motion.div>

                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg flex items-center gap-1.5">
                        <VideoCameraIcon className="h-3.5 w-3.5" />
                        {course?.totalDuration || "Self-Paced"}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 sm:p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-[#1A1A2E] line-clamp-2 group-hover:text-[#7A589B] transition-colors mb-3 leading-snug">
                        {course?.title}
                      </h3>
                      
                      {/* Instructor Info - Enhanced */}
                      <div className="flex items-center gap-3 mb-5 p-2 rounded-2xl bg-[#FAF7FF] border border-[#E6E6FA]">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border-2 border-white flex-shrink-0">
                          {course?.instructor?.avatar?.url ? (
                            <img 
                              src={course.instructor.avatar.url} 
                              alt={course.instructor.name}
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full bg-[#B19CD9] flex items-center justify-center text-white font-bold uppercase">
                              {course?.instructor?.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#5E4B8A] truncate flex items-center gap-1">
                            {course?.instructor?.name}
                            <CheckBadgeIcon className="h-4 w-4 text-blue-400" />
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Instructor</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-6">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                          <StarIconSolid className="h-4 w-4 text-yellow-400" />
                          <span className="text-gray-900">{course?.averageRating || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="h-4 w-4 text-[#B19CD9]" />
                          <span>{course?.enrolledStudents?.length || 0} Students</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ClockIcon className="h-4 w-4 text-[#B19CD9]" />
                          <span>{course?.totalLessons} Lessons</span>
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="pt-5 border-t border-[#E6E6FA] mt-auto flex items-center justify-between">
                        <div>
                          {course?.discountPrice > 0 ? (
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-400 line-through font-bold">₹{course?.price}</span>
                              <span className="text-xl font-black text-[#1A1A2E]">₹{course?.price - course?.discountPrice}</span>
                            </div>
                          ) : (
                            <span className={`text-xl font-black ${course?.priceType === "free" ? "text-green-600" : "text-[#1A1A2E]"}`}>
                              {course?.priceType === "free" ? "Free" : `₹${course?.price}`}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleEnroll(course?._id)}
                          className="px-6 py-3 bg-[#1A1A2E] text-white rounded-xl font-bold hover:bg-[#967BB6] transition-all flex items-center gap-2 group/btn text-sm shadow-xl active:scale-95"
                        >
                          {reduxUser?._id === course?.instructor?._id || enrolledCourses.includes(course?._id)
                            ? "Resume"
                            : "Learn"}
                          <ArrowRightIcon className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-24 h-24 bg-[#FAF7FF] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-[#E6E6FA]">
              <BookOpenIcon className="h-12 w-12 text-[#B19CD9]" />
            </div>
            <h3 className="text-2xl font-black text-[#1A1A2E] mb-2">No Courses Found</h3>
            <p className="text-gray-500 mb-8 font-medium">Try refining your search or changing the filters.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setPriceFilter("all"); }}
              className="px-8 py-3 bg-[#967BB6] text-white rounded-xl font-bold shadow-lg shadow-[#B19CD9]/30"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Video Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-[100] bg-[#1A1A2E]/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(177,156,217,0.3)] border-4 border-white/10">
            <video src={previewVideoUrl} controls autoPlay className="w-full h-full" />
            <button
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center font-bold text-xl hover:scale-110 transition-transform"
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