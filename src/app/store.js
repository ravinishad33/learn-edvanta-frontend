import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

const savedUser = localStorage.getItem("user");

const preloadedState = {
  auth: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: localStorage.getItem("token"),
    isLoggedIn: !!localStorage.getItem("token"),
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});