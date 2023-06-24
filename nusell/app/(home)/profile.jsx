import { View, Image, StyleSheet } from "react-native";
import { Button, Text } from 'react-native-paper';
import { supabase } from "../../lib/supabase";
import { chatClient } from "../../lib/chatClient";
import { HeaderBar } from '../(auth)/_layout.jsx';
import { Link } from 'expo-router';
import { AuthProvider } from "../../contexts/auth";


export default function ProfilePage() {
    const handleLogout = () => {
        supabase.auth.signOut();
        chatClient.disconnectUser();
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 120 }}>
            <HeaderBar />
            <Header firstName="liNUS" lastName="lee" username="liNUSyay" />
            <Button
                mode="contained"
                buttonColor ="#003D7C"
                rippleColor="#022E5B" 
                onPress={handleLogout}>Logout</Button>
            
            <Link style={styles.registerButton} href="/forgotpw">
                <Button 
                mode="contained"
                buttonColor ="#003D7C"
                rippleColor="#022E5B" 
                textColor='white'>{"Edit profile"}</Button>
            </Link>

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
    }

});