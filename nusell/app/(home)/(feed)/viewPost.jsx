import { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Image, FlatList, Dimensions, Animated, ScrollView, RefreshControl, Alert, TouchableHighlight } from "react-native";
import { Text, Button, ActivityIndicator, Menu, Divider } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/auth";
import { createStackNavigator } from "@react-navigation/stack";
import { Pressable } from "react-native";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

const { width, height } = Dimensions.get('screen');

export default function ViewPostPage() {
    const [post, setPost] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const params = useLocalSearchParams();
    const { id } = params;
    const Stack = createStackNavigator();

    async function fetchPost() {
        let { data } = await supabase.from('posts').select('*').eq('id', id).single();
        setPost(data);
        console.log("data.id: " + data.id);
    }

    useEffect(() => {
        fetchPost();
    }, [id]);

    const handleRefresh = () => {
      fetchPost();
      setRefresh(false);
    };

    const PostScreen = ( props ) => {
      const { navigation } = props;
      return (
        <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }>
          <Post
            postId={id}
            post={post}
          />
        </ScrollView>
      );
    }
    
    return (
      <View style={{flex: 1, justifyContent: 'center', backgroundColor: "#fff"}}>
        <Stack.Navigator>
          <Stack.Screen
            name='Post'
            options={{
              headerStyle: { backgroundColor: '#003D7C'},
              headerTintColor: '#fff',
              headerTitle: "Post",
            }}
            component={PostScreen}
          />
        </Stack.Navigator>
      </View>
    );
}

// Function creates the post for viewing.
function Post( props ) {
  const { postId, post } = props;
  console.log(`post: ${JSON.stringify(post)}`);

  return (
    <View style={styles.view}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header username={post.username} avatar={post.avatar} id={postId} authorId={post.user_id} />
        <ImageCarousel id={postId} />
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.price}>${post.price}</Text>
        <View style={{marginVertical: 7}}>
          <Text style={styles.textHeader}>Condition</Text>
          <Text style={styles.description}>{post.condition}</Text>
          <Text style={styles.textHeader}>Description</Text>
          <Text style={styles.description}>{post.description}</Text>
        </View>
        <View style={{marginLeft: 10, alignItems: 'flex-start'}}>
          <Button
            contentStyle={{marginHorizontal: 10}}
            mode="outlined"
            textColor="#000"
            buttonColor='#fff'
            compact={true}>{post.category}</Button>
        </View>
        <View style={{margin: 10, flexDirection: 'row', flex: 1}}>
          <View style={{flexGrow: 40, margin: 2}}>
            {(post.is_sold === false) && <Button
              mode="contained"
              buttonColor="#003D7C"
              textColor="#fff">Available</Button>}
            {(post.is_sold === true) && <Button
              mode="contained"
              buttonColor="#676E75"
              textColor="#fff">Sold</Button>}
          </View>
          <View style={{flexGrow: 1, margin: 5}}>
          <LikeButton postId={postId} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function LikeButton({ postId }) {
  const { user } = useAuth();
  const userId = user.id;
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLikes = async () => {
      console.log('postid:' + postId);
      const { data } = await supabase
        .from('likes')
        .select('likedposts')
        .eq('user_id', userId)
        .single();

      // Check if the data exists
      if (data === null) {
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: userId });

        if (error) {
          console.error('Error fetching liked state:', error);
          setLoading(false);
          return;
        }

        setLiked(false);
        setLoading(false);
        return;
      }

      // Check if  the 'likedposts' field is an array
      if (Array.isArray(data.likedposts)) {
        setLiked(data.likedposts.includes(postId));
      }

      setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchLikes();
  }, [postId]);

  const updateLikedState = async () => {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('likedposts')
        .eq('user_id', userId)
        .single();

      const existingLikedPosts = data !== null ? data.likedposts : [];

      // Check if the postId is already in the 'likedposts' array
      const isLiked = existingLikedPosts.includes(postId);

      let updatedLikedPosts = [];
      if (isLiked) {
        updatedLikedPosts = existingLikedPosts.filter((value) => value !== postId);
      } else {
        // If not liked, add the postId to the array
        updatedLikedPosts = [...existingLikedPosts, postId];
      }
      const { error: updateError } = await supabase
          .from('likes')
          .update({ likedposts: updatedLikedPosts })
          .eq('user_id', userId)
          .single();

          if (updateError) {
            console.error('Error updating liked state:', error);
            setLoading(false);
            return;
          }
      // Update the 'liked' state in the component
      setLiked(!liked);
    } catch (error) {
      console.error('Error updating liked state:', error);
    }
  };

  const handleLikePress = async () => {
    if (!loading) {
      setLoading(true); // Prevent additional updates while fetching/updating state
      await updateLikedState();
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={handleLikePress}>
      <MaterialCommunityIcons
        name={liked ? 'heart' : 'heart-outline'}
        size={32}
        color={liked ? '#BF3E3E' : 'black'}
      />
    </Pressable>
  );
}

