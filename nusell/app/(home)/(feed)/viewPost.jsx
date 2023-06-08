import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams, Stack } from "expo-router";
import { supabase } from "../../../lib/supabase";

export default function ViewPostPage() {
    const [post, setPost] = useState(null);
    const params = useLocalSearchParams();
    const id = params;
    console.log(id);

    async function fetchPost() {
        let { data } = await supabase.from('posts').select().eq('id', id);
        setPost(data);
    }

    useEffect(() => {
        fetchPost()
    });
    
    return (
        <View style={{flex: 1, justifyContent:'center'}}>
            <Stack.Screen 
                options={{
                    headerStyle: { backgroundColor: '#003D7C'},
                    headerTintColor: '#fff',
                    headerTitle: "Post"
                }}
            />
            <Text>Testing</Text>
        </View>
    );
}