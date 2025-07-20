import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Pages({ hideButton,user,setUser }) {
  const navigate = useNavigate();
    

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      navigate("/home"); // Automatically go to dashboard if logged in
    }
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleLoginSuccess = (credentialResponse) => {
    const userInfo = jwtDecode(credentialResponse.credential);
    console.log("User Info:", userInfo);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
    navigate("/home");
  };

  return (
    <div>
      {!user ? (
        hideButton ? null : (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log("Login Failed")}
            auto_select
          />
        )
      ) : (
        <button
          onClick={handleLogout}
          className="bg-red-500 px-6 py-2 rounded-lg text-white shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300 ease-in-out 
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Logout
        </button>
      )}
    </div>
  );
}