// Function creates the header for the post.
function Header({username, avatar, id, authorId}) {
  const [visible, setVisible] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const handleToggleAvailability = async () => {
    const { data: currAvail } = await supabase.from('posts').select('is_sold').eq('id', id).single();
    console.log(`old availability: ${JSON.stringify(currAvail)}`);
    const { error } = await supabase.from('posts').update({ 'is_sold': !(currAvail.is_sold) }).eq('id', id);
    Alert.alert('Availability toggled!', 'Your changes have been saved.', [
      {
        text: 'OK',
        onPress: () => {
          // Handle the OK button press if needed
        },
      },
    ]);
  };

  useEffect(() => {
    if (user.id === authorId) {
      setIsAuthor(true);
    }
  }, [user.id, authorId]);

  return (
    <View style={styles.headerContainer}>
      <TouchableHighlight
        underlayColor={"#ccc"}
        onPress={() => {
          router.push({ pathname: "(feed)/viewProfile", params: { id: authorId } })
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Avatar avatar={avatar} />
          <Text style={styles.username}>{username}</Text>
        </View>
      </TouchableHighlight>
      {isAuthor&& <Menu
        contentStyle={{backgroundColor: "white"}}
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Pressable onPress={openMenu}><Entypo name="dots-three-vertical" size={24} color="black" /></Pressable>}
      >
        <Menu.Item onPress={handleToggleAvailability} title="Toggle Availability" />
        <Divider />
        <Menu.Item onPress={() => router.push({ pathname: "/editPost", params: {id: id}})} title="Edit Post" />
      </Menu>}
    </View>
  );
  }

  // Function creates the avatar for the header.
  function Avatar({ avatar }) {
    return (
      <View style={styles.avatarContainer}>
        <Image 
        style={styles.avatar}
        source={{ uri: avatar }} />
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
        {images.length > 1 && <ScrollProgress data={images} scrollX={scrollX} index={index} />}
      </View>
    );
  }

  // Creates the progress bar to track which image the user is currently on.
  // Input range is the previous index, the current index and the next index.
  function ScrollProgress({ data, scrollX, index }) {
    console.log("index * width: " + (index * width));
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

  const styles = StyleSheet.create({
    view: {
      backgroundColor: "#fff"
    },
    avatarContainer: {
      width: width * 0.1,
      height: width * 0.1,
    },
    avatar: {
      flex: 1,
      width: 35,
      height: 35,
      borderRadius: 50,
      marginRight: 5,
    },
    headerContainer: {
      margin: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: 'space-between',
    },
    images: {
      width,
      height: width,
    },
    username: {
      paddingHorizontal: 5,
      fontSize: 16,
      fontWeight: 'bold',
    },
    textHeader: {
      paddingHorizontal: 10,
      marginVertical: 3,
      fontSize: 18,
      fontWeight: 'bold',
    },
    title: {
      paddingHorizontal: 10,
      fontSize: 22,
    },
    price: {
      paddingHorizontal: 10,
      fontSize: 22,
      fontWeight: "bold",
    },
    description: {
      paddingHorizontal: 10,
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