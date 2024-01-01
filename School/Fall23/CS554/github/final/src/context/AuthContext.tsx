import { Spinner } from "@material-tailwind/react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<User|null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode}) {
    const [currentUser, setUser] = useState<User|null>(null);
    const [loading, setLoading] = useState(true);

    const auth = getAuth();

    useEffect(() => {
        let listener = onAuthStateChanged(auth, (user: User|null)=> {
            setUser(user)
            setLoading(false);
        })
        return () => {
            if (listener) listener();
          };
    }, [auth])

    if(loading) return <Spinner color="red"/>
    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    )
}