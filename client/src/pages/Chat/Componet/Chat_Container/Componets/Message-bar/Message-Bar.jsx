import { useSocket } from "@/Context/SocketContext";
import { ApiService } from "@/Services/ApiService";
import { UPLOAD_FILE_IN_DM } from "@/Services/urlHelper";
import { useAppStore } from "@/Store";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { toast } from "sonner";
// Adjust this import according to the library you are using

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const Socket = useSocket();
  // const fileInputRef =
  const { selectedChatType, selectedChatData, userInfo,setIsUploading ,setFileUploadProgress} = useAppStore();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const fileInputRef = useRef(null);
  const emojiRef = useRef();

  useEffect(() => {
    // Function to handle click outside the emoji picker
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleSendMessage = async () => {
    try {
      if (selectedChatType === "contact") {
        console.log("Sending message to contact:", selectedChatData._id);
        
        Socket.emit("sendMessage", {
          sender: userInfo.id,
          content: message,
          recipient: selectedChatData._id,
          messageType: "text",
          fileUrl: undefined,
        });
  
        // Clear message input after sending
        setMessage("");
      } 
      // For channel messages
      else if (selectedChatType === "channel") {
        console.log("Sending channel message to channel ID:", selectedChatData._id);
  
        Socket.emit("send-channel-message", {
          sender: userInfo.id,
          content: message,
          messageType: "text",
          fileUrl: undefined,
          channelId: selectedChatData._id,
        });
  
        // Clear message input after sending
        setMessage("");
      } 
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
    }
  };
  

  const hadleAttechMentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      console.log(file);
  
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
  
        const url = UPLOAD_FILE_IN_DM;
        const result = await ApiService.callServicePostFormData(url, formData, {
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });
  
        console.log("<<<result", result);
  
        if (result.filePath) {
          setIsUploading(false);
  
          if (selectedChatType === "contact") {
            Socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: result.filePath,
            });
          }else if (selectedChatType  === "channel") {
            Socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: result.filePath,
              channelId : selectedChatData._id
            }) 
          }
  
          toast("File uploaded successfully!");
        } else {
          toast("File upload failed.");
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log({ error });
      toast("Got Some Error While you are Trying To upload file");
    }
  };
  
  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji); // Append the emoji to the message
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of Enter key (like new line)
      handleSendMessage(); // Call the function to send the message
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          type="text"
          placeholder="Type Message Here!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Add the key down event handler
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={hadleAttechMentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="*/*" // Accept all file types
          style={{ display: "none" }} // Hide the file input
        />
        <div className="relative" ref={emojiRef}>
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen((prev) => !prev)} // Toggle the emoji picker
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          {emojiPickerOpen && (
            <div className="absolute bottom-16 right-0 z-10">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme="dark"
                open={emojiPickerOpen}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        className="bg-[#841ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all"
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
