// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   HomeIcon,
//   AcademicCapIcon,
//   BookOpenIcon,
//   ChartBarIcon,
//   UserGroupIcon,
//   Cog6ToothIcon,
//   DocumentTextIcon,
//   TrophyIcon,
//   QuestionMarkCircleIcon,
// } from "@heroicons/react/24/outline";

// const Sidebar = ({ userRole = "student" }) => {
//   const location = useLocation();

//   const studentMenu = [
//     {
//       icon: <HomeIcon className="h-5 w-5" />,
//       label: "Dashboard",
//       path: "/student-dashboard",
//     },
//     {
//       icon: <BookOpenIcon className="h-5 w-5" />,
//       label: "My Courses",
//       path: "/my-courses",
//     },
//     {
//       icon: <DocumentTextIcon className="h-5 w-5" />,
//       label: "Assignments",
//       path: "/assignments",
//     },
//     {
//       icon: <TrophyIcon className="h-5 w-5" />,
//       label: "Certificates",
//       path: "/certificates",
//     },
//     {
//       icon: <ChartBarIcon className="h-5 w-5" />,
//       label: "Progress",
//       path: "/progress",
//     },
//     {
//       icon: <QuestionMarkCircleIcon className="h-5 w-5" />,
//       label: "Help",
//       path: "/help",
//     },
//     {
//       icon: <Cog6ToothIcon className="h-5 w-5" />,
//       label: "Settings",
//       path: "/settings",
//     },
//   ];

//   const instructorMenu = [
//     {
//       icon: <HomeIcon className="h-5 w-5" />,
//       label: "Dashboard",
//       path: "/instructor-dashboard",
//     },
//     {
//       icon: <BookOpenIcon className="h-5 w-5" />,
//       label: "My Courses",
//       path: "/instructor-courses",
//     },
//     {
//       icon: <UserGroupIcon className="h-5 w-5" />,
//       label: "Students",
//       path: "/students",
//     },
//     {
//       icon: <ChartBarIcon className="h-5 w-5" />,
//       label: "Analytics",
//       path: "/analytics",
//     },
//     {
//       icon: <DocumentTextIcon className="h-5 w-5" />,
//       label: "Assignments",
//       path: "/instructor-assignments",
//     },
//     {
//       icon: <Cog6ToothIcon className="h-5 w-5" />,
//       label: "Settings",
//       path: "/instructor-settings",
//     },
//   ];

//   const adminMenu = [
//     {
//       icon: <HomeIcon className="h-5 w-5" />,
//       label: "Dashboard",
//       path: "/admin-dashboard",
//     },
//     {
//       icon: <UserGroupIcon className="h-5 w-5" />,
//       label: "Users",
//       path: "/admin-users",
//     },
//     {
//       icon: <AcademicCapIcon className="h-5 w-5" />,
//       label: "Courses",
//       path: "/admin-courses",
//     },
//     {
//       icon: <ChartBarIcon className="h-5 w-5" />,
//       label: "Analytics",
//       path: "/admin-analytics",
//     },
//     {
//       icon: <Cog6ToothIcon className="h-5 w-5" />,
//       label: "Settings",
//       path: "/admin-settings",
//     },
//   ];

//   const menuItems =
//     userRole === "student"
//       ? studentMenu
//       : userRole === "instructor"
//         ? instructorMenu
//         : adminMenu;

//   return (
//     <motion.div
//       initial={{ x: -100, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0"
//     >
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex items-center space-x-3">
//           <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
//             <AcademicCapIcon className="h-6 w-6 text-white" />
//           </div>
//           <div>
//             <h2 className="font-bold text-gray-900">LearnSphere</h2>
//             <p className="text-sm text-gray-500 capitalize">{userRole}</p>
//           </div>
//         </div>
//       </div>

//       <div className="p-4">
//         <nav className="space-y-1">
//           {menuItems.map((item) => (
//             <Link
//               key={item.label}
//               to={item.path}
//               className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
//                 location.pathname === item.path
//                   ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-l-4 border-blue-500"
//                   : "text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               <div
//                 className={`${
//                   location.pathname === item.path
//                     ? "text-blue-600"
//                     : "text-gray-500"
//                 }`}
//               >
//                 {item.icon}
//               </div>
//               <span className="font-medium">{item.label}</span>
//             </Link>
//           ))}
//         </nav>

//         {/* Progress Section */}
//         <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
//           <h3 className="font-bold text-gray-900 mb-2">Learning Progress</h3>
//           <div className="mb-2">
//             <div className="flex justify-between text-sm text-gray-600">
//               <span>Overall</span>
//               <span>65%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: "65%" }}
//                 transition={{ duration: 1 }}
//                 className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Sidebar;
