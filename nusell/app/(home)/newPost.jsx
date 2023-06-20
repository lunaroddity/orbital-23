import { useState } from "react";
import { View, Image, StyleSheet, FlatList, Pressable, ScrollView } from 'react-native';
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { HeaderBar } from '../(auth)/_layout.jsx';
import 'react-native-get-random-values';
import { randomUUID } from 'expo-crypto';
import { Ionicons } from '../../node_modules/@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function NewPostPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCondition, setSelectedCondition] = useState(null);
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

        if (price === '') {
            setErrMsg('Price cannot be empty.');
            return;
        }

        setLoading(true);
        const postId = randomUUID();
        
        // Uploads contents of new post to posts database and retrieves the post as a single object.
        const { data: postInsertData, error: postInsertError } = await supabase
        .from('posts')
        .insert({ 
            id: postId,
            title: title,
            description: description,
            price: price,
            category: selectedCategory,
            condition: selectedCondition,
            user_id: user.id})
        .select()
        .single();

        if (postInsertError != null) {
            setErrMsg(postInsertError.message);
        }

        if (images.length !== 0) {
            for (let i = 0; i < images.length; i++) {
                // Upload image to storage in supabase.
                const imageName = randomUUID();
                const { data: imageUploadData, error: imageUploadError } = await supabase
                .storage
                .from('images')
                .upload(imageName, { uri: images[i], type: 'jpg', name: 'name' }); 

                console.log('i: ' + i);
                console.log(`imageUploadData: ${JSON.stringify(imageUploadData)}`);

                // If image cannot be uploaded, stop loading icon and show error message
                if (imageUploadError) {
                    setLoading(false);
                    setErrMsg(imageUploadError.message);
                    return;
                }

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

    const addImageButton = () => {
        return (
            <Pressable onPress={handleAddImage}><Ionicons name='add-circle-outline' size={60} /></Pressable>
        );
    }

    return (
        <View style={styles.view}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <HeaderBar />

            <Text style={styles.header}>Photos</Text>
            {images !== 0 && <FlatList 
                data={images}
                renderItem={({ item }) => <Image style= {styles.image} source={{ uri: item }} />}
                horizontal={true}
                ItemSeparatorComponent={<View style={{width: 10}}/>}
                ListFooterComponent={addImageButton}
                ListFooterComponentStyle={{ margin: 10, justifyContent: 'center'}}
            />}

            <Text style={styles.header}>About your product</Text>
            <Text style={styles.InputHeader}>Category</Text>
            <View style={{backgroundColor:'#fff'}}>
                <Picker
                    selectedValue={selectedCategory}
                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                    >
                        <Picker.Item label="Category of product" enabled={false} />
                        <Picker.Item label="Beauty & Personal Care" value="Beauty & Personal Care"/>
                        <Picker.Item label="Business Services" value="Business Services" />
                        <Picker.Item label="Food & Drinks" value="Food & Drinks"/>
                        <Picker.Item label="Furniture" value="Furniture"/>
                        <Picker.Item label="Handicrafts" value="Handicrafts" />
                        <Picker.Item label="Hobbies" value="Hobbies" />
                        <Picker.Item label="Home Appliances" value="Home Appliances" />
                        <Picker.Item label="Learning & Enrichment" value="Learning & Enrichment" />
                        <Picker.Item label="Lifestyle Services" value="Lifestyle Services" />
                        <Picker.Item label="Men's Fashion" value="Men's Fashion" />
                        <Picker.Item label="Technology" value="Technology" />
                        <Picker.Item label="Women's Fashion" value="Women's Fashion" />
                        
                </Picker>
            </View>

            <Text style={styles.InputHeader}>Title</Text>
            <TextInput
                style={{backgroundColor: '#fff'}}
                placeholder='Name your product'
                underlineColor="transparent"
                activeUnderlineColor='#003D7C'
                value={title}
                onChangeText={setTitle} />

            <Text style={styles.InputHeader}>Condition</Text>
            <View style={{backgroundColor:'#fff'}}>
                <Picker
                    selectedValue={selectedCondition}
                    onValueChange={(itemValue) => setSelectedCondition(itemValue)}
                    >
                        <Picker.Item label="Condition of product" enabled={false} />
                        <Picker.Item label="Brand New" value="Brand New"/>
                        <Picker.Item label="Like New" value="Like New" />
                        <Picker.Item label="Lightly Used" value="Lightly Used" />
                        <Picker.Item label="Well Used" value="Well Used" />
                        <Picker.Item label="Heavily Used" value="Heavily Used" />
                </Picker>
            </View>
            

            <Text style={styles.InputHeader}>Description</Text>
            <TextInput
                style={{backgroundColor: '#fff'}}
                placeholder='Describe your product'
                underlineColor="transparent"
                activeUnderlineColor='#003D7C'
                multiline={true}
                value={description}
                onChangeText={setDescription} />

            <Text style={styles.InputHeader}>Price ($)</Text>
            <TextInput
                style={{backgroundColor: '#fff'}}
                placeholder='Price'
                underlineColor="transparent"
                activeUnderlineColor='#003D7C'
                value={price}
                onChangeText={setPrice} />

            {errMsg !== '' && <Text>{errMsg}</Text>}
            <Button
                style={{marginVertical: 25}}
                mode='contained'
                buttonColor="#003D7C"
                onPress={handleSubmit}>Upload</Button>
            {loading && <ActivityIndicator />}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        marginHorizontal: 20,
    },
    header: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 15,
    },
    InputHeader: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5,
    },
    image: {
        height: 200,
        width: 200,
    }
});