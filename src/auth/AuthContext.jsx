import { createContext, useContext, useEffect, useState } from 'react';
import { errorMessage } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => (r.ok ? r.json() : null))
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    async function login(email, password) {
        const r = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!r.ok) throw new Error('Invalid email or password');
        setUser(await r.json());
    }

    async function changePassword(currentPassword, newPassword) {
        const r = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword }),
        });
        if (!r.ok) throw new Error(await errorMessage(r, 'Could not change password'));
        setUser(await r.json());
    }

    async function logout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, changePassword, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

