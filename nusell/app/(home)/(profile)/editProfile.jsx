import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { StreamChat } from "stream-chat";
import { chatApiKey } from "../../../lib/chatClient";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/auth";
import * as ImagePicker from "expo-image-picker";
import { randomUUID } from "expo-crypto";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Avatar } from "./profile";
// import { Avatar } from "./profile";


export default function EditProfile() {
  const params = useLocalSearchParams();
  const { oldFirstName, oldLastName, oldUsername, oldAvatar } = params;
  const currAvatar = decodeURIComponent(oldAvatar);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const { user } = useAuth();

  const fetchCurrAvatar = () => {
    setAvatar(currAvatar);
    console.log(avatar);
  }

  useEffect(() => {
    fetchCurrAvatar();
  }, []);
  
  const handleChangeAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    let resultUri = "";
    if (!result.canceled) {
      resultUri = result.assets[0].uri;
    }
    setAvatar(resultUri);
  };

  const handleSubmit = async () => {
    if (firstName.length !== 0) {
      const { data, error } = await supabase.from('profiles').update({ firstName: firstName }).eq('id', user.id);
      if (error) {
        setLoading(false);
        setErrMsg(error.message);
        return;
      }
    }
    
    if (lastName.length !== 0) {
      const { data, error } = await supabase.from('profiles').update({ lastName: lastName }).eq('id', user.id);
      if (error) {
        setLoading(false);
        setErrMsg(error.message);
        return;
      }
    }

    if (username.length !== 0) {
      const { data, error } = await supabase.from('profiles').update({ username: username }).eq('id', user.id);
      if (error) {
        setLoading(false);
        setErrMsg(error.message);
        return;
      }
    }

    if (avatar.length !== 0) {
      // Upload image to storage in supabase.
      const avatarName = randomUUID();
      const { data: avatarUploadData, error: avatarUploadError } = await supabase
          .storage
          .from('images')
          .upload(avatarName, { uri: avatar, type: 'jpg', name: 'name' }); 

      // If image cannot be uploaded, stop loading icon and show error message
      if (avatarUploadError) {
          setLoading(false);
          setErrMsg(avatarUploadError.message);
          return;
      }

      // Pull image URL from supabase.
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(avatarUploadData.path);
      console.log(publicUrl);

      const { error: avatarUpdateError } = await supabase
        .from('profiles')
        .update({ avatar: publicUrl })
        .eq('id', user.id);

      if (avatarUpdateError) {
          setLoading(false);
          setErrMsg(avatarUpdateError.message);
          return;
      }
    }
    
    console.log("firstName: " + firstName);
    console.log("lastName: " + lastName);
    console.log("username: " + username);
    console.log("avatar: " + avatar);

    Alert.alert('Changes saved!', 'Your changes have been saved.', [
      {
        text: 'OK',
        onPress: () => {
          // Handle the OK button press if needed
        },
      },
    ]);
  };
  
  const disconnectChat = async () => {
    const chatClient = StreamChat.getInstance(chatApiKey);
    await chatClient.disconnectUser();
    return;
  };
  
  const handleLogout = async () => {
    await disconnectChat();
    const { error } = await supabase.auth.signOut();
  };

  return (
    <View style={styles.view}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatar}>
          <Avatar avatar={avatar} />
        </View>
        <Button
          style={styles.button}
          mode="text"
          textColor ="#003D7C"
          onPress={handleChangeAvatar}>Change Avatar</Button>
        <Text style={styles.header}>First Name</Text>
        <TextInput
            style={styles.textInput}
            placeholder={oldFirstName}
            underlineColor="transparent"
            activeUnderlineColor='#003D7C'
            value={firstName}
            onChangeText={setFirstName} />
        <Text style={styles.header}>Last Name</Text>
        <TextInput
            style={styles.textInput}
            placeholder={oldLastName}
            underlineColor="transparent"
            activeUnderlineColor='#003D7C'
            value={lastName}
            onChangeText={setLastName} />
        <Text style={styles.header}>Username</Text>
        <TextInput
            style={styles.textInput}
            placeholder={oldUsername}
            underlineColor="transparent"
            activeUnderlineColor='#003D7C'
            value={username}
            onChangeText={setUsername} />
        {errMsg !== '' && <Text style={styles.errMsg}>{errMsg}</Text>}
        <Button
            style={{marginVertical: 15}}
            mode='contained'
            buttonColor="#003D7C"
            onPress={handleSubmit}>Save Changes</Button>
        {loading && <ActivityIndicator />}
        <Button
          style={styles.button}
          mode="text"
          textColor ="#BF3E3E"
          compact={true}
          onPress={handleLogout}>Logout</Button>
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
  avatar: {
    flex: 1,
    alignSelf: 'center',
    maxHeight: 60,
    borderRadius: 50,
    marginRight: 5,
    marginTop: 10,
    backgroundColor: "red"
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