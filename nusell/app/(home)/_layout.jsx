import { Tabs } from 'expo-router';

export default function HomeLayout() {
    // Creates clickable tabs for navigation at the bottom of the screen.
    return (
        <Tabs>
            <Tabs.Screen name="(feed)" options={{ tabBarLabel: "Home", headerShown: false }} />
            <Tabs.Screen name="newPost" options={{ tabBarLabel: "Add Post", unmountOnBlur: true}} />
            <Tabs.Screen name="profile" options={{ tabBarLabel: "Profile" }} />
        </Tabs>
    );
}