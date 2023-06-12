import { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Image, FlatList, Dimensions, Animated } from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams, Stack } from "expo-router";
import { supabase } from "../../../lib/supabase";

const { width, height } = Dimensions.get('screen');

export default function ViewPostPage() {
    const [post, setPost] = useState([]);
    const params = useLocalSearchParams();
    const { id } = params;

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

// Function creates the post for viewing.
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

// Function creates the header for the post.
function Header({username}) {
  return (
    <View style={styles.headerContainer}>
      <Avatar />
      <Text>{username}</Text>
    </View>
  );
  }

  // Function creates the avatar for the header.
  function Avatar() {
    return (
      <View style={styles.avatarContainer}>
        <Image 
        style={styles.avatar}
        source={{ uri: "https://pbs.twimg.com/media/DiRqvKmVMAMqWCQ.jpg" }} />
      </View>
    );
  }

  // Function creates the image carousel for the post.
  function ImageCarousel({id}) {
    const [images, setImages] = useState([]);
    const [index, setIndex] = useState(0);
    // Calculates how far the user has scrolled horizontally
    const scrollX = useRef(new Animated.Value(0)).current;

    async function fetchImages() {
      let { data } = await supabase.from('images').select('id, image_url').eq('post_id', id);
      console.log(data);
      setImages(data);
    }

    useEffect(() => {
      fetchImages();
    }, [id]);

    // Maps event.nativeEvent.contentOffset.x to the animated value scrollX
    // Native driver is not used since the animation of background colours is not supported
    const handleOnScroll = (event) => {
      Animated.event(
        [{
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            }
          }
        }], {
          useNativeDriver: false,
        },
      )(event);
    };

    const handleOnViewableItemsChanged = useRef(({viewableItems}) => {
      console.log('viewableItems: ', viewableItems);
      setIndex(viewableItems[0].index);
    }).current;
 
    // Percentage of image that should be visible before it is considered viewable
    const viewabilityConfig = useRef({
      itemVisiblePercentThreshold: 50,
    }).current;

    return (
      <View>
        <FlatList 
          data={ images }
          renderItem={({ item }) => <Image 
              style= {styles.images}
              source={{ uri: item.image_url }} />}
          horizontal={true}
          pagingEnabled
          snapToAlignment="center"
          onScroll={handleOnScroll}
          onViewableItemsChanged={handleOnViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
        <ScrollProgress data={images} scrollX={scrollX} index={index} />
      </View>
    );
  }

  // Creates the progress bar to track which image the user is currently on.
  // Input range is the previous index, the current index and the next index.
  function ScrollProgress({ data, scrollX, index }) {
    console.log("index * wdith" + (index * width));
    console.log(`scrollX: ${JSON.stringify(scrollX)}`)

    return (
      <View style={styles.scrollProgress}>
          {data.map((_, idx) => {            
            const backgroundColor = scrollX.interpolate({
              inputRange: [(idx - 1) * width, idx * width, (idx + 1) * width],
              outputRange: ['#ccc', '#003D7C', '#ccc'],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View 
                key={idx}
                style={[styles.dot, {backgroundColor: backgroundColor}]} />
            );
        })}
      </View>
    );
  }

  export const styles = StyleSheet.create({
    view: { 
      flex: 1,
      width,
      height,
      backgroundColor: "white",
    },
    avatarContainer: { backgroundColor: "white" },
    avatar: {
      flex: 1,
      width: 35,
      height: 35,
      borderRadius: 50,
      marginRight: 5,
      borderColor: "#003D7C",
      borderWidth: 2
    },
    headerContainer: {
      margin: 5,
      flexDirection: "row",
      alignItems: "center",
    },
    images: {
      width,
      height: width,
    },
    title: {
      padding: 5,
      fontWeight: "bold",
    },
    description: {
      padding: 5,
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      marginHorizontal: 3,
      backgroundColor: "#ccc",
    },
    scrollProgress: {
      flexDirection: "row",
      width,
      alignItems: "flex-end",
      justifyContent: "center",
      marginVertical: 15,
    }
});