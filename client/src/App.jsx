import "./App.css";
import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/auth";
import Profile from "./pages/profile";
import Chat from "./pages/Chat";
import { useAppStore } from "./Store";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GET_USER_INFO } from "./Services/urlHelper";
import { ApiService } from "./Services/ApiService";

function App() {
  // Corrected to use 'children' instead of 'Children'
  const { userInfo, setUserInfo } = useAppStore();

  const PVTRoute = ({ children }) => {
    const isAuth = !!userInfo; // Check if userInfo is present
    return isAuth ? children : <Navigate to="/auth" />;
  };

  const AuthRoute = ({ children }) => {
    const isAuth = !!userInfo; // Check if userInfo is present
    return isAuth ? <Navigate to="/chat" /> : children;
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = GET_USER_INFO;
        const result = await ApiService.callServiceGetUserData(url);
        console.log("<<RESULT", result);
        if (result.id) {
          setUserInfo(result);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
        console.log("<<error", error);
        toast("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>....loading</div>;
  }

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <Auth />
              </AuthRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PVTRoute>
                <Profile />
              </PVTRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PVTRoute>
                <Chat />
              </PVTRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
