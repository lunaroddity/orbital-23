import { View } from "react-native";
import { Button } from 'react-native-paper';
import { supabase } from "../../lib/supabase";
import { HeaderBar } from '../(auth)/_layout.jsx';


export default function ProfilePage() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 120 }}>
            <HeaderBar />
            <Button
                mode="contained"
                buttonColor ="#003D7C"
                rippleColor="#022E5B" 
                onPress={() => supabase.auth.signOut()}>Logout</Button>
        </View>
    )
}