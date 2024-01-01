import { useEffect, useState, useContext, SetStateAction } from 'react';
import { useSocket } from '../context/SocketContext';
import { AuthContext } from "@/context/AuthContext";
import { Button } from '@material-tailwind/react';

interface Chatroom {
    name: string;
    id: string;
    recipient: string;
}

export default function Chatrooms() {
    const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
    const { socket } = useSocket();
    const user = useContext(AuthContext);

    useEffect(() => {
        console.log(socket);
        socket?.on('chatrooms', (chatrooms: Chatroom[]) => {
            setChatrooms(chatrooms);
        });

        if(user){
            socket?.emit('chatrooms', user.uid);
        }

        return () => {
            socket?.off('chatrooms');
        };

    }, [socket, user]);

    // console.log(chatrooms);

    return (
        <div className='text-center'>
            <p className="text-2xl font-bold border border-4 rounded-lg border-blue-gray-500 p-2 ">Chatrooms</p>
            <div className='flex flex-col items-center'>
                {chatrooms && chatrooms.length > 0? chatrooms.map((chatroom, index) => (
                    <div key={chatroom.id + "_" + index} className="p-3">
                        <Button key={chatroom.id} onClick={() => {window.location.href = `/chatrooms/${chatroom.id}`}}>{chatroom.recipient}</Button>
                    </div>
                )): (<p className="text-2xl font-bold p-10">You have no chatrooms in session!</p>)}
            </div>

        </div>
    );
}