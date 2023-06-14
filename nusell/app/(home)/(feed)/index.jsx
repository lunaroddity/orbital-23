import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, TouchableHighlight } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { supabase } from '../../../lib/supabase';
import { HeaderBar } from '../../(auth)/_layout.jsx';
import { useRouter } from 'expo-router';

// Function for search bar.
const SearchBar = ({ query, setQuery }) => {
  return (
    <View>
      <TextInput
        backgroundColor="#fff"
        mode='flat'
        placeholder="Enter Search"
        onChangeText={(text) => setQuery(text)}
        value={query} />
    </View>
  );
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [query, setQuery] = useState('');

  async function fetchPosts() {
    let { data } = await supabase.from('posts').select('*').order('inserted_at', { ascending: false });
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
      <SearchBar query={query} setQuery={setQuery} />
        <FlatList 
            data={posts.filter((post) => {
              if (query === '') {
                return post;
              } else if (post.description.toLowerCase().includes(query.toLowerCase())) {
                return post;
              }
              })}
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
// TODO: make posts interactive
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
    padding: 5,
    fontWeight: 'bold',
  },
  price: {
    padding: 5,
  },
  postContainer: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
    padding: 10,
  }
});