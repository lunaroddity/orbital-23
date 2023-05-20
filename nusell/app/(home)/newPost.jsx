import { useState } from "react";
import { View, Image } from 'react-native';
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from "expo-image-picker";

export default function NewPostPage() {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleAddImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        })

        if (!result.canceled) {
            // accesses only the first image and gets its URI
            setImage(result.assets[0].uri);
        }
        console.log(`result: ${JSON.stringify(result)}`);
    }

    const handleSubmit = async () => {
        if (caption === '') {
            setErrMsg('Caption cannot be empty.');
            return;
        }

        let imageUrl = null;
        if (image != null) {
            const { data, error } = await supabase.storage.from('images').upload(`${new Date().getTime()}`, // replace with uuid in future
                {
                    uri: image,
                    type: 'jpg',
                    name: 'name'
                });

            if (error) {
                setLoading(false);
                setErrMsg(error.message);
                return;
            }
            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
            imageUrl = publicUrl;   
        }

        setLoading(true);
        const { error } = await supabase.from('posts')
            .insert({ caption: caption, user_id: user.id, image_url: imageUrl })
            .select()
            .single();
        // select gets back the data submitted, single gets the item back
        setLoading(false);
        if (error != null) {
            setErrMsg(error.message);
        }
        router.push("/");
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center'}}>
            <Text>Caption</Text>
            <TextInput value={caption} onChangeText={setCaption} />
            {errMsg !== '' && <Text>{errMsg}</Text>}
            <Image style= {{height: 200, width: 200}} source={{ uri: image }} />
            <Button onPress={handleAddImage}>Add Image</Button>
            <Button onPress={handleSubmit}>Post</Button>
            {loading && <ActivityIndicator />}
        </View>
    )
}