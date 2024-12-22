'use client';

import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const { loginUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null); // For error handling
    const [loading, setLoading] = useState(false); // For loading state

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset any previous errors
        setLoading(true); // Set loading to true while awaiting login

        try {
            const response = await loginUser(username, password);
            if (response.accessToken) {
                // Save the access token to cookies
                Cookies.set('accessToken', response.accessToken, { expires: 7 });

                // Redirect to home page or protected page after login success
                window.location.href = '/'; // Adjust this based on your app's structure
            }
        } catch (err) {
            console.error(err);
            setError('Invalid credentials or login failed.');
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded shadow-md w-80">
                <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Login</h1>

                {error && (
                    <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 mb-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:ring focus:ring-blue-300 dark:focus:ring-blue-800"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:ring focus:ring-blue-300 dark:focus:ring-blue-800"
                    required
                />
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-400"
                    disabled={loading} // Disable the button while loading
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
