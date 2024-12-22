'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login'); // Redirect to login if not authenticated
        }
    }, [isAuthenticated, router]);

    return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;
