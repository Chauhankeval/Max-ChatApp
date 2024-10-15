import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { animationDefaultOptions, getColor } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { CREATE_CHANNEL, GET_ALL_CONTECT_FOR_DM } from "@/Services/urlHelper";
import { ApiService } from "@/Services/ApiService";
import { toast } from "sonner";
import { useAppStore } from "@/Store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/muiltiSelect";

const CreateChannel = () => {
  const navigate = useNavigate();
  const { setSelectedChatType, setSelectedChatData, addChannel } =
    useAppStore();
  // State for managing the dialog, search input, and contacts list
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [searchContect, setSearchContect] = useState([]); // State for search results

  const [loading, setLoading] = useState(false); // State for loading animation
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);
  const [channelName, setChannelName] = useState("");

  const getAllContacts = async () => {
    try {
      const result = await ApiService.callServiceGetUserData(
        GET_ALL_CONTECT_FOR_DM
      );
      if (result.contacts) {
        setAllContacts(result.contacts);
      }
    } catch (error) {
      console.log(error);
      toast("Error fetching contacts. Please try again.");
    }
  };

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContact.length > 0) {
        let reqobj = {
          name: channelName,
          members: selectedContact.map((contact) => contact.value),
        };
        const url = CREATE_CHANNEL;
        const result = await ApiService.callServicePostBodyData(url, reqobj);
        console.log(result, "<<<<resultresultresult");
        if (result) {
          setChannelName("");
          setSelectedContact([]);
          setNewChannelModel(false);
          addChannel(result.channel);
          toast("Channel Created SuccessFully");
        }
      }
    } catch (error) {
      setNewChannelModel(false);

      console.log(error);

    }
  };
  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => setNewChannelModel(true)}
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent>Create New Channel</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[450px]  flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please Fill The Details For Create New Channel
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Enter Channel Name"
              value={channelName}
              name="channelName"
              onChange={(e) => setChannelName(e.target.value)}
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Search Contacts"
              value={selectedContact}
              onChange={setSelectedContact}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  No results found.
                </p>
              }
            />
          </div>
          <div className=" bg-purple-700 text-white">
            <Button
              onClick={createChannel}
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
