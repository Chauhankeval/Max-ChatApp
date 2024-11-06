import "./App.css";
import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Auth from "./pages/auth";
import Profile from "./pages/profile";
import Chat from "./pages/Chat";
import { useAppStore } from "./Store";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GET_USER_INFO } from "./Services/urlHelper";
import { ApiService } from "./Services/ApiService";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "./pages/ai/utils/Theme";
import Home from "./pages/ai/pages/Home";
import CreatePost from "./pages/ai/pages/CreatePost";
import Navbar from "./pages/ai/pages/Navbar";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 3;
`;

function WrapperLayout() {
  const location = useLocation();
  
  // Check if the current path is /home or /post to show Navbar
  const showNavbar = location.pathname === "/home" || location.pathname === "/post";

  return (
    <Container>
      <Wrapper>
        {showNavbar && <Navbar />}
        <Outlet /> {/* Nested routes will render here */}
      </Wrapper>
    </Container>
  );
}

function App() {
  const { userInfo, setUserInfo } = useAppStore();

  const PVTRoute = ({ children }) => {
    const isAuth = !!userInfo;
    return isAuth ? children : <Navigate to="/auth" />;
  };

  const AuthRoute = ({ children }) => {
    const isAuth = !!userInfo;
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
    <ThemeProvider theme={darkTheme}>
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
          <Route element={<WrapperLayout />}>
            <Route
              path="/home"
              element={
                <PVTRoute>
                  <Home />
                </PVTRoute>
              }
            />
            <Route
              path="/post"
              element={
                <PVTRoute>
                  <CreatePost />
                </PVTRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
