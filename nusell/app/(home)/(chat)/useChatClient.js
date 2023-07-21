import { useState, useEffect } from 'react';
import { chatApiKey } from '../../../lib/chatClient';
import { useAuth } from '../../../contexts/auth';
import { supabase } from '../../../lib/supabase';
import JWT from 'expo-jwt';
import { StreamChat } from 'stream-chat';

const chatClient = StreamChat.getInstance(chatApiKey);

export const useChatClient = () => {
  const [clientIsReady, setClientIsReady] = useState(false);
  const { user } = useAuth();
  console.log(`user: ${JSON.stringify(useAuth())}`)
  const userDetails = {
    id: user.id,
  }
  console.log(`user.id: ${user.id}`);

  useEffect(() => {
    const setupClient = async () => {
      const { data } = await supabase.auth.getSession();
      console.log(`data: ${JSON.stringify(data)}`);
      const key = process.env.JWT
      const sessionData = JWT.decode(data.session.access_token, key);
      console.log(`sessionData: ${JSON.stringify(sessionData)}`);
      const chatUserToken = JWT.encode({ user_id: user.id, ...sessionData }, key);
      console.log(`token: ${JSON.stringify(chatUserToken)}`);
      
      try {
        chatClient.connectUser(userDetails, chatUserToken);
        setClientIsReady(true);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`An error occurred while connecting the user: ${error.message}`);
        }
      }
    };

    // If the chat client has a value in the field `userID`, a user is already connected
    // and we can skip trying to connect the user again.
    if (!chatClient.userID) {
      setupClient();
    }
  }, []);

  console.log("useChatClient client ready? " + clientIsReady);
  return {
    clientIsReady,
  };
};