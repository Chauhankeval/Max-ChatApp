import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  HOST,
  PASSWORD_CHNAGE_AUTH,
  PROFILE_IMAGE_DELETE,
  SEND_OTP_VIA_EMAIL,
  SET_PROFILE_IMAGE,
  UPDATE_PROFILE,
} from "@/Services/urlHelper";
import { ApiService } from "@/Services/ApiService";
import TextField from "@mui/material/TextField";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef();

  const [showOTP, setShowOTP] = useState(false); // to toggle between password and OTP input
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  console.log("<<<otp",otp)
  // Function to handle OTP input change
  const handleOtpChange = (value, index) => {
    // Create a new array to store the updated OTP digits
    const newOtp = [...otp];
    newOtp[index] = value; // Update the specific index
    setOtp(newOtp); // Update the OTP state

    // Log the current OTP state for debugging
    console.log("<<<<otp", newOtp.join("")); // Joins the array to show as a single OTP string
  };

  const requestOTP = async () => {
    setShowOTP(false);
    if (newPassword !== confirmPassword) {
      toast("Password Do not match");
    } else {
      try {
        const url = SEND_OTP_VIA_EMAIL;
        const result = await ApiService.callServicePostBodyData(url, {
          email: userInfo.email,
        });
        console.log("<<<RESULT", result);
        if (result.message) {
          setShowOTP(true);
        }
      } catch (error) {
        console.log("<<<ERROR", error);
        toast("Got some issue while you are trying to change your profile");
      }
    }
  };
  
  const handlePasswordChange = async () => {
    const otpString = otp.join("");
    console.log("<<<<<otpString",otpString)
    try {
      const reqObj = {
        email: userInfo?.email, // User's email
        otp: otpString, // OTP entered by the user
        newPassword, // New password to set
      };
      const url = PASSWORD_CHNAGE_AUTH;

      const result = await ApiService.callServicePostBodyData(url, reqObj);
    } catch (error) {
      console.error("Error changing password:", error);
      toast("Error occurred while changing password.");
    }
  };

  useEffect(() => {
    if (userInfo.profileSetUp === true) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }

    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo, HOST]);

  const validation = async () => {
    if (!firstName.length) {
      toast.error("First Name is required");
      return false;
    }

    if (!lastName.length) {
      toast.error("Last Name is required");
      return false;
    }

    return true;
  };
  const saveChanges = async () => {
    const valid = await validation();
    if (valid) {
      try {
        let reqobj = {
          firstName,
          lastName,
          color: selectedColor,
        };
        const url = UPDATE_PROFILE;
        const responce = await ApiService.callServicePostBodyData(url, reqobj);

        console.log("<<RESPonce", responce);
        toast("Your Profile has been Changed");
      } catch (error) {
        console.log("<<<ERROR", error);
        toast("Got Some isue While You are Trying to Change Your Profile");
      }
    }
  };

  const navigateToTheChat = () => {
    if (userInfo.profileSetUp === true) {
      navigate("/chat");
    }
  };

  const handlefileInputClick = () => {
    toast("Click To change To profile");
    fileInputRef.current.click();
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    console.log({ file });

    let result; // Declare the result variable outside the block so it's accessible later
    if (file) {
      const formData = new FormData();
      formData.append("profile/image", file); // Assuming 'profile/image' is the correct key for the file

      const url = SET_PROFILE_IMAGE;
      try {
        result = await ApiService.callServicePostFormData(url, formData); // Call the API
      } catch (error) {
        toast.error("Failed to upload image"); // Handle the error case
        return;
      }
    }

    if (result.status === 200 && result.image) {
      // If result is defined and contains an image URL
      setUserInfo({ ...userInfo, image: result.image });
      toast.success("Your Profile Photo Updated Successfully");
    }
  };

  const handleDeleteImage = async () => {
    try {
      let url = PROFILE_IMAGE_DELETE;
      let result = await ApiService.callServiceDelete(url);

      if (result.status === 200 && result.image) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Your Profile Photo Remove Successfully");
        setImage(null);
      }
    } catch (error) {
      toast.error("Failed to upload image");
      return;
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack
            className="text-4xl lg:text-2xl text-white/90 cursor-pointer"
            onClick={navigateToTheChat}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-[800px] flex-wrap">
          <div className="grid grid-cols-2">
            <div
              className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <AvatarFallback>
                    <div
                      className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                        selectedColor
                      )}`}
                    >
                      <span className="text-6xl leading-[1.2] p-9">
                        {firstName
                          ? firstName.split("")[0]
                          : userInfo.email.split("")[0]}
                      </span>
                    </div>
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Hover Effect Container */}

              {hovered && (
                <div className="absolute flex items-center justify-center w-full h-full bg-transparent rounded-full">
                  <div
                    onClick={image ? handleDeleteImage : handlefileInputClick}
                    className="bg-black/50 rounded-full flex items-center justify-center p-2"
                  >
                    {image ? (
                      <FaTrash className="text-white text-3xl cursor-pointer" />
                    ) : (
                      <FaPlus className="text-white text-3xl cursor-pointer" />
                    )}
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileInputChange}
                name="profile/image"
                accept="image/*"
              />

              {/* Additional content can go here */}
            </div>
            <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
              <div className="w-full">
                <TextField
                  label="Email"
                  type="email"
                  value={userInfo.email}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                  variant="outlined"
                  InputProps={{
                    style: { color: "white" }, // Input text color
                  }}
                  InputLabelProps={{
                    style: { color: "white" }, // Label color
                  }}
                  fullWidth // Ensures the input takes the full width
                />
              </div>

              <div className="w-full">
                <TextField
                  label="First Name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)} // Update firstName state
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                  variant="outlined"
                  InputProps={{
                    style: { color: "white" }, // Input text color
                  }}
                  InputLabelProps={{
                    style: { color: "white" }, // Label color
                  }}
                  fullWidth
                />
              </div>

              <div className="w-full">
                <TextField
                  label="Last Name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)} // Update lastName state
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                  variant="outlined"
                  InputProps={{
                    style: { color: "white" }, // Input text color
                  }}
                  InputLabelProps={{
                    style: { color: "white" }, // Label color
                  }}
                  fullWidth
                />
              </div>

              <div className="w-full flex gap-5">
                {colors.map((color, index) => (
                  <div
                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 
        ${
          setSelectedColor === index ? "outline outline-white/50 outline-1" : ""
        } 
        hover:outline hover:outline-white hover:outline-2`} // Hover effect
                    key={index}
                    onClick={() => setSelectedColor(index)}
                  ></div>
                ))}
              </div>
              <div className="w-full">
                <Button
                  onClick={saveChanges}
                  className="h-14 w-[100%] bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          <div className="flex min-w-32 md:min-w-70 flex-col gap-5 text-white items-center justify-center">
            {!showOTP ? (
              <>
                <div>
                  <TextField
                    className="rounded-lg p-6 bg-[#2c2e3b] border-none mt-4"
                    label="New Password"
                    type="password" // Ensure password input
                    variant="outlined"
                    InputProps={{ style: { color: "white" } }}
                    InputLabelProps={{ style: { color: "white" } }}
                    onChange={(e) => setNewPassword(e.target.value)} // Update new password state
                  />
                </div>

                <div>
                  <TextField
                    className="rounded-lg p-6 bg-[#2c2e3b] border-none mt-4" // Margin for spacing
                    label="Confirm Password"
                    type="password" // Ensure password input
                    variant="outlined"
                    InputProps={{ style: { color: "white" } }}
                    InputLabelProps={{ style: { color: "white" } }}
                    onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
                  />
                  <div className="w-full mt-7">
                    <Button
                      onClick={requestOTP}
                      className="h-14 w-[100%] bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                    >
                      Send OTP
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div>
                  <InputOTP maxLength={6}>
                    <InputOTPGroup>
                      {[0, 1, 2].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          value={otp[index]} // Bind to each OTP digit
                          onChange={(e) =>
                            handleOtpChange(e.target.value, index)
                          }
                        />
                      ))}
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      {[3, 4, 5].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          value={otp[index]} // Bind to each OTP digit
                          onChange={(e) =>
                            handleOtpChange(e.target.value, index)
                          }
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  <div className="w-full mt-7">
                    <Button
                      onClick={handlePasswordChange}
                      className="h-14 w-[100%] bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                    >
                      Submit OTP and Change Password
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
