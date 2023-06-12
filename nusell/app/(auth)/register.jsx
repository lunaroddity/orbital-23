import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { View, Image, StyleSheet } from 'react-native';
import { Text, TextInput, ActivityIndicator, Button } from 'react-native-paper';
import { HeaderBar } from './_layout';
import * as ImagePicker from "expo-image-picker";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading , setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [avatar, setAvatar] = useState(null);
    
    const handleAddAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        })

        if (!result.canceled) {
            // setImage accesses only the first image and gets its URI.
            setAvatar(result.assets[0].uri);
        }
        console.log(`result: ${JSON.stringify(result)}`);
    }

    const handleSubmit = async () => {
        if (firstName === '') {
            setErrMsg('First Name cannot be empty.');
            return;
        }
        if (lastName === '') {
            setErrMsg('Last Name cannot be empty.');
            return;
        }
        if (username === '') {
            setErrMsg('Username cannot be empty.');
            return;
        }
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

        let imageUrl = null;
        if (avatar != null) {
            // To be replaced with UUID in future to prevent clashes in naming.
            const { data, error } = await supabase.storage.from('user information').upload(`${new Date().getTime()}`, 
                {
                    uri: avatar,
                    type: 'jpg',
                    name: 'name'
                });

            // If image cannot be uploaded, stop loading icon and show error message
            if (error) {
                setLoading(false);
                setErrMsg(error.message);
                return;
            }
            // Pulls image URL from supabase.
            const { data: { publicUrl } } = supabase.storage.from('user information').getPublicUrl(data.path);
            imageUrl = publicUrl;   
        }


        setLoading(true); // Renders a spinning loading icon.
        const { userError } = await supabase.from('user information')
            .insert({ firstName: firstName, lastName: lastName, username: username, avatar: imageUrl})
            .select()
            .single();

        const { authError } = supabase.auth.signUp({ email, password });

        setLoading(false); // Stops rendering loading icon.
        if (userError) {
            setErrMsg(userError.message);
            return;
        } else if (authError) {
            setErrMsg(authError.message);
            return;
        }
    }

    return (
        <View style = {styles.view}>
            <HeaderBar />

            <Image style= {styles.avatar} source={{ uri: avatar }} />

            <Button onPress={handleAddAvatar}>Add Image</Button>

            {/* FirstName input */}
            <TextInput
                style={styles.emailInput}
                mode='outlined'
                label='First Name'
                activeOutlineColor='#003D7C'
                autoCapitalize='none'
                textContentType='name'
                value={firstName}
                onChangeText={setFirstName} />

            {/* LastName input */}
            <TextInput
                style={styles.emailInput}
                mode='outlined'
                label='Last Name'
                activeOutlineColor='#003D7C'
                autoCapitalize='none'
                textContentType='name'
                value={lastName}
                onChangeText={setLastName} />

            {/* Username input */}
            <TextInput
                style={styles.emailInput}
                mode='outlined'
                label='Username'
                activeOutlineColor='#003D7C'
                autoCapitalize='none'
                textContentType='nickname'
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
                autoCapitalize='none'
                textContentType='none'
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