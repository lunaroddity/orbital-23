import { View, Image, StyleSheet } from "react-native";
import { Button, Text } from 'react-native-paper';
import { supabase } from "../../../lib/supabase";
import { HeaderBar } from '../../(auth)/_layout.jsx';
import { useRouter } from 'expo-router';
import { useAuth } from "../../../contexts/auth";
import { useEffect, useState } from "react";


export default function ProfilePage() {
  const [profile, setProfile] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  async function fetchProfile() {
    let { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    console.log(`profileData: ${JSON.stringify(data)}`);
    setProfile(data);
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
      <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 20 }}>
          <HeaderBar />
          <Header 
            firstName={profile.firstName}
            lastName={profile.lastName}
            username={profile.username}
          />          
          <Button
            style={styles.button}
            mode="contained"
            buttonColor ="#003D7C"
            rippleColor="#022E5B" 
            textColor='white'
            onPress={() => router.push("/editProfile")}>Edit Profile</Button>
      </View>
  )
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

function Avatar() {
  const [avatar, setAvatar] = useState('');
  const { user } = useAuth();
    async function fetchAvatar() {
      let { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      console.log(`profileData: ${JSON.stringify(data)}`);
      if (data.profilePicture !== null) {
        setAvatar(data.profilePicture);
      } else {
        setAvatar("https://pbs.twimg.com/media/DiRqvKmVMAMqWCQ.jpg");
      }
    }

    useEffect(() => {
      fetchAvatar();
    }, []);

    return (
      <View style={styles.avatarContainer}>
        <Image 
        style={styles.avatar}
        source={{ uri: avatar }} />
      </View>
    );
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