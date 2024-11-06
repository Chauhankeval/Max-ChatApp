import React, { useEffect, useState } from "react";
import ProfileInfo from "./Componets/ProfileInfo";
import NewDm from "./Componets/NewDm";
import { GET_ALL_CHANNELS, GET_CONTECT_FOR_DM } from "@/Services/urlHelper";
import { ApiService } from "@/Services/ApiService";
import { useAppStore } from "@/Store";
import ContectListDm from "@/components/ui/ContectListDm";
import CreateChannel from "./Componets/Create-Channel";
import { FaBell } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";

const ContectConatiner = () => {
  const {
    setDirectMessagesContact,
    directMessagesContact,
    channels,
    setChannels,
    notifications,
  } = useAppStore();

  const sampleNotifications = [
    {
      _id: "1",
      sender: {
        firstName: "Keval",
        lastName: "Chauhan",
        image: "uploads/profiles/sample-image.png",
      },
      content: "Hello! How are you?",
    },
    {
      _id: "2",
      sender: {
        firstName: "John",
        lastName: "Doe",
        image: "uploads/profiles/sample-image2.png",
      },
      content: "Meeting at 3 PM",
    },
  ];

  const getContactForDm = async () => {
    try {
      const url = GET_CONTECT_FOR_DM;
      const result = await ApiService.callServiceGetUserData(url);

      if (result?.contacts) {
        setDirectMessagesContact(result?.contacts); // Update only if the data is different
      }
    } catch (error) {
      console.log({ error });
      toast("This Contact Is No Longer Available");
    }
  };

  const getAllChannel = async () => {
    try {
      const url = GET_ALL_CHANNELS;
      const result = await ApiService.callServiceGetUserData(url);
      console.log("<<<<<RESULT", result);
      if (result.channels) {
        setChannels(result.channels);
      }
    } catch (error) {
      console.log({ error });
      toast("This Contact Is No Longer Available");
    }
  };

  useEffect(() => {
    getContactForDm();
    getAllChannel();
  }, []);
  return (
    <div className="relative md:w-[45vw] lg:w-[40vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="ml-0">
        <div className="my-5">
          <div className="flex items-center justify-around">
            <Title text="Direct Messages" />
            <NewDm />
          </div>
          <div className="max-h-[38vh] overflow-y-auto  scrollbar-hidden">
            <ContectListDm contacts={directMessagesContact} />
          </div>
        </div>
        <div className="my-5">
          <div className="flex items-center justify-around ml-0">
            <Title text="Channels" />
            <CreateChannel />
          </div>
          <div className="max-h-[38vh] overflow-y-auto  scrollbar-hidden">
            <ContectListDm contacts={channels} isChannel={true} />
          </div>
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContectConatiner;

const Logo = () => {
  const { notifications, userInfo } = useAppStore();
  console.log("<<<<<userInfo", userInfo);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // Lottie animation settings

  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z" fill="#8338ec"></path>
        <path d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z" fill="#975aed"></path>
        <path d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z" fill="#a16ee8"></path>
      </svg>
      <span className="text-3xl font-semibold">Max</span>

      {/* Notification Bell Icon */}
      <div
        className="relative cursor-pointer ml-8"
        onClick={() => setModalOpen(true)}
      >
        <svg
          className="w-7 h-7 text-gray-600"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2a7 7 0 017 7v4.5l1.29 1.29a1 1 0 01.21 1.09.75.75 0 01-.7.42H4.21a.75.75 0 01-.7-.42 1 1 0 01.21-1.09L5 13.5V9a7 7 0 017-7zm0 20a3 3 0 01-2.83-2h5.66a3 3 0 01-2.83 2z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notification Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>

          {/* Notification Content */}
          {loading ? (
            <div className="flex-1 flex flex-col justify-center items-center">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <h3 className="poppins-medium text-opacity-80 text-white lg:text-xl text-center mt-10">
                Loading contacts...
              </h3>
            </div>
          ) : notifications.length > 0 ? (
            <ScrollArea className="h-[250px]">
              <div className="mt-4 max-h-64 overflow-y-auto">
                {notifications.flat().map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 mb-2 rounded-lg cursor-pointer ${
                      notification.recipient._id === userInfo.id
                        ? notification.isRead
                          ? "bg-gray-100"
                          : "bg-blue-100"
                        : "bg-white" // Or any default background for notifications not meant for the logged-in user
                    }`}
                  >
                    {notification.recipient._id === userInfo.id && (
                      <p className="text-sm text-gray-700">
                        {notification?.sender?.firstName ||
                          notification?.sender?.lastName}
                      </p>
                    )}

                    {notification.recipient._id === userInfo.id &&
                      notification.content && (
                        <p className="text-sm text-gray-700">
                          {notification.content}
                        </p>
                      )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <h3 className="poppins-medium text-opacity-80 text-white lg:text-xl text-center mt-10">
                No new notifications
              </h3>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="upparcase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
