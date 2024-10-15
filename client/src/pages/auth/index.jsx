import React, { useState } from "react";
import Victory from "@/assets/victory.svg";
import LoginPng from "@/assets/login2.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextField from "@mui/material/TextField"; // Import Material UI TextField
import { Button } from "@/components/ui/button";
import { ApiService } from "@/Services/ApiService";
import { LOGIN_URL, SIGNUP_URL } from "@/Services/urlHelper";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/Store";

const Auth = () => {
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validation = async () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }

    if (!password.length) {
      toast.error("Password is required");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const validationForLogin = async () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }

    if (!password.length) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };
  const handleLogin = async () => {
    const isValid = await validationForLogin();
    if (isValid) {
      try {
        const reqobj = {
          email,
          password,
        };
        const uri = LOGIN_URL;
        const result = await ApiService.callServicePostBodyData(uri, reqobj);

        toast.success("Login Successfully");

        if (result?.user.id) {
          setUserInfo(result?.user); // Update userInfo in global state

          if (result?.user.profileSetUp) {
            navigate("/chat");
          } else {
            navigate("/profile"); // Navigate to profile setup page if not
          }
        }
      } catch (error) {
        toast.error("Login failed. Please try again.");
        console.log("<<<<ERROR", error);
      }
    }
  };

  const handleSignup = async () => {
    const isValid = await validation();
    if (isValid) {
      try {
        const reqobj = {
          
            email,
            confirmPassword,
            password,
          
        };

        const uri = SIGNUP_URL;

        const result = await ApiService.callServicePostBodyData(uri, reqobj);
        toast.success("User has been created.");
        if (result?.user.id) {
          setUserInfo(result?.user);
          if (result?.user.profileSetUp) {
            navigate("/profile");
          }
        }
      } catch (error) {
        // Show error toast and log any errors
        toast.error("Signup failed. Please try again.");
        console.log("<<<<ERROR", error);
      }
    }
  };

  return (
    <div className="h-[100%] w-[100%] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:h-[90vw] sm:h-[70vw] lg:h-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex justify-center items-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory Image" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill the Details to Start Chat With Buddy
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs defaultValue="login" className="w-3/4">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:semi-bold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>

                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:semi-bold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Sign up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <div className="mb-4 mt-4">
                  {" "}
                  {/* Added mt-4 */}
                  <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    className="mt-4"
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    id="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    className="mt-4"
                  />
                </div>
                <Button
                  className="rounded-full p-6"
                  variant="outline"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </TabsContent>
              <TabsContent value="signup">
                <div className="mb-4 mt-4 rounded-lg">
                  {" "}
                  {/* Added mt-4 */}
                  <TextField
                    id="emailSignup"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    className="mt-4"
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    id="passwordSignup"
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    className="mt-4"
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    className="mt-4"
                  />
                </div>
                <Button
                  onClick={handleSignup}
                  className="rounded-full p-6"
                  variant="outline"
                >
                  Sign up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden  xl:flex justify-center items-center">
          <img src={LoginPng} alt="BackGround Img" className="h-[700px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
