import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import ProtectedRoute from "./utils/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./components/Auth/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import LearningInterface from "./pages/LearningInterface";
import Profile from "./pages/Profile";
import CourseCreation from "./pages/CourseCreation";
import PageNotFound from "./pages/PageNotFound";
import MyCourses from "./pages/MyCourses";
import CourseEdit from "./pages/CourseEdit";
import ForgotPasswordEntry from "./components/Auth/ForgotPasswordEntry";
import VerifyOTP from "./components/Auth/VerifyOTP";
import ContactSupport from "./pages/ContactSupport";
import ResetPassword from "./components/Auth/ResetPassword";
import ResetSuccess from "./components/Auth/ResetSuccess";
import UserDetail from "./pages/admin/UserDetail";
import UserEdit from "./pages/admin/UserEdit";
import AddUser from "./pages/admin/AddUser";

function App() {
  const [user, setUser] = useState(null);
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navbar />
        <AnimatePresence>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            
            {/* Password Reset Flow */}
            <Route path="/forgot-password" element={<ForgotPasswordEntry />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-success" element={<ResetSuccess />} />
            <Route path="/contact-support" element={<ContactSupport />} />

            {/* Protected Routes - Student */}
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mycourses"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mycourses/learn/:courseId"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <LearningInterface />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Instructor */}
            <Route
              path="/instructor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["instructor"]}>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createcourse"
              element={
                <ProtectedRoute allowedRoles={["instructor", "admin"]}>
                  <CourseCreation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mycourses/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["instructor", "admin"]}>
                  <CourseEdit />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Admin */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}> 
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-add"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserEdit />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - All Roles */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
  );
}

export default App;