import { Channel, MessageList, MessageInput } from "stream-chat-expo";
import { useChat } from "../../../contexts/chat";
import { useLocalSearchParams } from "expo-router";

export default function ChannelScreen() {
  const { channel } = useChat();
  console.log(`channel: ${JSON.stringify(channel)}`)

  return (
    <Channel channel={channel}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
}