import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/auth";
import { OverlayProvider, Chat } from "stream-chat-expo";
import { chatClient } from "../lib/chatClient";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
    return (
        <OverlayProvider>
            <PaperProvider>
                <AuthProvider>
                    <Chat client={chatClient}>
                        <Slot />
                    </Chat>
                </AuthProvider>
            </PaperProvider>
        </OverlayProvider>
    )
}