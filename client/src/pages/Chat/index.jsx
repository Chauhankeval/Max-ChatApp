import { useAppStore } from "@/Store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContectConatiner from "./Componet/Contect-Container/ContectConatiner";
import EmptyChatContainer from "./Componet/empty-Chat-Container/EmptyChatContainer";
import ChatContainer from "./Componet/Chat_Container/ChatContainer";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetUp === true) {
      toast("Please setup the Profile");
      navigate("/profile");
    }
  }, [navigate, userInfo]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {isUploading && (
        <div className="backdrop-blur-lg h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5">
          <h1 className="text-5xl animate-pulse">Uploading File</h1>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="backdrop-blur-lg h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5">
          <h1 className="text-5xl animate-pulse">Downloading File</h1>
          {fileDownloadProgress}%
        </div>
      )}
      <ContectConatiner />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
