import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  CheckBadgeIcon,
  StarIcon,
  ShieldExclamationIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [extraData, setExtraData] = useState(null);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2);
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${dd}-${mm}-${yy} ${hh}:${min}:${ss}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/admin/user/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData(res.data.user);
        setExtraData(res.data.extraData);
        setActivity(res.data.recentActivity);
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id, apiUrl]);

  if (isLoading) return <LoadingPulse />;
  if (!userData)
    return (
      <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">
        User Not Found
      </div>
    );

  const roleConfig = {
    student: {
      color: "blue",
      gradient: "from-blue-600 to-indigo-700",
      bg: "bg-blue-50",
    },
    instructor: {
      color: "emerald",
      gradient: "from-emerald-600 to-teal-700",
      bg: "bg-emerald-50",
    },
    admin: {
      color: "purple",
      gradient: "from-purple-600 to-fuchsia-700",
      bg: "bg-purple-50",
    },
  }[userData.role] || {
    color: "gray",
    gradient: "from-gray-600 to-gray-700",
    bg: "bg-gray-50",
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10 font-sans antialiased">
      {/* Header - Glassmorphism Responsive */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              <ArrowLeftIcon className="h-5 w-5 text-slate-600" />
            </button>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2 truncate">
              {userData.name}
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full border bg-white capitalize font-black text-${roleConfig.color}-600 border-${roleConfig.color}-200 shrink-0`}
              >
                {userData.role}
              </span>
            </h1>
          </div>
        </div>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8 grid grid-cols-12 gap-6 sm:gap-8"
      >
        {/* Left Section: Identity Card */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden"
          >
            <div
              className={`h-24 sm:h-32 bg-gradient-to-br ${roleConfig.gradient}`}
            />
            <div className="px-6 sm:px-8 pb-8">
              <div className="relative -mt-12 sm:-mt-16 mb-6">
            
                <img
                  src={userData?.avatar?.url}
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-[1.5rem] sm:rounded-[2rem] border-4 sm:border-8 border-white object-cover shadow-2xl"
                  alt="Avatar"
                />
                {userData.isVerified && (
                  <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full border-2 sm:border-4 border-white shadow-lg">
                    <CheckBadgeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                )}
              </div>
              <div className="space-y-4 border-t border-slate-100 pt-6 sm:pt-8">
                <IconBox
                  icon={EnvelopeIcon}
                  label="Email Address"
                  value={userData.email}
                />
                <IconBox
                  icon={PhoneIcon}
                  label="Phone"
                  value={userData.phone || "N/A"}
                />
                <IconBox
                  icon={MapPinIcon}
                  label="Location"
                  value={userData.location || "Not Set"}
                />
                <IconBox
                  icon={CalendarIcon}
                  label="Member Since"
                  value={formatDate(userData.createdAt)}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-slate-900 rounded-[2rem] p-6 sm:p-8 text-white shadow-2xl"
          >
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <ShieldExclamationIcon className="h-4 w-4 text-amber-400" />{" "}
              Authentication
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase">
                  Provider
                </p>
                <p className="text-sm font-bold capitalize text-slate-200">
                  {userData.provider}
                </p>
              </div>
              {userData.auth0Id && (
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">
                    External ID
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 break-all">
                    {userData.auth0Id}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Section: Stats and Tabs */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Responsive Stat Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userData.role === "student" && extraData?.stats && (
              <>
                <StatCard
                  label="Enrollments"
                  value={extraData.stats.totalEnrolled}
                  icon={BookOpenIcon}
                  color="blue"
                />
                <StatCard
                  label="Completions"
                  value={extraData.stats.completedCourses}
                  icon={CheckBadgeIcon}
                  color="indigo"
                />
                <StatCard
                  label="Invested"
                  value={`₹${extraData?.stats?.totalSpent?.toLocaleString("en-IN")}`}
                  icon={CurrencyRupeeIcon}
                  color="cyan"
                />
              </>
            )}
            {userData.role === "instructor" && extraData?.stats && (
              <>
                <StatCard
                  label="Active Courses"
                  value={extraData.stats.totalCourses}
                  icon={BookOpenIcon}
                  color="emerald"
                />
                <StatCard
                  label="Student Base"
                  value={extraData.stats.activeStudents}
                  icon={UserIcon}
                  color="teal"
                />
                <StatCard
                  label="Rating"
                  value={`${extraData.stats.averageRating?.toFixed(1)}/5`}
                  icon={StarIcon}
                  color="amber"
                />
              </>
            )}
          </div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden"
          >
            {/* Scrollable Tabs on Mobile */}
            <div className="flex px-4 sm:px-6 border-b border-slate-100 bg-slate-50/50 overflow-x-auto scrollbar-hide">
              <TabLink
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
                label="Overview"
              />
              <TabLink
                active={activeTab === "activity"}
                onClick={() => setActiveTab("activity")}
                label="Audit Logs"
              />
            </div>

            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-8"
                  >
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
                        Professional Biography
                      </h4>
                      <p className="text-slate-600 bg-slate-50 p-5 sm:p-6 rounded-2xl italic text-sm leading-relaxed">
                        "{userData.bio || "The user has not added a bio yet."}"
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
                      <InfoBox
                        label="Last Login"
                        value={formatDate(userData.lastLogin)}
                      />
                      <InfoBox
                        label="Verification"
                        value={
                          userData.isVerified ? "Fully Verified" : "Unverified"
                        }
                        color={
                          userData.isVerified
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === "activity" && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4"
                  >
                    {activity.length > 0 ? (
                      activity.map((item, i) => (
                        <div
                          key={i}
                          className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all"
                        >
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                            <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 truncate">
                              {item.event}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                              {formatDate(item.date)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-10 text-slate-400 font-bold italic">
                        No recent logs found.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Atomic Components ---

const InfoBox = ({ label, value, color = "text-slate-900" }) => (
  <div>
    <h4 className="text-slate-400 text-[9px] uppercase font-black tracking-widest mb-1">
      {label}
    </h4>
    <p className={`text-sm font-black ${color}`}>{value}</p>
  </div>
);

const IconBox = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 sm:gap-4">
    <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
    </div>
    <div className="min-w-0">
      <p className="text-[9px] uppercase font-black text-slate-400 tracking-tight">
        {label}
      </p>
      <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
        {value}
      </p>
    </div>
  </div>
);

const StatCard = ({ label, value, icon: Icon, color }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -5 }}
    className="bg-white p-5 sm:p-7 rounded-[2rem] border border-slate-100 shadow-sm transition-all"
  >
    <div
      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4 sm:mb-6`}
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
    </div>
    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">
      {label}
    </p>
    <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
      {value}
    </p>
  </motion.div>
);

const TabLink = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-6 sm:px-10 py-5 sm:py-6 text-[10px] sm:text-xs font-black uppercase tracking-widest relative whitespace-nowrap transition-all ${active ? "text-slate-900" : "text-slate-400"}`}
  >
    {label}
    {active && (
      <motion.div
        layoutId="tab-underline"
        className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-t-full"
      />
    )}
  </button>
);

const LoadingPulse = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center gap-6 bg-slate-50">
    <div className="h-16 w-16 sm:h-20 sm:w-20 border-4 sm:border-8 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
    <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">
      Syncing Data
    </p>
  </div>
);

export default UserDetail;
