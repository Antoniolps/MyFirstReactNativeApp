import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

type Role = 'garcom' | 'cozinha';

interface AuthContextType {
    user: User | null
    role: Role | null

}

export const AuthContext = createContext<AuthContextType>({ user: null, role: null });

export const AuthProvider = ({children} : {children : ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async u => {
            setUser(u);
            if (u) {
                const snap = await getDoc(doc(db, 'users', u.uid));
                setRole((snap.data()?.role as any) || null);
            }
            else {
                setRole(null);
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, role }}>
            {children}
        </AuthContext.Provider>
    );
}