import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, TouchableHighlight, Dimensions } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { supabase } from '../../../lib/supabase';
import { HeaderBar } from '../../(auth)/_layout.jsx';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('screen');
const halfWidth = width / 2;

export default function LikePage() {
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);

  async function fetchPosts() {
    //let { data } = await supabase.from('likes').select('*').eq('id', id).single();
    const { data, error } = await supabase
  .from('likes')
  .select('likedposts')
  .eq('id', userId);

if (error) {
  // Handle the error
} else {
  const likedPostsArray = data.map((row) => row.likedposts);
  console.log(likedPostsArray); // Array of arrays containing likedposts UUIDs
}
    setPosts(data);
    setRefresh(false);
  }

  // Initial post fetch on loading
  useEffect(() => {  
    fetchPosts();
  }, []);

  // Post fetch upon pull to refresh
  useEffect(() => {
    if (refresh) {
      fetchPosts();
    }
  }, [refresh]);
  
  return (
    <View style={styles.view}>
      <HeaderBar />
      <FlatList 
        data={posts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostItem post={item} />} 
        refreshing={refresh}
        onRefresh={() => setRefresh(true)}
      />
    </View>
  );
}

// Function to render posts in the home feed.
// Since yet to be able to set username and profile pics, defaulted to liNUS
function PostItem({ post }) {
  const router = useRouter();
    return (
      <View>
        <TouchableHighlight 
          onPress={() => router.push({ pathname: "(feed)/viewPost", params: { id: post.id }})
        }>
          <Post
            username="liNUS"
            image={post.image_url}
            title={post.title}
            price={post.price} />
        </TouchableHighlight>
      </View>
    );
}
     
export function Post( props ) {
  const { username, image, title, price } = props;
  return (
    <View style={styles.postContainer}>
      <Header username={username} />
      <Image style={styles.postImage} source={{ uri: image }} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>${price}</Text>
    </View>
  );
}

function Header({username}) {
  return (
    <View style={styles.headerContainer}>
      <Avatar />
      <Text>{username}</Text>
    </View>
  );
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
      
export const styles = StyleSheet.create({
  view: { flex: 1, backgroundColor: 'white' },
  avatarContainer: { backgroundColor: 'white' },
  avatar: {
    flex: 1,
    width: 35,
    height: 35,
    borderRadius: 50,
    marginRight: 5,
  },
  headerContainer: {
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
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