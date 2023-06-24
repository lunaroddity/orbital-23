import { StreamChat } from 'stream-chat';

export const chatApiKey = process.env.CHAT_API_KEY

export const chatClient = StreamChat.getInstance(chatApiKey);