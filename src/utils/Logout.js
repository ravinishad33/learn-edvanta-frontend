import { useAuth0 } from "@auth0/auth0-react";

const useLogout = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    // 1️⃣ Remove app JWT and sync flag
    localStorage.removeItem("token");

    // 2️⃣ Log out from Auth0 and redirect to home
    logout({
      returnTo: window.location.origin, // change if you have a custom URL
    });
  };

  return handleLogout;
};

export default useLogout;
