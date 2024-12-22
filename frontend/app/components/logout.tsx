'use client';

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const LogoutButton = () => {
    const { logoutUser } = useContext(AuthContext);

    const handleLogout = () => {
        logoutUser(); // Calls the logout function from the context
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
