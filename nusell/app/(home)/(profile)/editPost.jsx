import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";

export default function EditPostPage() {
  const [post, setPost] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const params = useLocalSearchParams();
  const { id } = params;

  async function fetchPost() {
    let { data: postData } = await supabase.from('posts').select('*').eq('id', id).single();
    setPost(postData);
    console.log(`postData: ${JSON.stringify(postData)}`);
  }

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    if (selectedCategory !== null) {
      const { data, error } = await supabase.from('posts').update({ category: selectedCategory }).eq('id', id);
      if (error) {
        setLoading(false);
        setErrMsg(error.message);
        return;
      }
    }

    if (title.length !== 0) {
      const { data, error } = await supabase.from('posts').update({ title: title }).eq('id', id);
      if (error) {
        setLoading(false);
        setErrMsg(error.message);
        return;
      }
    }

    if (selectedCondition !== null) {
      const { data, error } = await supabase.from('posts').update({ condition: selectedCondition }).eq('id', id);
      if (error) {
        setLoading(false);
        setErrMsg(error.message);
        return;
      }
    }

    if (description.length !== 0) {
      const { data, error } = await supabase.from('posts').update({ description: description }).eq('id', id);
      if (error) {
        setLoading(false);
        setErrMsg(error.message);
        return;
      }
    }

    if (price.length !== 0) {
      const { data, error } = await supabase.from('posts').update({ price: price }).eq('id', id);
      if (error) {
        setLoading(false);
        setErrMsg(error.message);
        return;
      }
    }

    setLoading(false);
    console.log(`category: ${JSON.stringify(selectedCategory)}`);
    console.log(`title: ${JSON.stringify(title)}`);
    console.log(`condition: ${JSON.stringify(selectedCondition)}`);
    console.log(`description: ${JSON.stringify(description)}`);
    console.log(`price: ${JSON.stringify(price)}`);

    Alert.alert('Changes saved!', 'Your changes have been saved.', [
      {
        text: 'OK',
        onPress: () => {
          // Handle the OK button press if needed
        },
      },
    ]);
  };

  return (
    <View style={styles.view}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Category</Text>
          <View style={{backgroundColor:'#fff'}}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
              <Picker.Item label="Category of product" enabled={false} />
              <Picker.Item label="Beauty & Personal Care" value="Beauty & Personal Care"/>
              <Picker.Item label="Business Services" value="Business Services" />
              <Picker.Item label="Education" value="Education" />
              <Picker.Item label="Food & Drinks" value="Food & Drinks"/>
              <Picker.Item label="Furniture" value="Furniture"/>
              <Picker.Item label="Handicrafts" value="Handicrafts" />
              <Picker.Item label="Hobbies" value="Hobbies" />
              <Picker.Item label="Home Appliances" value="Home Appliances" />
              <Picker.Item label="Lifestyle Services" value="Lifestyle Services" />
              <Picker.Item label="Men's Fashion" value="Men's Fashion" />
              <Picker.Item label="Notes & Cheat Sheets" value="Notes & Cheat Sheets" />
              <Picker.Item label="Technology" value="Technology" />
              <Picker.Item label="Women's Fashion" value="Women's Fashion" />
            </Picker>
          </View>

        <Text style={styles.header}>Title</Text>
          <TextInput
              style={styles.textInput}
              placeholder={post.title}
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

        <Text style={styles.header}>Description</Text>
          <TextInput
              style={styles.textInput}
              placeholder={post.description}
              underlineColor="transparent"
              activeUnderlineColor='#003D7C'
              value={description}
              onChangeText={setDescription} />
        
        <Text style={styles.header}>Price ($)</Text>
          <TextInput
              style={styles.textInput}
              placeholder={`${JSON.stringify(post.price)}`}
              underlineColor="transparent"
              activeUnderlineColor='#003D7C'
              value={price}
              onChangeText={setPrice} />
        {errMsg !== '' && <Text style={styles.errMsg}>{errMsg}</Text>}
          <Button
              style={{marginVertical: 15}}
              mode='contained'
              buttonColor="#003D7C"
              onPress={handleSubmit}>Save Changes</Button>
          {loading && <ActivityIndicator />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: 20
  },
  header: {
    marginVertical: 5,
    fontWeight: 'bold'
  },
  textInput: {
    backgroundColor: '#fff',
    marginBottom: 5
  },
  button: {
    marginVertical: 5,
  },
  errMsg: {
    padding: 10,
    marginTop: 15,
    backgroundColor: '#BF3E3E',
    color: '#FFFFFF'
  }
});