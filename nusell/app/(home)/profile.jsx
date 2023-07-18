import { View, Image, StyleSheet } from "react-native";
import { Button, Text } from 'react-native-paper';
import { supabase } from "../../lib/supabase";
import { chatApiKey } from "../../lib/chatClient";
import { HeaderBar } from '../(auth)/_layout.jsx';
import { useRouter } from 'expo-router';
import { StreamChat } from "stream-chat";


export default function ProfilePage() {
  const router = useRouter();
  const disconnectChat = async () => {
    const chatClient = StreamChat.getInstance(chatApiKey);
    await chatClient.disconnectUser();
    return;
  }

  const handleLogout = async () => {
    await disconnectChat();
    const { error } = await supabase.auth.signOut();
  };

  return (
      <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
          <HeaderBar />
          <Header firstName="liNUS" lastName="lee" username="liNUSyay" />
          <Button
            style={styles.button}
            mode="contained"
            buttonColor ="#003D7C"
            rippleColor="#022E5B" 
            compact={true}
            onPress={handleLogout}>Logout</Button>            
          <Button
            style={styles.button}
            mode="contained"
            buttonColor ="#003D7C"
            rippleColor="#022E5B" 
            textColor='white'
            onPress={() => router.push("/editProfile")}>Edit Profile</Button>
            <Button
            style={styles.button}
            mode="contained"
            buttonColor ="#003D7C"
            rippleColor="#022E5B" 
            textColor='white'
            onPress={() => router.push("/(feed)/likePage")}>Likes</Button>
      </View>
  )
}

function Avatar() {
    return (
      <View style={styles.avatarContainer}>
        <Image 
        style={styles.avatar}
        source={{ uri: "https://pbs.twimg.com/media/DiRqvKmVMAMqWCQ.jpg" }} />
      </View>
    );
  }

  function Header(props) {
    const { firstName, lastName, username } = props;
    return (
      <View style={styles.headerContainer}>
        <UsernameAvatar username={username} />
        <Name firstName={firstName} lastName={lastName} />
      </View>
    );
  }

  function UsernameAvatar(props) {
    const { username } = props;
    return (
        <View style={styles.usernameAvatar}>
            <Avatar />
            <Text>{username}</Text>
        </View>
    )
  }

  function Name(props) {
    const { firstName, lastName } = props;
    return (
        <View style={styles.name}>
            <Text>{firstName}</Text>
            <Text>{lastName}</Text>
        </View>
    )
  }

  export const styles = StyleSheet.create({
    avatarContainer: { backgroundColor: 'white' },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 50,
      marginRight: 5,
      borderColor: '#003D7C',
      borderWidth: 2
    },
    headerContainer: {
        marginVertical: 10,
        padding: 8,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'black',
        flexBasis: 'auto'
    },
    usernameAvatar: {
        flexDirection: "row",
        alignItems: 'center',
    },
    name: {
        flexDirection: "row"
    },
    button: {
      marginVertical: 10,
    },
});