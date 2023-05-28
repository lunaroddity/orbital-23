import { View } from "react-native";
import { Button } from 'react-native-paper';
import { supabase } from "../../lib/supabase";
import { HeaderBar } from '../(auth)/_layout.jsx';


export default function ProfilePage() {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <HeaderBar />
            <Button onPress={() => supabase.auth.signOut()}>Logout</Button>
        </View>
    )
}