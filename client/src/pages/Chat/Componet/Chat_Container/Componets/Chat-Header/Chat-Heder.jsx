import { useAppStore } from "@/Store";
import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { HOST } from "@/Services/urlHelper";
import { getColor } from "@/lib/utils";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between">
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-center ml-8">
          <div className="w-12 h-12 relative">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {/* If chat is a channel, show '#', otherwise show the user's avatar */}
              {selectedChatType === "channel" ? (
                <div className="bg-[#ffffff22] h-full w-full flex items-center justify-center rounded-full">
                  #
                </div>
              ) : selectedChatData?.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData?.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black rounded-full"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedChatData?.color
                  )}`}
                >
                  {selectedChatData?.firstName
                    ? selectedChatData?.firstName?.[0]
                    : selectedChatData?.email?.[0]}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {selectedChatType === "channel" && selectedChatData?.name}
            {selectedChatType === "contact" &&
              `${selectedChatData?.firstName} ${selectedChatData?.lastName}`}
          </div>
         
        </div>
        <div className="flex gap-5 items-center justify-center mr-8">
          <button
            onClick={closeChat}
            className="text-3xl  text-neutral-400 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiCloseFill />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
