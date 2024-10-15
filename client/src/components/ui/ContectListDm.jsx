import { useAppStore } from "@/Store";
import React from "react";
import moment from "moment"; // Assuming you're using moment.js to format the date
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/Services/urlHelper";

const ContectListDm = ({ contacts, isChannel = false }) => {
  const {
    selectedChatType,
    setSelectedChatType,
    selectedChatData,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }
    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]); // Clear messages if the chat changes
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f1]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 relative">
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {/* If isChannel is true, show #, otherwise show the Avatar */}
                {isChannel ? (
                  <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                    #
                  </div>
                ) : contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="object-cover h-10 w-10 bg-black rounded-full"
                  />
                ) : (
                  <div
                    className={`${
                      selectedChatData && selectedChatData._id === contact._id
                        ? "bg-[#ffffff22] border border-white/70"
                        : getColor(contact.color)
                    } 
                    uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}
                  >
                    {contact.firstName
                      ? contact?.firstName?.split("")[0]
                      : contact?.email?.split("")[0]}
                  </div>
                )}
              </Avatar>
            </div>

            {/* This div will contain the name and last message time */}
            <div className="flex flex-col ml-2">
              {/* Use ml-2 to add spacing */}
              {isChannel ? (
                <span>{contact.name}</span>
              ) : (
                <span>{`${contact.firstName} ${contact.lastName}`}</span>
              )}
              <div className="text-xs text-gray-400">
                {/* Format lastMessageTime using moment */}
                Last message: {moment(contact.lastMessageTime).fromNow()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContectListDm;
