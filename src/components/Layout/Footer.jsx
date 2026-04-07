// components/Footer.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
  FiSend,
} from "react-icons/fi";
import { FaAppStore, FaGooglePlay } from "react-icons/fa";

const Footer = () => {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    certificates: 0,
    instructors: 0,
  });

  const apiUrl = import.meta.env.VITE_API_URL;

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

  const footerLinks = {
    learn: {
      title: "Students",
      links: [
        { label: "Explore Catalog", url: "/courses" },
        { label: "Verify Certificate", url: "/certificate" },
        { label: "Learning Paths", url: "/courses" },
      ],
    },
    support: {
      title: "Support",
      links: [
        { label: "Help Center", url: "/contact-support" },
        { label: "Contact Us", url: "/contact-us" },
        { label: "Community", url: "/" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Privacy Policy", url: "/privacy" },
        { label: "Terms of Use", url: "/terms" },
        { label: "Safety", url: "/safety" },
      ],
    },
  };

  return (
    <footer className="bg-[#0F0F1A] text-white border-t border-[#B19CD9]/20 font-sans">
      {/* Real-time Stats Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-b border-white/5">
          <div className="flex items-center space-x-4 group">
            <div className="p-3 bg-[#FAF7FF]/5 rounded-2xl group-hover:bg-[#B19CD9]/20 transition-colors">
              <FiUsers className="text-[#B19CD9] text-2xl" />
            </div>
            <div>
              <p className="font-black text-xl tracking-tight">{stats?.students?.toLocaleString() || 0}+</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Learners</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 group">
            <div className="p-3 bg-[#FAF7FF]/5 rounded-2xl group-hover:bg-[#B19CD9]/20 transition-colors">
              <FiBookOpen className="text-[#967BB6] text-2xl" />
            </div>
            <div>
              <p className="font-black text-xl tracking-tight">{stats?.courses?.toLocaleString() || 0}+</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Courses</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 group">
            <div className="p-3 bg-[#FAF7FF]/5 rounded-2xl group-hover:bg-[#B19CD9]/20 transition-colors">
              <FiAward className="text-[#B19CD9] text-2xl" />
            </div>
            <div>
              <p className="font-black text-xl tracking-tight">{stats?.certificates?.toLocaleString() || 0}+</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Certificates</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 group">
            <div className="p-3 bg-[#FAF7FF]/5 rounded-2xl group-hover:bg-[#B19CD9]/20 transition-colors">
              <FiShield className="text-emerald-400 text-2xl" />
            </div>
            <div>
              <p className="font-black text-xl tracking-tight">100%</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Encrypted</p>
            </div>
          </div>
        </div>

        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Identity Section */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-block group">
              <img src="/logo.png" alt="Edvanta" className="w-40 h-12 object-contain" />
              <p className="mt-3 text-[11px] text-[#B19CD9] font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                Mastery through Innovation
              </p>
            </Link>

            <div className="max-w-sm">
              <h3 className="text-lg font-bold text-gray-100 mb-3">Stay Ahead of the Curve</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Receive weekly insights into the tech landscape and exclusive course early-access.
              </p>
              <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#B19CD9] focus:ring-4 focus:ring-[#B19CD9]/10 transition-all"
                />
                <button className="absolute right-2 top-1.5 p-2 bg-[#967BB6] text-white rounded-lg hover:bg-[#7A589B] transition-colors">
                  <FiSend size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-xs font-black text-[#B19CD9] uppercase tracking-[0.2em] mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.url}
                        className="text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium flex items-center group/link"
                      >
                        <span className="w-0 group-hover/link:w-3 h-[2px] bg-[#967BB6] mr-0 group-hover/link:mr-2 transition-all duration-300 rounded-full"></span>
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

      {/* Social & Stores Section */}
      <div className="bg-black/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex space-x-4">
            {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-[#B19CD9]/20 border border-white/5 transition-all duration-300 shadow-sm"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <a href="#" className="flex items-center px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
              <FaAppStore className="text-2xl mr-3 text-gray-300 group-hover:text-white" />
              <div className="text-left">
                <p className="text-[9px] text-gray-500 uppercase font-black leading-none">Download</p>
                <p className="text-sm font-bold">App Store</p>
              </div>
            </a>
            <a href="#" className="flex items-center px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
              <FaGooglePlay className="text-2xl mr-3 text-gray-300 group-hover:text-white" />
              <div className="text-left">
                <p className="text-[9px] text-gray-500 uppercase font-black leading-none">Get it on</p>
                <p className="text-sm font-bold">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#050508] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-[13px] text-gray-500 font-medium">
         <p>
        © {new Date().getFullYear()}{" "}
        <span className="text-gray-300 font-bold">Edvanta.</span>{" "}
        All rights reserved.
      </p>
          
          <div className="flex items-center gap-8 mt-4 md:mt-0">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center hover:text-[#B19CD9] transition-colors font-bold uppercase tracking-widest text-[11px]"
            >
              Back to top 
              <FiChevronUp className="ml-2 group-hover:-translate-y-1 transition-transform" size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;