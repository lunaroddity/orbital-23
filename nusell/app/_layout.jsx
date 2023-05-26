import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/auth";

export default function RootLayout() {
    return (
        <AuthProvider> {/* Only those logged in are permitted to view the contents of the app. */}
            <Slot />
        </AuthProvider>
    )
}