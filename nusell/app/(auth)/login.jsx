import { Link } from 'expo-router';
import { useState } from 'react';
import { View, StyleSheet } from "react-native";
import { Text, Button, ActivityIndicator, TextInput } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { HeaderBar } from './_layout';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading , setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    
    // Handles submission of user's email and password to supabase.
    const handleSubmit = async () => {
        setErrMsg('');
        if (email === '') {
            setErrMsg('Email cannot be empty.');
            return;
        }

        if (!email.includes('@')) {
            setErrMsg('Please use a valid email.');
            return;
        }

        if (password === '') {
            setErrMsg('Password cannot be empty.');
            return;
        }

        setLoading(true); // Renders a spinning loading icon.
        const { error } = supabase.auth.signInWithPassword({ email, password }); 
        setLoading(false); // Stops rendering loading icon.
        if (error) {
            setErrMsg(error.message);
            return;
        }
    }

    return (
        <View style = {styles.view}>
            <HeaderBar />

            {/* Email input */}
            <TextInput
                style={styles.emailInput}
                mode='outlined'
                label='Email'
                activeOutlineColor='#003D7C'
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail} />
            
            {/* Password input */}
            <TextInput
                style={styles.passwordInput}
                mode='outlined'
                label='Password'
                activeOutlineColor='#003D7C'
                secureTextEntry
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword} />

            {errMsg !== "" && <Text style={styles.errMsg}>{errMsg}</Text>}

            <Button 
                mode="contained"
                buttonColor ="#003D7C"
                rippleColor="#022E5B"
                onPress={handleSubmit}>Login</Button>

            { /* Renders loading icon while data is uploading. */}
            {loading && <ActivityIndicator />}

            <Link style={styles.registerButton} href="/register">
                <Button textColor='#003D7C'>{"Don't have an account? Register now!"}</Button>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 20,
    },
    emailInput: {
        backgroundColor: '#fff',
        marginBottom: 10
    },
    passwordInput: {
        backgroundColor: '#fff',
        marginBottom: 20
    },
    errMsg: {
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#BF3E3E',
        color: '#FFFFFF'
    },
    registerButton: {
        margin: 10,
    }
});