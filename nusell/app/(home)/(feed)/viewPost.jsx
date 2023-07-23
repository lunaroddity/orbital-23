import { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Image, FlatList, Dimensions, Animated, ScrollView, Pressable, RefreshControl, Alert } from "react-native";
import { Text, Button, ActivityIndicator, Menu, Divider } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/auth";
import { createStackNavigator } from "@react-navigation/stack";
import { ChatProvider, Channel, MessageList, MessageInput } from "stream-chat-expo";
import { chatClient } from "../../../lib/chatClient";
import { useChatClient } from "../(chat)/useChatClient";
import { useChat } from "../../../contexts/chat";
import { Entypo } from '@expo/vector-icons';

const { width, height } = Dimensions.get('screen');

export default function ViewPostPage() {
    const [post, setPost] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const { clientIsReady } = useChatClient();
    const params = useLocalSearchParams();
    const { id } = params;
    const { user } = useAuth();
    const Stack = createStackNavigator();

    async function fetchPost() {
      let { data: postData } = await supabase.from('posts').select('*').eq('id', id).single();
      setPost(postData);
      console.log(`postData: ${JSON.stringify(postData)}`);
    }

    useEffect(() => {
        fetchPost();
    }, [id]);

    const PostScreen = ( props ) => {
      const { navigation } = props;
      const handleChatPress = () => navigation.navigate('Chat');
      const handleCategoryPress = () => navigation.navigate('Category');
      const handleRefresh = () => {
        fetchPost();
        setRefresh(false);
      };

      return (
        <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }>
          <Post
            postId={id}
            post={post}
            handleChatPress={handleChatPress}
            handleCategoryPress={handleCategoryPress}
          />
        </ScrollView>
      );
    }
    
    return (
      <ChatProvider>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Stack.Navigator>
            <Stack.Screen
              name='Post'
              options={{
                headerStyle: { backgroundColor: '#003D7C'},
                headerTintColor: '#fff',
                headerTitle: "Post"
              }}
              component={PostScreen}
            />
          </Stack.Navigator>
        </View>
      </ChatProvider>
    );
}

// Function creates the post for viewing.
function Post( props ) {
  const { postId, post } = props;

  return (
    <View style={styles.view}>
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
      <View style={{margin: 10}}>
        {(post.is_sold === false) && <Button
          mode="contained"
          buttonColor="#003D7C"
          textColor="#fff">Available</Button>}
        {(post.is_sold === true) && <Button
          mode="contained"
          buttonColor="#676E75"
          textColor="#fff">Sold</Button>}
      </View>
    </View>
  );
}

// Function creates the header for the post.
function Header({username, avatar, id, authorId }) {
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
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Avatar avatar={avatar} />
        <Text style={styles.username}>{username}</Text>
      </View>
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
      flexDirection: 'row',
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