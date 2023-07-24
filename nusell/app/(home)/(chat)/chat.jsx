import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import { useChatClient } from "./useChatClient";
import { ChatProvider, useChat } from '../../../contexts/chat';
import { useAuth } from '../../../contexts/auth';
import { ChannelList, Channel, MessageList, MessageInput } from 'stream-chat-expo';
import { createStackNavigator } from '@react-navigation/stack';

// Used to determine whether to render the chat components.
export default function ChatPage() {
  const { clientIsReady } = useChatClient();
  const { user } = useAuth();
  const Stack = createStackNavigator();

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
  
  const ChannelListScreen = ( props ) => {
    const { setChannel } = useChat();

    return (
      <View>
        <ChannelList
          onSelect={(channel) => {
            const { navigation } = props;
            setChannel(channel);
            navigation.navigate('ChannelScreen');
          }}
            filters={filters}
            sort={sort} 
        />
      </View>
        
    );
  }

  const ChannelScreen = ( props ) => {
    const { channel } = useChat();

    return (
      <Channel channel={channel}>
        <MessageList />
        <MessageInput />
      </Channel>
    );
  }

  return (
    <ChatProvider>
      <View style={{flex: 1, justifyContent: "flex-start" }}>
        <Stack.Navigator>
          <Stack.Screen 
            name='ChannelListScreen'
            options={{ 
              title: "Chat",
              headerStyle: {backgroundColor: "#003D7C"},
              headerTintColor: "#fff",
            }}
            component={ChannelListScreen} 
          />
          <Stack.Screen
            name='ChannelScreen'
            options={{
              headerStyle: {backgroundColor: "#003D7C"},
              headerTintColor: "#fff"}}
            component={ChannelScreen}
          />
        </Stack.Navigator>
      </View>
    </ChatProvider>
  );
}