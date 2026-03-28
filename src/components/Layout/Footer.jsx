import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Added axios
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiHeart,
  FiChevronUp,
  FiAward,
  FiBookOpen,
  FiUsers,
  FiShield,
} from "react-icons/fi";
import { FaAppStore, FaGooglePlay } from "react-icons/fa";

const Footer = () => {
  const [openSections, setOpenSections] = useState({});
  // 1. Added state for real-time stats
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    certificates: 0,
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  // 2. Fetch real data on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/public/platform-stats`);
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Footer stats fetch failed", error);
      }
    };
    fetchStats();
  }, [apiUrl]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const footerLinks = {
    learn: {
      title: "For Students",
      links: [
        { label: "Explore Courses", url: "/courses" },
        { label: "Verify Certificate", url: "/certificate" },
      ],
    },
    teach: {
      title: "For Instructors",
      links: [
        { label: "Explore Courses", url: "/courses" },
        { label: "My Courses", url: "/mycourses" },
      ],
    },
    support: {
      title: "Support & Help",
      links: [
        { label: "Help Center", url: "/contact-support" },
        { label: "Report an Issue", url: "/contact-support" },
        { label: "Contact Us", url: "/contact-us" },
      ],
    },
    legal: {
      title: "Platform",
      links: [
        { label: "Privacy Policy", url: "/privacy" },
        { label: "Terms of Service", url: "/terms" },
        { label: "Trust & Safety", url: "/safety" },
      ],
    },
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white border-t border-gray-800">
      {/* Top Section: Quick Stats - NOW USING REAL DATA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-b border-gray-800/50 mb-12">
          <div className="flex items-center space-x-3">
            <FiUsers className="text-blue-500 text-2xl" />
            <div>
              {/* Show formatted real data or '+' suffix */}
              <p className="font-bold text-xl">{stats?.students?.toLocaleString()}+</p>
              <p className="text-xs text-gray-500 uppercase">Learners</p>
            </div>
          </div>
              <div className="flex items-center space-x-3">
            <FiUsers className="text-blue-500 text-2xl" />
            <div>
              {/* Show formatted real data or '+' suffix */}
              <p className="font-bold text-xl">{stats?.instructors?.toLocaleString()}+</p>
              <p className="text-xs text-gray-500 uppercase">creaters</p>
            </div>
            
          </div>
          <div className="flex items-center space-x-3">
            <FiBookOpen className="text-purple-500 text-2xl" />
            <div>
              <p className="font-bold text-xl">{stats?.courses?.toLocaleString()}+</p>
              <p className="text-xs text-gray-500 uppercase">Courses</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FiAward className="text-pink-500 text-2xl" />
            <div>
              <p className="font-bold text-xl">{stats?.certificates?.toLocaleString()}+</p>
              <p className="text-xs text-gray-500 uppercase">Certificates</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FiShield className="text-emerald-500 text-2xl" />
            <div>
              <p className="font-bold text-xl">100%</p>
              <p className="text-xs text-gray-500 uppercase">Secure</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex flex-col items-start group">
              <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Edvanta Logo"
                  className="w-40 h-16 object-contain relative z-10"
                />
              </div>
              <p className="mt-2 text-[10px] md:text-xs text-blue-400 font-medium uppercase tracking-[0.2em] transition-colors group-hover:text-purple-400">
                Mastery through Innovation
              </p>
            </Link>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200">
                Join our newsletter
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Unlock exclusive weekly tips on course creation and early access
                to new learning paths.
              </p>
            </div>
          </div>

          {/* Nav Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.url}
                        className="text-gray-400 hover:text-white transition-all duration-200 text-sm flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="border-t border-gray-800 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex space-x-5">
            {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2.5 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-blue-600/20 hover:ring-1 hover:ring-blue-500/50 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ),
            )}
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            >
              <FaAppStore className="text-2xl mr-3" />
              <div className="text-left">
                <p className="text-[10px] text-gray-400 leading-none">
                  Download on
                </p>
                <p className="text-sm font-semibold">App Store</p>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            >
              <FaGooglePlay className="text-2xl mr-3" />
              <div className="text-left">
                <p className="text-[10px] text-gray-400 leading-none">
                  Get it on
                </p>
                <p className="text-sm font-semibold">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Final Copyright Bar */}
      <div className="bg-black py-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Edvanta Education. Built with{" "}
            <FiHeart className="inline text-red-500 animate-pulse" /> for
            lifelong learners.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center hover:text-white transition-colors"
            >
              Back to Top <FiChevronUp className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;