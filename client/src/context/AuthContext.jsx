import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await axios.get('/api/auth/me');
                setUser(res.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            setUser(res.data.user);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post('/api/auth/register', userData);
            setUser(res.data.user);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
            throw err;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
            setUser(null);
        } catch (err) {
            console.error('Logout error', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
