import { useState } from "react";
import { View, Image, StyleSheet } from 'react-native';
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { HeaderBar } from '../(auth)/_layout.jsx';


export default function NewPostPage() {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    // Handles an addition of an image to a post.
    const handleAddImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        })

        if (!result.canceled) {
            // setImage accesses only the first image and gets its URI.
            setImage(result.assets[0].uri);
        }
        console.log(`result: ${JSON.stringify(result)}`);
    }

    // Handles the submission of the contents in a post.
    const handleSubmit = async () => {
        if (caption === '') {
            setErrMsg('Caption cannot be empty.');
            return;
        }

        let imageUrl = null;
        if (image != null) {
            // To be replaced with UUID in future to prevent clashes in naming.
            const { data, error } = await supabase.storage.from('images').upload(`${new Date().getTime()}`, 
                {
                    uri: image,
                    type: 'jpg',
                    name: 'name'
                });

            // If image cannot be uploaded, stop loading icon and show error message
            if (error) {
                setLoading(false);
                setErrMsg(error.message);
                return;
            }
            // Pulls image URL from supabase.
            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
            imageUrl = publicUrl;   
        }

        setLoading(true);
        // Uploads contents of new post to supabase and retrieves the post as a single object.
        const { error } = await supabase.from('posts')
            .insert({ caption: caption, user_id: user.id, image_url: imageUrl })
            .select()
            .single();

        setLoading(false);
        if (error != null) {
            setErrMsg(error.message);
        }

        // Returns the user to the root page.
        router.push("/");
    }

    return (
        <View style={styles.view}>
            <HeaderBar />
            <Image style= {{height: 200, width: 200}} source={{ uri: image }} />
            <TextInput
                style={styles.captionInput}
                mode='outlined'
                label='Caption'
                activeOutlineColor='#003D7C'
                value={caption}
                onChangeText={setCaption} />
            {errMsg !== '' && <Text>{errMsg}</Text>}
            <Button onPress={handleAddImage}>Add Image</Button>
            <Button onPress={handleSubmit}>Post</Button>
            {loading && <ActivityIndicator />}
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 20,
    },
    captionInput: {
        backgroundColor: '#fff'
    }
});