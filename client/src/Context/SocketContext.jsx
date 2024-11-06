import { HOST } from "@/Services/urlHelper";
import { useAppStore } from "@/Store";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const {
    userInfo,
    selectedChatData,
    selectedChatType,

    addMessage,
  } = useAppStore();

  useEffect(() => {
    if (userInfo && userInfo.id) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: {
          userId: userInfo.id,
        },
      });
      socket.current.on("connect", () => {
        console.log("Connected To Socket Server");
      });

      const handleRecieveMessage = (message) => {
        const {
          selectedChatData,
          selectedChatType,
          addMessage,
          addContactsInDMContacts,
          setNotification,
          notifications,
        } = useAppStore.getState();
        if (
          selectedChatType !== undefined &&
          (selectedChatData?._id === message?.sender?._id ||
            selectedChatData?._id === message?.recipient?._id)
        ) {
          if (!notifications.includes(message)) {
            setNotification([message]);
          }
          addMessage(message);
        }
        addContactsInDMContacts(message);
      };

      const handleChannleReciveMessage = async (message) => {
        const {
          selectedChatData,
          selectedChatType,
          addMessage,
          addChannelInChannelList,
        } = useAppStore.getState();
        if (
          selectedChatType !== undefined &&
          selectedChatData._id === message?.channelId
        ) {
          console.log("Message passed condition check:", message);
          addMessage(message);
        }
        addChannelInChannelList(message);
      };

      socket.current.on("recieveMessage", handleRecieveMessage);
      socket.current.on("recieve-channel-message", handleChannleReciveMessage);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
