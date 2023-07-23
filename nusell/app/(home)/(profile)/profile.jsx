import { View, Image, StyleSheet, FlatList,  Dimensions } from "react-native";
import { Button, Text } from 'react-native-paper';
import { supabase } from "../../../lib/supabase";
import { HeaderBar } from '../../(auth)/_layout.jsx';
import { useRouter } from 'expo-router';
import { useAuth } from "../../../contexts/auth";
import { useEffect, useState } from "react";
import { TouchableHighlight } from "react-native";

const { width, height } = Dimensions.get('screen');
const halfWidth = width / 2;

export default function ProfilePage() {
  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [avatar, setAvatar] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  async function fetchProfile() {
    let { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    console.log(`profileData: ${JSON.stringify(data)}`);

    if (data.avatar !== null) {
      setAvatar(data.avatar);
    } else {
      setAvatar("https://pbs.twimg.com/media/DiRqvKmVMAMqWCQ.jpg");
    }
    setProfile(data);
  }

  async function fetchPosts() {
    let { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('inserted_at', { ascending: false });
    setPosts(data);
  }

  // Initial data fetch on loading
  useEffect(() => {  
    fetchProfile();
    fetchPosts();
  }, []);

  // Data fetch upon pull to refresh
  useEffect(() => {
    if (refresh) {
      fetchProfile();
      fetchPosts();
      setRefresh(false);
    }
  }, [refresh]);

  const oldAvatar = encodeURIComponent(avatar);

  return (
      <View style={styles.view}>
        <HeaderBar />
        <Header 
          firstName={profile.firstName}
          lastName={profile.lastName}
          username={profile.username}
          avatar={avatar}
        />          
        <Button
          style={styles.button}
          mode="outlined"
          outlineColor ="#003D7C"
          rippleColor="#ccc" 
          textColor='black'
          onPress={() => {
            router.push({pathname: "(profile)/editProfile",
              params: { 
                oldFirstName: profile.firstName,
                oldLastName: profile.lastName,
                oldUsername: profile.username,
                oldAvatar: oldAvatar}})}}>Edit Profile</Button>
        <FlatList 
          data={posts}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostItem post={item} />}
          refreshing={refresh}
          onRefresh={() => setRefresh(true)}
        />
      </View>
  )
}

function Header(props) {
  const { firstName, lastName, username, avatar } = props;
  return (
    <View style={styles.headerContainer}>
      <UsernameAvatar username={username} avatar={avatar} />
      <Name firstName={firstName} lastName={lastName} />
    </View>
  );
}

function UsernameAvatar(props) {
  const { username, avatar } = props;
  return (
      <View style={styles.usernameAvatar}>
          <Avatar avatar={avatar} />
          <Text style={styles.username}>{username}</Text>
      </View>
  )
}

export function Avatar(props) {
  const { avatar } = props;

    return (
      <View>
        <Image 
          style={styles.avatar}
          source={{ uri: avatar }} />
      </View>
    );
  }

  function Name(props) {
    const { firstName, lastName } = props;
    const name = firstName + " " + lastName;

    return (
        <View style={styles.name}>
          <Text style={{ fontSize: 14 }}>{name}</Text>
        </View>
    )
  }

  function PostItem({ post }) {
    const router = useRouter();
      return (
        <View>
          <TouchableHighlight 
            onPress={() => router.push({ pathname: "(profile)/viewPost", params: { id: post.id }})
          }>
            <View style={styles.postContainer}>
              <Image style={styles.postImage} source={{ uri: post.image_url }} />
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.price}>${post.price}</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
  }

  export const styles = StyleSheet.create({
    view: {
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: "#fff"
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 50,
    },
    headerContainer: {
        marginTop: 10,
        padding: 8,
        backgroundColor: 'white',
        marginHorizontal: 10,
    },
    usernameAvatar: {
        flexDirection: "row",
        alignItems: 'center',
    },
    username: {
      marginLeft: 5,
      fontWeight: "bold",
      fontSize: 20
    },
    name: {
        flexDirection: "row",
        marginVertical: 5,
    },
    button: {
      marginHorizontal: 10,
      marginBottom: 5,
    },
    postImage: {
      width: 160,
      height: 160,
    },
     title: {
      paddingHorizontal: 5,
      paddingVertical: 3,
      fontWeight: 'bold',
    },
    price: {
      paddingHorizontal: 5,
    },
    postContainer: {
      width: halfWidth,
      alignItems: 'flex-start',
      backgroundColor: 'white',
      padding: 10,
    }
});