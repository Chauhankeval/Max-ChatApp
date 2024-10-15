import { HOST, LOGOUT_URL } from "@/Services/urlHelper";
import { useAppStore } from "@/Store";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { ApiService } from "@/Services/ApiService";
import { toast } from "sonner";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const { userInfo , setUserInfo } = useAppStore();
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo, navigate]);

  const LogOut = async () => {
    let result;
    try {
      const url = LOGOUT_URL;
      result = ApiService.callServicePostBodyData(url);

      if(result.status === 200) {
        toast("Logout SuccessFully")
        navigate('/login')
        setUserInfo(null)
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black rounded-full"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("")[0]
                  : userInfo.email.split("")[0]}
              </div>
            )}
          </Avatar>
        </div>
      </div>
      <div>
        {userInfo.firstName && userInfo.lastName
          ? `${userInfo.firstName} ${userInfo.lastName}`
          : ""}
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit
                onClick={() => navigate("/profile")} // Corrected here
                className="text-purple-500 text-xl font-medium"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoLogOut
                onClick={LogOut}
                className="text-red-500 text-xl font-medium"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
