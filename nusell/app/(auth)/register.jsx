import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { View } from 'react-native';
import { Text, TextInput, ActivityIndicator, Button } from 'react-native-paper';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const [loading , setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    
    const handleSubmit = async () => {
        if (email === '') {
            setErrMsg('Email cannot be empty.');
            return;
        } 

        if (password === '') {
            setErrMsg('Password cannot be empty.');
            return;
        }

        if (!email.includes('u.nus.edu')) {
            setErrMsg('Please use your NUS email.');
        }

        setLoading(true);
        const { error } = supabase.auth.signUp({ email, password });
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        }
    }

    return (
        <View style = {{ flex: 1, justifyContent: 'center'}}>
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

            <Button onPress={handleSubmit}>Register</Button>
            {errMsg !== "" && <Text>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
        </View>
    )
}