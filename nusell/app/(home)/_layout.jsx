import { Tabs } from 'expo-router';
import { Ionicons } from '../../node_modules/@expo/vector-icons';

export default function HomeLayout() {
    const homeIcon = ({ focused }) => {
        let iconName;
        iconName = focused ? "home" : "home-outline";
        return <Ionicons name={iconName} size={30} color={"black"} />
    }

    const newPostIcon = ({ focused }) => {
        let iconName;
        iconName = focused ? "add-circle" : "add-circle-outline";
        return <Ionicons name={iconName} size={30} color={"black"} />
    }

    const profileIcon = ({ focused }) => {
        let iconName;
        iconName = focused ? "person" : "person-outline";
        return <Ionicons name={iconName} size={30} color={"black"} />
    }

    return (
        <Tabs>
            <Tabs.Screen name="(feed)" options={{ tabBarIcon: homeIcon, tabBarShowLabel: false, headerShown: false }} />
            <Tabs.Screen name="newPost" options={{ tabBarIcon: newPostIcon, tabBarShowLabel: false, unmountOnBlur: true}} />
            <Tabs.Screen name="(chat)/chat" options={{ tabBarLabel: "Chat", headerShown: false }} />
            <Tabs.Screen name="profile" options={{ tabBarIcon: profileIcon, tabBarShowLabel: false, }} />
        </Tabs>
    );
}