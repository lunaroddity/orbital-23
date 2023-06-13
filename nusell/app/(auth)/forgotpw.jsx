import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, ActivityIndicator, Button } from 'react-native-paper';
import { HeaderBar } from './_layout';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading , setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    
    const handleSubmit = async () => {
    
        if (email === '') {
            setErrMsg('Email cannot be empty.');
            return;
        }

        if (!email.includes('@')) {
            setErrMsg('Please use a valid email.');
            return;
        }

        if (!email.includes('u.nus.edu')) {
            setErrMsg('Please use your NUS email.');
            return;
        }

        setLoading(true); // Renders a spinning loading icon.
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: '/resetpw',
          });

        Alert.alert('Email sent!', 'Check your email', [
            {
              text: 'OK',
              onPress: () => {
                // Handle the OK button press if needed
              },
            },
          ]);

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

            {errMsg !== "" && <Text style={styles.errMsg}>{errMsg}</Text>}

            <Button 
                mode="contained"
                buttonColor ="#003D7C"
                rippleColor="#022E5B"
                onPress={handleSubmit}>Send Email</Button>
            
            { /* Renders loading icon while data is uploading. */}
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
    }
});