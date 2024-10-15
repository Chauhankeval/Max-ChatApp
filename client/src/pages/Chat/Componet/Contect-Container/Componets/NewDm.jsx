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
import Lottie from "react-lottie";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { HOST, SEARCH_CONTECTS } from "@/Services/urlHelper";
import { ApiService } from "@/Services/ApiService";
import { toast } from "sonner";
import { useAppStore } from "@/Store";

const NewDm = () => {
  const navigate = useNavigate();
 const {setSelectedChatType, setSelectedChatData} = useAppStore()
  // State for managing the dialog, search input, and contacts list
  const [openNewContectModel, setOpneNewContectModel] = useState(false);
  const [searchContect, setSearchContect] = useState([]); // State for search results
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [loading, setLoading] = useState(false); // State for loading animation


  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 0) {
        SearchContect(searchTerm);
      }
    }, 300); // Delay of 300ms

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout on unmount or re-render
  }, [searchTerm]);

  // Fetch search results

  const SearchContect = async (searchTerm) => {
    try {
      setLoading(true); // Start loading animation
      const url = SEARCH_CONTECTS;
      const result = await ApiService.callServicePostBodyData(url, {
        searchTerm,
      });

      if (result.contacts) {

        setSearchContect(result.contacts); // Updated to use "contacts"
      } else {
        setSearchContect([]);
        toast("No contacts found.");
      }
    } catch (error) {
      console.log(error);
      toast("Error fetching contacts. Please try again.");
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  const selectNewContact = (contact) => {
    console.log("<<<<contact",contact)
    setOpneNewContectModel(false)
    setSelectedChatType("contact")
    setSelectedChatData(contact)
    setSearchContect([])
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => setOpneNewContectModel(true)}
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent>Select New Contact</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContectModel} onOpenChange={setOpneNewContectModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please Select Contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search your contact"
              onChange={(e) => SearchContect(e.target.value)}
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
            />
          </div>

          {/* If contacts are found */}
          {searchContect.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchContect.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectNewContact(contact)}
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt="profile"
                            className="object-cover w-full h-full bg-black rounded-full"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                              contact.color
                            )}`}
                          >
                            {contact.firstName
                              ? contact.firstName.split("")[0]
                              : contact.email.split("")[0]}
                          </div>
                        )}
                      </Avatar>
                    </div>

                    {/* Display contact name or email */}
                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : ""}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Loading animation */}
          {loading && (
            <div className="flex-1 flex flex-col justify-center items-center">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">Loading contacts...</h3>
              </div>
            </div>
          )}

          {/* No contacts found */}
          {!loading && searchContect.length <= 0 && (
            <div className="flex-1 flex flex-col justify-center items-center">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hii! Search for a new{" "}
                  <span className="text-purple-500">Contact</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
