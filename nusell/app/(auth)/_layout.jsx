import { Stack } from "expo-router";
import { Image } from "react-native";

// Creates a header bar with the NUSell logo.
function LogoTitle() {
    return (
        <Image 
            style={{ width: 100, height: 50}}
            source={require("../../assets/logo.png")}
        />
    );
}

export function HeaderBar() {
    return (
        <Stack.Screen
                    options={{
                        title: "login",
                        headerStyle: { backgroundColor: "#003D7C" },
                        headerTitle: (props) => <LogoTitle {...props} />,
                        headerTitleAlign: 'center'
                    }} 
            />
    );
}

export default function AuthLayout() {
    return <Stack />;
} 