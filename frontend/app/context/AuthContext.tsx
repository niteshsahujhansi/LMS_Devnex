'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { login, logout, refreshAccessToken } from '../utils/auth'; // Assuming these utils are implemented

interface AuthContextType {
    user: string | null;
    loginUser: (username: string, password: string) => Promise<{ accessToken: string }>;
    logoutUser: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loginUser: async () => ({ accessToken: '' }),
    logoutUser: () => {},
    isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // To handle loading state while checking authentication
    const router = useRouter();

    // Login handler
    const loginUser = async (username: string, password: string) => {
        try {
            const response = await login(username, password); // login function should handle token setting
            setUser(username); // Set user based on the response
            router.push('/'); // Redirect after login
            return response; // Return the login response
        } catch (error) {
            console.error('Login failed', error);
            throw error; // Ensure error is thrown for handling
        }
    };

    // Logout handler
    const logoutUser = () => {
        logout(); // Logout should clear token and any other session data
        setUser(null); // Reset user state
        router.push('/'); // Redirect to home page after logout
    };

    // Check authentication status on page load
    const checkAuthStatus = async () => {
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
            setIsLoading(false); // Set loading to false if no token exists
            return;
        }

        try {
            // Optionally verify token validity or decode it (e.g., JWT)
            setUser('Authenticated User'); // Here you can extract actual user info if available (e.g., username or user ID)
        } catch {
            try {
                await refreshAccessToken(); // Attempt to refresh token if expired
                setUser('Authenticated User'); // User authenticated after refreshing token
            } catch {
                logout(); // Logout if token refresh fails
            }
        }

        setIsLoading(false); // Set loading to false after authentication check
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Optional loading state while checking authentication
    }

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
