import { Link } from 'expo-router';
import { useState } from 'react';
import { View } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { HeaderBar } from './_layout';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading , setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    
    // handles submission of user email and password
    const handleSubmit = async () => {
        setErrMsg('');
        if (email === '') {
            setErrMsg('Email cannot be empty.');
            return;
        } 

        if (password === '') {
            setErrMsg('Password cannot be empty.');
            return;
        }

        setLoading(true); // renders a spinning loading icon
        const { error } = supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        }
    }

    return (
        <View style = {{ flex: 1, justifyContent: 'center' }}>
            <HeaderBar />
            <Text>Email</Text>
            <TextInput
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail} />
            
            <Text>Password</Text>
            <TextInput 
                secureTextEntry
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword} />

            <Button mode="contained" buttonColor ="#003D7C" onPress={handleSubmit}>Login</Button>
            {errMsg !== "" && <Text>{errMsg}</Text>}
            {loading && <ActivityIndicator />}

            <Link href="/register">
                <Button>{"Don't have an account? Register now!"}</Button>
            </Link>
        </View>
    );
}