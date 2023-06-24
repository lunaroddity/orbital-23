import React, { useState } from "react";

// Used to store the details of trhe current Channel and the Thread as set by the user
// on selecting the channel from the ChannelList or Thread from the Message list.
export const ChatContext = React.createContext({
  channel: null,
  setChannel: (channel) => {},
  thread: null,
  setThread: (thread) => {},
});

export const ChatProvider = ({ children }) => {
  const [channel, setChannel] = useState();
  const [thread, setThread] = useState();

  return <ChatContext.Provider value={{ channel, setChannel, thread, setThread }}>{children}</ChatContext.Provider>
}

export const useChat = () => React.useContext(ChatContext);