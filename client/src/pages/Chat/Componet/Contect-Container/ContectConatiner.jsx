import React, { useEffect } from "react";
import ProfileInfo from "./Componets/ProfileInfo";
import NewDm from "./Componets/NewDm";
import { GET_ALL_CHANNELS, GET_CONTECT_FOR_DM } from "@/Services/urlHelper";
import { ApiService } from "@/Services/ApiService";
import { useAppStore } from "@/Store";
import ContectListDm from "@/components/ui/ContectListDm";
import CreateChannel from "./Componets/Create-Channel";

const ContectConatiner = () => {
  const { setDirectMessagesContact, directMessagesContact , channels, setChannels } = useAppStore();

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

  const getAllChannel = async() =>{
    try {
      const url = GET_ALL_CHANNELS
      const result = await ApiService.callServiceGetUserData(url)
      console.log("<<<<<RESULT", result)
      if(result.channels){
        setChannels(result.channels)
      }
    }catch (error) {
      console.log({ error });
      toast("This Contact Is No Longer Available");
    }
  }

  useEffect(() => {
    getContactForDm();
    getAllChannel()
  });
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
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Max</span>
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
