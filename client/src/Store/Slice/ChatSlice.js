export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContact: [],

  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,

  setIsUploading: (isUploading) => set({ isUploading }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),

  channels: [],

  setChannels: (newChannels) => {
    const currentChannels = get().channels;

    // Filter out channels that are already in the state to avoid duplicates
    const filteredChannels = newChannels.filter(
      (newChannel) =>
        !currentChannels.some((channel) => channel._id === newChannel._id)
    );

    // If there are new channels to add, update the state
    if (filteredChannels.length > 0) {
      set({ channels: [...currentChannels, ...filteredChannels] });
    }
  },

  addChannel: (channel) => {
    const channels = get.channel;
    set({ channels: [channel, ...channels] });
  },
  setDirectMessagesContact: (newDirectMessagesContact) => {
    const currentContacts = get().directMessagesContact;

    // Compare the stringified version of the arrays to detect changes in values
    if (
      JSON.stringify(currentContacts) !==
      JSON.stringify(newDirectMessagesContact)
    ) {
      set({ directMessagesContact: newDirectMessagesContact });
    }
  },

  setSelectedChatType: (selectedChatType) => {
    const currentType = get().selectedChatType;
    if (currentType !== selectedChatType) {
      set({ selectedChatType });
    }
  },

  setSelectedChatData: (selectedChatData) => {
    const currentData = get().selectedChatData;
    if (currentData?._id !== selectedChatData?._id) {
      // Prevent setting if the same data
      set({ selectedChatData });
    }
  },

  setSelectedChatMessages: (selectedChatMessages) => {
    const currentMessages = get().selectedChatMessages;
    if (
      JSON.stringify(currentMessages) !== JSON.stringify(selectedChatMessages)
    ) {
      set({ selectedChatMessages });
    }
  },

  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),

  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    // Prevent unnecessary state updates if the same message is being added
    const newMessage = {
      ...message,
      recipient:
        selectedChatType === "channel"
          ? message?.recipient
          : message?.recipient?._id,
      sender:
        selectedChatType === "channel" ? message?.sender : message?.sender?._id,
    };

    const messageExists = selectedChatMessages.some(
      (msg) => msg._id === newMessage._id
    );

    if (!messageExists) {
      set({
        selectedChatMessages: [...selectedChatMessages, newMessage],
      });
    }
  },

  addChannelInChannelList: (message) => {
    const channels = get().channels;
    const data = channels.find((channel) => channel._id === message.channelId);
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );
  
    if (index !== -1 && index !== undefined) {
      channels.splice(index, 1);
      channels.unshift(data);
    }
  },
  addContactsInDMContacts: (message) => {
    const userId = get().userInfo.id;
    const fromId = message.sender._id === userId ? message.recipient._id : message.sender._id;
    const fromData = message.sender._id === userId ? message.recipient : message.sender;
    const dmContacts = get().directMessagesContacts;
    
    const data = dmContacts?.find((contact) => contact._id === fromId);
    const index = dmContacts?.findIndex((contact) => contact._id === fromId);
  
    if (index !== -1 && index !== undefined) {
      dmContacts?.splice(index, 1);
      dmContacts?.unshift(data);
    } else {
      dmContacts?.unshift(fromData);
    }
  
    set({ directMessagesContacts: dmContacts });
  },


  notifications: [], 

  setNotification: (notification) => {
    const currentNotifications = get().notifications;
    set({ notifications: [...currentNotifications, notification] });
  },


  
  
});
