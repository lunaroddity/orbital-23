import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/auth";
import { OverlayProvider, Chat } from "stream-chat-expo";
import { chatClient } from "../lib/chatClient";

export default function RootLayout() {
    return (
        <OverlayProvider>
            <Chat client={chatClient}>
                <AuthProvider>
                    <Slot />
                </AuthProvider>
            </Chat>
        </OverlayProvider>
    )
}