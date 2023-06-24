import { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Image, FlatList, Dimensions, Animated, ScrollView } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/auth";
import { createStackNavigator } from "@react-navigation/stack";
import { ChatProvider, Channel, MessageList, MessageInput } from "stream-chat-expo";
import { chatClient } from "../../../lib/chatClient";
import { useChatClient } from "../(chat)/useChatClient";
import { useChat } from "../../../contexts/chat";

const { width, height } = Dimensions.get('screen');

export default function ViewPostPage() {
    const [post, setPost] = useState([]);
    const params = useLocalSearchParams();
    const { id } = params;
    const { user } = useAuth();
    const Stack = createStackNavigator();

    async function fetchPost() {
        let { data } = await supabase.from('posts').select('*').eq('id', id).single();
        setPost(data);
        console.log("data.id: " + data.id);
    }

    useEffect(() => {
        fetchPost();
    }, [id]);

     // Unique users yet to be added, defaulted to liNUS for now.
     const ChatScreen = () => {
      // const { clientIsReady } = useChatClient();
      // const { channel, setChannel } = useChat();

      // if (!clientIsReady) {
      //   return (
      //     <View style={{flex: 1, justifyContent: 'center'}}>
      //       <ActivityIndicator />
      //     </View>
      //   );
      // }

      // // Channel is being created but crashes the app
      // const channelCreated = chatClient.channel('messaging', id, {
      //   name: 'liNUS',
      //   members: [post.user_id, user.id],
      // });
      // channelCreated.watch();
      // setChannel(channelCreated);
      const instructions ="To be added. Please click on the chat bubble icon. A chat called 'liNUS' has been created upon pressing the chat button. Feel free to send messages there."
      
      return (
        <View style={{flex: 1, marginHorizontal: 10, justifyContent: 'center'}}>
          <Text>{instructions}</Text>
        </View>
      );

      // return (
      //   <Channel channel={channel}>
      //     <MessageList />
      //     <MessageInput />
      //   </Channel>
      // );
    }

    const PostScreen = ( props ) => {
      const { navigation } = props;
      const handleChatPress = () => navigation.navigate('Chat');
      const handleCategoryPress = () => navigation.navigate('Category');
      return (
        <Post
          postId={id}
          username="liNUS"
          title={post.title}
          description={post.description}
          price={post.price}
          category={post.category}
          condition={post.condition}
          handleChatPress={handleChatPress}
          handleCategoryPress={handleCategoryPress}
        />
      );
    }

    const CategoryScreen = ( props ) => {
      return (
        <View style={{flex: 1, marginHorizontal: 10, justifyContent: 'center'}}>
          <Text>Category screen to be added.</Text>
        </View>
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
            <Stack.Screen
              name='Chat'
              component={ChatScreen} 
            />
            <Stack.Screen
              name='Category'
              component={CategoryScreen}
            />
          </Stack.Navigator>
        </View>
      </ChatProvider>
    );
}

// Function creates the post for viewing.
function Post( props ) {
  const { postId, username, title, description, price, category, condition, handleChatPress, handleCategoryPress } = props;

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header username={username} />
        <ImageCarousel id={postId} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>${price}</Text>
        <View style={{marginVertical: 7}}>
          <Text style={styles.textHeader}>Condition</Text>
          <Text style={styles.description}>{condition}</Text>
          <Text style={styles.textHeader}>Description</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={{marginLeft: 10, alignItems: 'flex-start'}}>
          <Button
            contentStyle={{marginHorizontal: 10}}
            mode="contained"
            textColor="#003D7C"
            buttonColor='#ddd'
            compact={true}
            onPress={handleCategoryPress}>{category}</Button>
        </View>
        <View style={{margin: 10}}>
          <Button
            mode="contained"
            buttonColor="#003D7C"
            textColor="#fff"
            onPress={handleChatPress}>Chat</Button>
        </View>
      </ScrollView>
    </View>
  );
}

// Function creates the header for the post.
function Header({username}) {
  return (
    <View style={styles.headerContainer}>
      <Avatar />
      <Text style={styles.username}>{username}</Text>
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