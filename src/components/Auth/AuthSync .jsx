import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";
import { loginSuccess } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthSync = () => {
  const { user, isAuthenticated, getIdTokenClaims, getAccessTokenSilently } =
    useAuth0();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const syncUser = async () => {
      if (!isAuthenticated || !user) return;

      const appToken = localStorage.getItem("token");
      if (appToken) return;

      try {
        // Get full profile from ID token claims
        const idTokenClaims = await getIdTokenClaims();

        const accessToken = await getAccessTokenSilently();

        const userRes = await axios.post(
          `${apiUrl}/api/auth/sync`,
          {
            auth0Id: idTokenClaims.sub,
            email: idTokenClaims.email,
            name: idTokenClaims.name,
            avatar: idTokenClaims.picture,
            provider: idTokenClaims.sub.split("|")[0], // google-oauth2 / github
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        localStorage.setItem("token", userRes?.data?.token);

        dispatch(
          loginSuccess({
            user: userRes?.data?.user,
            token: userRes?.data?.token,
          }),
        );
        navigate("/profile");
      } catch (error) {
        console.log(error.response);
      }
    };
    syncUser();
  }, [isAuthenticated, user]);

  return null;
};

export default AuthSync;
