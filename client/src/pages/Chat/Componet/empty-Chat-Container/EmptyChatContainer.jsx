import { animationDefaultOptions } from "@/lib/utils";

import React from "react";
import Lottie from "react-lottie";
import Button from '../../../ai/button/Button'
import { AddRounded, WebRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const EmptyChatContainer = () => {


  const navigate = useNavigate()
  const gottoHome = () => {
    navigate("/home");
  };


  return (
    <>
      <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all relative">
      <Button
          text="Generate Image"
          leftIcon={<AddRounded style={{ fontSize: "18px" }} />}
          onClick={gottoHome}
        />
        <Lottie
          isClickToPauseDisabled={true}
          height={200}
          width={200}
          options={animationDefaultOptions}
        />
        <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
          <h3 className="poppins-medium">
            Welcome to <span className="text-purple-500">Max</span>
            <span className="text-purple-500"> Chat App</span>.
          </h3>
        </div>
      </div>
    </>
  );
};

export default EmptyChatContainer;
