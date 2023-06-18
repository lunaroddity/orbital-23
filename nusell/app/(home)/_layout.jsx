import { Tabs } from 'expo-router';

export default function HomeLayout() {
    // Creates clickable tabs for navigation at the bottom of the screen.
    return (
                <Tabs>
                    <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
                    <Tabs.Screen name="newPost" options={{ tabBarLabel: "Add Post", unmountOnBlur: true}} />
                    <Tabs.Screen name="(chat)" options={{ tabBarLabel: "Chat", headerShown: false }} />
                    <Tabs.Screen name="profile" options={{ tabBarLabel: "Profile" }} />
                </Tabs>
    );
}