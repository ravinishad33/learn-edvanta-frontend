// components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHeart,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi';
import { FaAppStore, FaGooglePlay } from 'react-icons/fa';

const Footer = () => {
  const [openSections, setOpenSections] = useState({});

  // Toggle mobile accordion sections
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Footer links data
  const footerLinks = {
    product: {
      title: "Product",
      links: [
        { label: "Courses", url: "/courses" },
        { label: "Features", url: "/features" },
        { label: "Pricing", url: "/pricing" },
        { label: "Templates", url: "/templates" },
        { label: "Updates", url: "/updates" },
      ]
    },
    company: {
      title: "Company",
      links: [
        { label: "About Us", url: "/about" },
        { label: "Careers", url: "/careers" },
        { label: "Press", url: "/press" },
        { label: "Blog", url: "/blog" },
        { label: "Partners", url: "/partners" },
      ]
    },
    resources: {
      title: "Resources",
      links: [
        { label: "Documentation", url: "/docs" },
        { label: "Help Center", url: "/help" },
        { label: "Community", url: "/community" },
        { label: "Events", url: "/events" },
        { label: "API", url: "/api" },
      ]
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Privacy Policy", url: "/privacy" },
        { label: "Terms of Service", url: "/terms" },
        { label: "Cookie Policy", url: "/cookies" },
        { label: "GDPR", url: "/gdpr" },
        { label: "Security", url: "/security" },
      ]
    },
    contact: {
      title: "Contact Us",
      info: [
        { icon: <FiMail />, text: "support@Edvanta.com" },
        { icon: <FiPhone />, text: "+91 1800808080" },
        { icon: <FiMapPin />, text: "Surat - Gujarat, India" },
      ]
    }
  };

  // Social media links
  const socialLinks = [
    { icon: <FiFacebook />, url: "https://facebook.com", label: "Facebook" },
    { icon: <FiTwitter />, url: "https://twitter.com", label: "Twitter" },
    { icon: <FiInstagram />, url: "https://instagram.com", label: "Instagram" },
    { icon: <FiLinkedin />, url: "https://linkedin.com", label: "LinkedIn" },
    { icon: <FiYoutube />, url: "https://youtube.com", label: "YouTube" },
  ];

  // App store links
  const appLinks = [
    {
      icon: <FaAppStore className="w-5 h-5" />,
      text: "Download on the",
      store: "App Store",
      url: "https://apps.apple.com"
    },
    {
      icon: <FaGooglePlay className="w-5 h-5" />,
      text: "Get it on",
      store: "Google Play",
      url: "https://play.google.com"
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Brand/Logo Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold">EP</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Edvanta
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Learn. Grow. Succeed.</p>
                </div>
              </Link>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering learners worldwide with high-quality online education. 
              Join our community of 500,000+ students and instructors.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-200 mb-3">Stay Updated</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 hover:scale-105">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                No spam, unsubscribe at any time
              </p>
            </div>
          </div>

          {/* Quick Links - Desktop */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="grid grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([key, section]) => (
                <div key={key}>
                  <h3 className="font-semibold text-gray-200 mb-4 text-lg">
                    {section.title}
                  </h3>
                  {section.links ? (
                    <ul className="space-y-3">
                      {section.links.map((link, index) => (
                        <li key={index}>
                          <Link
                            to={link.url}
                            className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 flex items-center group"
                          >
                            <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-3">
                      {section.info.map((info, index) => (
                        <li key={index} className="text-gray-400 flex items-start space-x-2">
                          <span className="mt-1 text-blue-400">{info.icon}</span>
                          <span>{info.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links - Mobile Accordion */}
          <div className="lg:hidden col-span-2">
            <div className="space-y-4">
              {Object.entries(footerLinks).map(([key, section]) => (
                <div key={key} className="border-b border-gray-800 pb-4">
                  <button
                    onClick={() => toggleSection(key)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="font-semibold text-gray-200 text-lg">
                      {section.title}
                    </h3>
                    {openSections[key] ? (
                      <FiChevronUp className="text-gray-400" />
                    ) : (
                      <FiChevronDown className="text-gray-400" />
                    )}
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${
                    openSections[key] ? 'max-h-64 mt-4' : 'max-h-0'
                  }`}>
                    {section.links ? (
                      <ul className="space-y-3 pl-2">
                        {section.links.map((link, index) => (
                          <li key={index}>
                            <Link
                              to={link.url}
                              className="text-gray-400 hover:text-white transition-colors"
                              onClick={() => setOpenSections({})}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="space-y-3 pl-2 mt-2">
                        {section.info.map((info, index) => (
                          <li key={index} className="text-gray-400 flex items-center space-x-2">
                            <span className="text-blue-400">{info.icon}</span>
                            <span>{info.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media & App Stores */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            
            {/* Social Media Links */}
            <div>
              <h4 className="text-gray-300 mb-4 text-center md:text-left">Follow Us</h4>
              <div className="flex items-center justify-center md:justify-start space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 hover:scale-110 transition-all duration-300"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* App Store Buttons */}
            <div>
              <h4 className="text-gray-300 mb-4 text-center md:text-left">Get Our App</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                {appLinks.map((app, index) => (
                  <a
                    key={index}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                  >
                    <span className="mr-3 text-xl">{app.icon}</span>
                    <div className="text-left">
                      <div className="text-xs text-gray-400">{app.text}</div>
                      <div className="text-sm font-semibold">{app.store}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-gray-500 text-sm text-center md:text-left">
              <p>
                © {new Date().getFullYear()} Edvanta. All rights reserved.
                Made with <FiHeart className="inline text-red-500" /> by Edvanta Tech.
              </p>
            </div>

            {/* Additional Links */}
            {/* <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <Link to="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/sitemap.xml" className="hover:text-white transition-colors">
                XML Sitemap
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/affiliate" className="hover:text-white transition-colors">
                Affiliate Program
              </Link>
            </div> */}

            {/* Back to Top Button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
            >
              <span>Back to top</span>
              <FiChevronUp className="group-hover:animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;