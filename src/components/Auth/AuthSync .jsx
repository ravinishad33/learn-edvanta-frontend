import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";
import { loginSuccess } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

const AuthSync = () => {
  const { user, isAuthenticated, getIdTokenClaims, getAccessTokenSilently } =useAuth0();
  
     const dispatch = useDispatch()

  useEffect(() => {
    const syncUser = async () => {
      if (!isAuthenticated || !user) return;

      const appToken = localStorage.getItem("token");
      if (appToken) return;

      // Get full profile from ID token claims
      const idTokenClaims = await getIdTokenClaims();

      const accessToken = await getAccessTokenSilently();

      const userRes = await axios.post(
        "http://localhost:5000/api/auth/sync",
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

      localStorage.setItem("token",userRes.data.token)

         dispatch(loginSuccess({
              user: userRes?.data?.user,
              token: userRes?.data?.token
           }))

      console.log(userRes)
    }
    syncUser();
  }, [isAuthenticated, user]);

  return null;
};

export default AuthSync;
