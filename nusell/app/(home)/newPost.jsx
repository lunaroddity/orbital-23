import { useState } from "react";
import { View, Image, StyleSheet, FlatList } from 'react-native';
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { HeaderBar } from '../(auth)/_layout.jsx';
import 'react-native-get-random-values';
import { randomUUID } from 'expo-crypto';


export default function NewPostPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    // Handles an addition of an image to a post.
    const handleAddImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            orderedSelection: true,
            selectionLimit: 10,
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        })

        let resultsUri = [];
        if (!result.canceled) {
            for (let i = 0; i < result.assets.length; i++) {
                resultsUri[i] = result.assets[i].uri;
            }
            // Sets images as an array containing the URIs of the uploaded images.
            setImages(resultsUri);
        }
        console.log(`result: ${JSON.stringify(result)}`);
    }

    // Handles the submission of the contents in a post.
    const handleSubmit = async () => {
        if (title === '') {
            setErrMsg('Title cannot be empty.');
            return;
        }

        if (description === '') {
            setErrMsg('Description cannot be empty.');
            return;
        }

        const postId = randomUUID();
        setLoading(true);
        // Uploads contents of new post to posts database and retrieves the post as a single object.
        const { data: postInsertData, error: postInsertError } = await supabase
        .from('posts')
        .insert({ 
            id: postId,
            title: title,
            description: description,
            user_id: user.id})
        .select()
        .single();

        if (postInsertError != null) {
            setErrMsg(postInsertError.message);
        }

        console.log('post upload successful, postId: ' + postId);

        if (images.length !== 0) {
            for (let i = 0; i < images.length; i++) {
                // Upload image to storage in supabase.
                const imageName = randomUUID();
                const { data: imageUploadData, error: imageUploadError } = await supabase
                .storage
                .from('images')
                .upload(imageName, { uri: images[i], type: 'jpg', name: 'name' }); 

                console.log(`imageUploadData: ${JSON.stringify(imageUploadData)}` + ' i: ' + i);

                // If image cannot be uploaded, stop loading icon and show error message
                if (imageUploadError) {
                    setLoading(false);
                    setErrMsg(imageUploadError.message);
                    return;
                }

                console.log(`data.path: ${JSON.stringify(imageUploadData.path)}`);

                // Pull image URL from supabase.
                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(imageUploadData.path);
                console.log(`publicUrl: ${JSON.stringify(publicUrl)}`);

                // Update image URL for post to be the URL of the first image selected.
                if (i === 0) {
                    const { error: updateError }= await supabase
                        .from('posts')
                        .update({ image_url: publicUrl })
                        .eq('id', postInsertData.id);
                    
                    console.log(`update successful`);

                        if (updateError) {
                            setLoading(false);
                            setErrMsg(updateError.message);
                            return;
                        }
                }

                // Insert image into images database.
                const { error: imageInsertError } = await supabase
                        .from('images')
                        .insert({ user_id: user.id, post_id: postInsertData.id, image_url: publicUrl });

                if (imageInsertError) {
                    setLoading(false);
                    setErrMsg(imageInsertError.message);
                    return;
                }
            }
        }

        setLoading(false);
        // Returns the user to the root page.
        router.push("/");
    }

    return (
        <View style={styles.view}>
            <HeaderBar />
            {images !== 0 && <FlatList 
                data={images}
                renderItem={({ item }) => <Image style= {styles.image} source={{ uri: item }} />}
                horizontal={true}
                ItemSeparatorComponent={<View style={{width: 20}}/>}
            />}
            <TextInput
                style={styles.descriptionInput}
                mode='outlined'
                label='Title'
                activeOutlineColor='#003D7C'
                value={title}
                onChangeText={setTitle} />
            <TextInput
                style={styles.descriptionInput}
                mode='outlined'
                label='Description'
                activeOutlineColor='#003D7C'
                value={description}
                onChangeText={setDescription} />
            {errMsg !== '' && <Text>{errMsg}</Text>}
            <Button onPress={handleAddImage}>Add Images</Button>
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
    descriptionInput: {
        backgroundColor: '#fff'
    },
    image: {
        height: 200,
        width: 200
    }
});