import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, ActivityIndicator, Button } from 'react-native-paper';
import { HeaderBar } from './_layout';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const[confirmPassword, setconfirmPassword] = useState('');
    const [loading , setLoading] = useState(false); 
    const [errMsg, setErrMsg] = useState('');2

    // Handles submission of user's email and password to supabase.
    const handleSubmit = async () => {
        setErrMsg('');

        if (password === '') {
            setErrMsg('Password cannot be empty.');
            return;
        }

        if (password !== confirmPassword) {
            setErrMsg('Passwords do not match.');
            return;
        }

        if (password.length <= 8) {
            setErrMsg('Password must have more than 8 characters.');
            return;
        }

        setLoading(true); // Renders a spinning loading icon.
  
        const { error } = await supabase.auth.updateUser({
            password: "password",
          })

        
        setLoading(false); // Stops rendering loading icon.
        if (error) {
            setErrMsg(error.message);
            return;
        }
    }

    return (
        <View style = {styles.view}>
            <HeaderBar />

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

            {/* confirmPassword input */}
            <TextInput
                style={styles.passwordInput}
                mode='outlined'
                label='Confirm Password'
                activeOutlineColor='#003D7C'
                secureTextEntry
                autoCapitalize='none'
                textContentType='confirmPassword'
                value={confirmPassword}
                onChangeText={setconfirmPassword} />

            {errMsg !== "" && <Text style={styles.errMsg}>{errMsg}</Text>}

            <Button 
                mode="contained"
                buttonColor ="#003D7C"
                rippleColor="#022E5B"
                onPress={handleSubmit}>Reset Password</Button>

            { /* Renders loading icon while data is uploading. */}
            {loading && <ActivityIndicator />}

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
        margin: 1,
    }
});