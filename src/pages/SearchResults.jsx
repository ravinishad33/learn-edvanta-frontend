// src/pages/SearchResults.jsx
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  BookOpenIcon,
  UsersIcon,
  ClockIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

// Reusable Skeleton for themed loading
const SkeletonCard = () => (
  <div className="bg-white rounded-[2rem] shadow-sm border border-[#E6E6FA] overflow-hidden flex flex-col animate-pulse">
    <div className="h-52 bg-[#FAF7FF]" />
    <div className="p-6 space-y-4">
      <div className="h-6 bg-[#FAF7FF] rounded-md w-3/4" />
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#FAF7FF]" />
        <div className="h-3 bg-[#FAF7FF] rounded w-1/2" />
      </div>
      <div className="pt-4 border-t border-[#FAF7FF] flex justify-between">
        <div className="h-6 bg-[#FAF7FF] rounded-full w-20" />
        <div className="h-6 bg-[#FAF7FF] rounded w-16" />
      </div>
    </div>
  </div>
);

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      fetchCourses(query);
    }
  }, [location.search]);

  const fetchCourses = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/course/published`);
      const allCourses = response?.data?.courses || [];
      
      const filtered = allCourses.filter(course => 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course?.instructor?.name?.toLowerCase().includes(query.toLowerCase()) ||
        course?.category?.name?.toLowerCase().includes(query.toLowerCase())
      );
      
      setFilteredCourses(filtered);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7FF]/30 selection:bg-[#B19CD9] selection:text-white">
      {/* Header Section */}
      <div className="bg-[#1A1A2E] pt-20 pb-32 relative overflow-hidden rounded-b-[3rem] sm:rounded-b-[5rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(177,156,217,0.1),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight"
          >
            Search <span className="bg-gradient-to-r from-[#B19CD9] to-[#967BB6] bg-clip-text text-transparent italic">Results</span>
          </motion.h1>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch} 
            className="relative max-w-3xl mx-auto"
          >
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-1 shadow-[#000]/20">
              <MagnifyingGlassIcon className="ml-4 h-6 w-6 text-[#B19CD9]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, instructors, skills..."
                className="w-full px-4 py-4 md:py-5 text-gray-900 focus:outline-none text-base md:text-lg font-medium bg-transparent"
              />
              <button
                type="submit"
                className="mr-1 px-8 py-3.5 md:py-4 bg-[#967BB6] text-white rounded-xl font-bold hover:bg-[#7A589B] transition-all shadow-lg active:scale-95"
              >
                Search
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
        {/* Results Info Bar */}
        <div className="bg-white/80 backdrop-blur-xl border border-[#E6E6FA] rounded-2xl p-4 mb-10 flex items-center justify-between shadow-xl shadow-[#E6E6FA]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7FF] flex items-center justify-center border border-[#E6E6FA]">
              <BookOpenIcon className="h-5 w-5 text-[#967BB6]" />
            </div>
            <p className="text-[#5E4B8A] font-bold text-sm sm:text-base">
              {loading ? "Scanning Neural Link..." : `Found ${filteredCourses.length} outcomes for "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Results Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredCourses.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredCard(course._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-[#B19CD9]/20 transition-all duration-500 overflow-hidden border border-[#E6E6FA] flex flex-col"
                >
                  {/* Thumbnail Area */}
                  <div className="relative h-56 overflow-hidden">
                    <Link to={`/course/${course._id}`} className="block w-full h-full">
                      <motion.img
                        src={course?.thumbnail?.url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        animate={{ scale: hoveredCard === course._id ? 1.1 : 1 }}
                        transition={{ duration: 0.7 }}
                      />
                    </Link>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#5E4B8A] text-[10px] font-black rounded-lg shadow-sm uppercase tracking-wider">
                        {course?.category?.name}
                      </span>
                    </div>

                    <motion.div
                      animate={{ opacity: hoveredCard === course._id ? 1 : 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
                    >
                      <Link 
                        to={`/course/${course._id}`}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-[#1A1A2E] font-bold rounded-2xl shadow-2xl hover:scale-105 transition-transform"
                      >
                        <PlayCircleIcon className="h-5 w-5 text-[#967BB6]" />
                        View Course
                      </Link>
                    </motion.div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-black text-[#1A1A2E] line-clamp-2 group-hover:text-[#7A589B] transition-colors mb-4 leading-tight">
                      {course.title}
                    </h3>
                    
                    {/* Instructor Info */}
                    <div className="flex items-center gap-3 mb-6 p-2 rounded-2xl bg-[#FAF7FF] border border-[#E6E6FA]">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                        {course?.instructor?.avatar?.url ? (
                          <img src={course.instructor.avatar.url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#B19CD9] flex items-center justify-center text-white font-bold">
                            {course?.instructor?.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[#5E4B8A] truncate flex items-center gap-1">
                          {course?.instructor?.name}
                          <CheckBadgeIcon className="h-4 w-4 text-blue-400" />
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Instructor</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-6">
                      <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-lg">
                        <StarIconSolid className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-700">{course?.averageRating || 0}</span>
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

                    {/* Footer / Price */}
                    <div className="mt-auto pt-5 border-t border-[#E6E6FA] flex items-center justify-between">
                      <div className="flex flex-col">
                        {course?.discountPrice > 0 ? (
                          <>
                            <span className="text-[10px] text-gray-400 line-through font-bold">₹{course.price}</span>
                            <span className="text-xl font-black text-[#1A1A2E]">₹{course.price - course.discountPrice}</span>
                          </>
                        ) : (
                          <span className={`text-xl font-black ${course?.priceType === "free" ? "text-green-600" : "text-[#1A1A2E]"}`}>
                            {course?.priceType === "free" ? "Free" : `₹${course.price}`}
                          </span>
                        )}
                      </div>
                      <Link 
                        to={`/course/${course._id}`}
                        className="px-6 py-3 bg-[#1A1A2E] text-white rounded-xl font-bold hover:bg-[#967BB6] transition-all flex items-center gap-2 group/btn text-sm shadow-xl"
                      >
                        Enroll <ArrowRightIcon className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* No Results State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-white rounded-[3rem] border border-[#E6E6FA] shadow-xl shadow-[#E6E6FA]/40"
            >
              <div className="w-24 h-24 bg-[#FAF7FF] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-[#E6E6FA]">
                <BookOpenIcon className="h-12 w-12 text-[#B19CD9]" />
              </div>
              <h3 className="text-3xl font-black text-[#1A1A2E] mb-4">No Courses Found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-10 font-medium">
                We couldn't find any courses matching your search. Try different keywords or explore our trending library.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-10 py-4 bg-[#967BB6] text-white rounded-2xl font-black shadow-lg shadow-[#B19CD9]/40 hover:bg-[#7A589B] transition-all active:scale-95"
              >
                Explore All Courses <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchResults;