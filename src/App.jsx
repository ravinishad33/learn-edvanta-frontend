import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
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
import MyCourses from "./pages/myCourses";
import CourseEdit from "./pages/CourseEdit";
import ForgotPasswordEntry from "./components/Auth/ForgotPasswordEntry";
import VerifyOTP from "./components/Auth/VerifyOTP";
import ContactSupport from "./pages/ContactSupport";
import ResetPassword from "./components/Auth/ResetPassword";
import ResetSuccess from "./components/Auth/ResetSuccess";
import UserDetail from "./pages/admin/UserDetail";
import toast, { Toaster } from "react-hot-toast";
import { useAuth0 } from "@auth0/auth0-react";
import AuthSync from "./components/Auth/AuthSync ";
import AdminCategoryManagement from "./pages/admin/AdminCategoryManagement";
import SearchResults from "./pages/SearchResults";
import ChatBot from "./components/Common/chatBot";
import VerifyCertificate from "./pages/VerifyCertificate";
import ScrollToTop from "./components/Layout/ScrollToTop";
import ContactUs from "./pages/ContactUs";

function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const justLoggedIn = sessionStorage.getItem("justLoggedIn");

      if (!justLoggedIn) {
        const toastId = toast.success("Login successful!", {
          duration: 2000, // 3 seconds
        });

        sessionStorage.setItem("justLoggedIn", "true");

        // Remove flag after toast disappears
        // setTimeout(() => {
        //   sessionStorage.removeItem("justLoggedIn");
        // }, 3000);
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
          },
        }}
      />
      <Router>
        <ScrollToTop/>
        <AuthSync />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          {/* <CheckLoginData/> */}
          <Navbar />
          {/* <AnimatePresence> */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />

            <Route path="/forgot-password" element={<ForgotPasswordEntry />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-success" element={<ResetSuccess />} />
            <Route path="/contact-support" element={<ContactSupport />} />
            <Route path="/contact-us" element={<ContactUs />} />


            {/* Protected Routes */}
            <Route
              path="/student-dashboard"
              element={
                isAuthenticated || token ? (
                  <StudentDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/instructor-dashboard"
              element={
                isAuthenticated || token ? (
                  <InstructorDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                isAuthenticated || token ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/user/:id"
              element={
                isAuthenticated || token ? (
                  <UserDetail />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* <Route path="/user-add" element={<AddUser />} /> */}
            {/* <Route path="/user/edit/:id" element={<UserEdit />} /> */}
            <Route
              path="/createcourse"
              element={
                isAuthenticated || token ? (
                  <CourseCreation />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* //temporary */}
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/search" element={<SearchResults />} />
            <Route
              path="/mycourses"
              element={
                isAuthenticated || token ? (
                  <MyCourses />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* <Route path="/mycourses/edit" element={<CourseEdit />} /> */}
            <Route
              path="/mycourses/edit/:id"
              element={
                isAuthenticated || token ? (
                  <CourseEdit />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route path="/certificate" element={<VerifyCertificate />} />

            <Route
              path="/course/:id"
              element={
                isAuthenticated || token ? (
                  <CourseDetail />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/categories"
              element={
                isAuthenticated || token ? (
                  <AdminCategoryManagement />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/mycourses/learn/:courseId"
              element={
                isAuthenticated || token ? (
                  <LearningInterface />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated || token ? (
                  <Profile />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* <Route path="/settings" element={<Settings />} /> */}

            <Route path="/*" element={<PageNotFound />} />
          </Routes>
          <ChatBot />
          <Footer />
          {/* </AnimatePresence> */}
        </div>
      </Router>
    </>
  );
}

export default App;
