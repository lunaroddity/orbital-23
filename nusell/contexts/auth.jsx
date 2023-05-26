import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";

// Context for accessing user details.
const AuthContext = createContext({});

export function useAuth() {
    return useContext(AuthContext);
}

// Hook to check if user is logged in.
function useProtectedRoute(user) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        console.log(`useProtectedRoute useEffect called`);
        // Checks if there is a segment in the URL called (auth)
        const inAuthGroup = segments[0] === "(auth)"

        // If the user is not logged in, redirect to login page.
        if (!user && !inAuthGroup) { // !user is equivalent to user == null
            console.log(`inAuthGroup: ${inAuthGroup}`);
            router.replace("/login");
        } else if (user && inAuthGroup) { // Else, return to root page.
            router.replace("/");
        }
    }, [user, segments, router]); // Dependency array ensures useEffect is called only if user changes.
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    useProtectedRoute(user); // Check if user is logged in.

    useEffect(() => {
        console.log(`AuthProvider useEffect called`);
        // Listens for an authentication state change.
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`onAuthStateChange event: ${event}`);
            if (event === "SIGNED_IN") { // if user is signed in
                setUser(session.user); // session stores user details
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            }
        })
        return () => data.subscription.unsubscribe(); // Unsubscribes from listener.
    }, []);

    return <AuthContext.Provider value={{ user }}>{children}</ AuthContext.Provider>
}