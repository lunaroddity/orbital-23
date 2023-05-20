import { useState, useEffect } from 'react';
import { View, FlatList, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { supabase } from '../../lib/supabase';

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [refresh, setRefresh] = useState(false);
    async function fetchPosts() {
        let { data } = await supabase.from('posts').select('*');
        setPosts(data);
        setRefresh(false);
    }  
    
    useEffect(() => {  
        fetchPosts();
    }, []);

    useEffect(() => {
        if (refresh) {
            fetchPosts();
        }
    }, [refresh]);

  return (
    <View style={{ flex: 1, justifyContent: 'center'}}>
        <FlatList 
            data={posts}
            renderItem={({ item }) => <PostItem post={item}/>} 
            refreshing={refresh}
            onRefresh={() => setRefresh(true)}
            />
    </View> 
    );
}

function PostItem({ post }) {
    return (
        <View>
            <Text>{post.caption}</Text>
            {post.image_url && <Image style= {{height: 200, width: 200}} source={{ uri: post.image_url }} />}
        </View>
    );
}
