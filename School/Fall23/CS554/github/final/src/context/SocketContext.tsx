import { query } from 'firebase/firestore';
import React, { ReactNode, createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { set } from 'firebase/database';

interface SocketContextProps {
    socket: Socket | undefined;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({
    socket: undefined,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket>();
    const [isConnected, setIsConnected] = useState(false);
    const [oldUser, setOldUser] = useState<string | undefined>();
    const user = useContext(AuthContext);

    useEffect(() => {
        // console.log(user);
        if(isConnected && socket && (user?.uid !== oldUser)){
            socket?.emit('disconnect');
            socket?.off();
            setSocket(undefined);
            setIsConnected(false);
        }

        if(user && !socket && user.uid){
            console.log('connecting socket');
            const newSocket = io('http://localhost:2000', {query: { token: user?.uid }});
            setSocket(newSocket);
            setOldUser(user.uid);
            return () => {
                setSocket(undefined);
                setIsConnected(false);
            };
        }

    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
