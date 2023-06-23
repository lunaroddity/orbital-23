import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { HeaderBar } from './_layout';

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

        if (password === '') {
            setErrMsg('Password cannot be empty.');
            return;
        }

        if (password.length <= 8) {
            setErrMsg('Password must have more than 8 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setErrMsg('Passwords do not match.');
            return;
        }

        setLoading(true); // Renders a spinning loading icon.
        
        const { error: authError } = supabase.auth.signUp(
            { 
                email: email, 
                password: password,
                options: { 
                    data: {
                        firstName: firstName,
                        lastName: lastName,
                        username: username,
                    }
                }
            }
        )   
        

        if (authError) {
            setErrMsg(authError.message);
            return;
        } 

        Alert.alert('Registration successful!', 'Check your email for confirmation', [
            {
              text: 'OK',
              onPress: () => {
                // Handle the OK button press if needed
              },
            },
          ]);

        setLoading(false); // Stops rendering loading icon.        

    }

    return (
        <View style = {styles.view}>
            <HeaderBar />

             {/* FirstName input */}
             <TextInput
                style={styles.emailInput}
                mode='outlined'
                label='First Name'
                activeOutlineColor='#003D7C'
                autoCapitalize='none'
                value={firstName}
                onChangeText={setFirstName} />

            {/* LastName input */}
            <TextInput
                style={styles.emailInput}
                mode='outlined'
                label='Last Name'
                activeOutlineColor='#003D7C'
                autoCapitalize='none'
                value={lastName}
                onChangeText={setLastName} />

            {/* Username input */}
            <TextInput
                style={styles.emailInput}
                mode='outlined'
                label='Username'
                activeOutlineColor='#003D7C'
                autoCapitalize='none'
                textContentType='username'
                value={username}
                onChangeText={setUsername} />

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
                style={styles.emailInput}
                mode='outlined'
                label='Password'
                activeOutlineColor='#003D7C'
                secureTextEntry
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword} />

            {/* ConfirmPassword input */}
            <TextInput
                style={styles.emailInput}
                mode='outlined'
                label='Confirm Password'
                activeOutlineColor='#003D7C'
                secureTextEntry
                autoCapitalize='none'
                textContentType='password'
                value={confirmPassword}
                onChangeText={setConfirmPassword} />

            {errMsg !== "" && <Text style={styles.errMsg}>{errMsg}</Text>}

            <Button 
                mode="contained"
                buttonColor ="#003D7C"
                rippleColor="#022E5B"
                onPress={handleSubmit}>Register</Button>
            
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
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 50,
        marginRight: 5,
        borderColor: '#003D7C',
        borderWidth: 2
      },
});