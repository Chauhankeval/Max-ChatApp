import { useAppStore } from "@/Store";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { ApiService } from "@/Services/ApiService";
import { GET_CHANNELS_MESSAGES, GET_MESSAGES, HOST } from "@/Services/urlHelper";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = () => {
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading s

  const scrollRef = useRef();
  const {
    userInfo,
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();

  const getMessages = async () => {
    setLoading(true);
    try {
      const url = GET_MESSAGES;
      const result = await ApiService.callServicePostBodyData(url, {
        id: selectedChatData._id,
      });

      if (result?.messages) {
        setSelectedChatMessages(result?.messages);
      }
    } catch (error) {
      console.log({ error });
      toast("This Message Is No Longer Available");
    } finally {
      setLoading(false);
    }
  };

  const GetChannelMessages = async () => {
    setLoading(true);
    try {
      const url = GET_CHANNELS_MESSAGES;
      const result = await ApiService.callServiceGetUserData(`${url}${selectedChatData._id}`);

      if (result?.messages) {
        setSelectedChatMessages(result?.messages);
      }
    } catch (error) {
      console.log({ error });
      toast("This Message Is No Longer Available");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") GetChannelMessages();
    }
  }, [selectedChatType, selectedChatData, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;

    return imageRegex.test(filePath);
  };

  const renderMessages = () => {
    let lastdate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastdate;
      lastdate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderedMessages(message)}
          {selectedChatType === "channel" && renderedChannelMessages(message)}
        </div>
      );
    });
  };

  const renderedChannelMessages = (message) => {
    return (
      <div
        className={`mt-5 ${
          message?.sender?._id === userInfo.id ? "text-right" : "text-left"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message?.sender?._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 hover:bg-[#8417ff]/10 hover:text-[#8417ff]"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 hover:bg-[#2a2b33]/10 hover:text-white/90"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words transition-colors duration-200 ml-9`}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              message?.sender?._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setImageURL(message.fileUrl);
                  setShowImage(true);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/8- text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>

                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}

        {message.sender._id !== userInfo.id ? (
          <div className="flex  items-center gap-3">
            <Avatar className="h-6 w-6 rounded-full overflow-hidden">
              <AvatarImage
                src={`${HOST}/${message?.sender.image}`}
                alt="profile"
                className="h-8 w-8 bg-black rounded-full"
              />

              <AvatarFallback
                className={`uppercase h-6 w-6 text-lg  flex items-center justify-center rounded-full ${getColor(
                  message?.sender?.color
                )}`}
              >
                {message?.sender?.firstName
                  ? message?.sender?.firstName?.split("").shift()
                  : message?.sender?.email?.split("").shift()}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm text-white/60">
              {`${message?.sender?.firstName} ${message?.sender?.lastName}`}
            </div>
            <div className="text-sm text-white/40">
              {moment(message.timestamp).format("LT")}
            </div>
          </div>
        ) : (
          <div className="text-sm text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  // Function to download the file
  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);

    try {
      const response = await ApiService.callServiceGetUserDownload(
        `${HOST}/${url}`,
        {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentCompleted = Math.round((loaded * 100) / total);
            setFileDownloadProgress(percentCompleted);
          },
        }
      );

      // Create a Blob from the response data and initiate the download
      const urlBlob = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", url.split("/").pop()); // Extract filename from URL
      document.body.appendChild(link);

      link.click();
      link.remove();

      window.URL.revokeObjectURL(urlBlob);
      setIsDownloading(false);
      setFileDownloadProgress(0);
    } catch (error) {
      setIsDownloading(false);
      setFileDownloadProgress(0);
      console.error("Download failed:", error);
    }
  };
  const renderedMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 hover:bg-[#8417ff]/10 hover:text-[#8417ff]" // Add hover styles here
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 hover:bg-[#2a2b33]/10 hover:text-white/90" // Add hover styles here
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words transition-colors duration-200`} // Add smooth transition
        >
          {message.content}
        </div>
      )}

      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setImageURL(message.fileUrl);
                setShowImage(true);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/8- text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>

              <span
                class="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg">
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              className="h-[80vh] w-full bg-cover"
            />
          </div>

          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-3xl text-white hover:bg-black/50 transition-all duration-300"
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown />
            </button>

            <button
              className="bg-black/20 p-3 text-3xl text-white hover:bg-black/50 transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
