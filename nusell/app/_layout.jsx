import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/auth";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
    return (
        <PaperProvider>
            <AuthProvider>
                <Slot />
            </AuthProvider>
        </PaperProvider>
    )
}