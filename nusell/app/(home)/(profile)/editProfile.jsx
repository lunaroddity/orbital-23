import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { StreamChat } from "stream-chat";
import { chatApiKey } from "../../../lib/chatClient";
import { supabase } from "../../../lib/supabase";

export default function EditProfile() {
  const disconnectChat = async () => {
    const chatClient = StreamChat.getInstance(chatApiKey);
    await chatClient.disconnectUser();
    return;
  }
  
  const handleLogout = async () => {
    await disconnectChat();
    const { error } = await supabase.auth.signOut();
  };

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Button
      style={styles.button}
      mode="contained"
      buttonColor ="#003D7C"
      rippleColor="#022E5B" 
      compact={true}
      onPress={handleLogout}>Logout</Button>  
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: { backgroundColor: 'white' },
  button: {
    marginVertical: 10,
  },
});