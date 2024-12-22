import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

/* eslint-disable @typescript-eslint/no-unused-vars */
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const accessToken = Cookies.get('accessToken');
    const headers = accessToken
        ? { ...options.headers, Authorization: `Bearer ${accessToken}` }
        : options.headers;

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        throw new Error('Failed to fetch');
    }

    return response.json();
};

export const login = async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/token/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json();
    const { access, refresh } = data;

    // Store tokens in cookies
    Cookies.set('accessToken', access, { expires: 1 }); // 1 day
    Cookies.set('refreshToken', refresh, { expires: 7 }); // 7 days

    return data;
};

export const refreshAccessToken = async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) throw new Error('No refresh token found');

    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    const { access } = data;

    // Update access token in cookies
    Cookies.set('accessToken', access, { expires: 1 });

    return access;
};

export const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
};
