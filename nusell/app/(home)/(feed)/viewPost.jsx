import { useEffect, useState } from "react";
import { View, StyleSheet, Image, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams, Stack } from "expo-router";
import { supabase } from "../../../lib/supabase";

export default function ViewPostPage() {
    const [post, setPost] = useState([]);
    const params = useLocalSearchParams();
    const { id } = params;
    console.log("id: " + id);

    async function fetchPost() {
        let { data } = await supabase.from('posts').select('*').eq('id', id).single();
        setPost(data);
        console.log("data.id: " + data.id);
    }

    useEffect(() => {
        fetchPost();
    }, [id]);
    
    return (
        <View style={{flex: 1, justifyContent:'center'}}>
            <Stack.Screen 
                options={{
                    headerStyle: { backgroundColor: '#003D7C'},
                    headerTintColor: '#fff',
                    headerTitle: "Post"
                }}
            />
            <Post
                id={id}
                username="liNUS"
                title={post.title}
                description={post.description}
                price="$50"/>
        </View>
    );
}

function Post( props ) {
    const { id, username, title, description, price } = props;
    return (
        <View>
            <Header username={username} />
            <ImageCarousel id={id} />
            <Text>{title}</Text>
            <Text>{price}</Text>
            <Text>{description}</Text>
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

  function ImageCarousel({id}) {
    const [images, setImages] = useState([]);

    async function fetchImages() {
        let { data } = await supabase.from('images').select('image_url').eq('post_id', id);
        console.log(data);
        setImages(data);
    }

    useEffect(() => {
        fetchImages();
    }, [id]);

    return (
        <View>
            {images !== 0 && <FlatList 
                data={images}
                renderItem={({ item }) => <Image style= {styles.images} source={{ uri: item.image_url }} />}
                horizontal={true}
                ItemSeparatorComponent={<View style={{width: 20}}/>}
            />}
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
      borderColor: '#003D7C',
      borderWidth: 2
    },
    headerContainer: {
      margin: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    images: {
      width: 300,
      height: 300,
    },
    title: {
      padding: 5,
      fontWeight: 'bold',
    },
    description: {
      padding: 5,
    }
});