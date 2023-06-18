import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import { useChatClient } from "./useChatClient";
import { ChatProvider, useChat } from '../../../contexts/chat';
import { useAuth } from '../../../contexts/auth';
import { ChannelList } from 'stream-chat-expo';
import { useRouter } from 'expo-router';

// Used to determine whether to render the chat components.
export default function ChatPage() {
  const { clientIsReady } = useChatClient();
  const { user } = useAuth();
  const router = useRouter();
  const { setChannel } = useChat();

  if (!clientIsReady) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  const filters = {
    members: {
      '$in': [user.id]
    },
  };

  const sort = {
    last_message_at: -1,
  }

  return (
    <ChatProvider>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ChannelList
        onSelect={(channel) => {
          setChannel(channel);
          router.push({ pathname: "(chat)/channelScreen", params: {channel: channel} })
          }}
          filters={filters}
          sort={sort}/>
      </View>
    </ChatProvider>
  );
}