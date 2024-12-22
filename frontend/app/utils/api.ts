import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Function to get authentication headers
const getAuthHeaders = () => {
    const accessToken = Cookies.get('accessToken');
    const headers: { [key: string]: string } = {
        'Content-Type': 'application/json',
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return headers;
};

// API utility methods
const api = {
    // GET request
    get: async (url: string) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to fetch');
        }

        return response.json();
    },

    // POST request
    post: async (url: string, body: object) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to post');
        }

        return response.json();
    },

    // PUT request
    put: async (url: string, body: object) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to update');
        }

        return response.json();
    },

    // DELETE request
    delete: async (url: string) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to delete');
        }

        return response.status === 204 ? {} : response.json();
    },
};

export default api;
