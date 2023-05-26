import { Stack } from "expo-router";
import { Image } from "react-native";

function LogoTitle() {
    return (
        <Image 
            style={{ width: 100, height: 50}}
            source={require("../../assets/logo.png")}
        />
    );
}

// Header bar component with the NUSell logo.
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