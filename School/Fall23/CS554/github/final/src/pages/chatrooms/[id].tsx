import { SetStateAction, use, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../../context/SocketContext';
import { AuthContext } from "@/context/AuthContext";
import Post from '@/components/Post';
import Layout from '@/components/Layout';
import { getPost, getUserbyUid } from '@/firebase/functions';
import { DocumentData } from 'firebase/firestore';
import { set } from 'firebase/database';
import { Button } from "@material-tailwind/react";
export default function Chatroom() {

    const router = useRouter();
    const { id } = router.query;
    const [posts, setPosts] = useState<DocumentData[]>([]);
    const { socket } = useSocket();
    const user = useContext(AuthContext);
    const [recipicent, setRecipicent] = useState<string | undefined>();

    if(!user) router.push('/login');

    useEffect(() => {
        if(user && typeof id === 'string'){
            socket?.emit('join', id);
            socket?.emit('messages', id, user?.uid);
        }
    }, [id, socket]);

    useEffect(() => {
        socket?.on('messages', (postsData: DocumentData[], name:string) => {setPosts(postsData); setRecipicent(name);});

        return () => {
            socket?.off('messages');
        };
    }, [socket, id]);

    const formatDate = (date: Date) => {
        const d = new Date(date);
        let hours = d.getHours();
        const minutes = d.getMinutes();
        let ampm = 'am';
        if (hours > 12) {
            hours -= 12;
            ampm = 'pm';
        }

        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${hours}:${minutes} ${ampm}`;
    };

    console.log(posts);
    return (
        <div>
            <Layout>
                
                    <div className='w-1/2'>
                        <div className='flex p-50 w-full'>
                            <Button onClick={() => {window.location.href = `/chatrooms`}}>Back to Chatrooms</Button>
                        </div>
                        
                        <p className='text-2xl font-bold flex-grow text-center'>Chatroom: {recipicent}</p>
                    </div>
                <div className='flex flex-col items-center h-screen p-4'>
                    <div className='flex-grow overflow-y-scroll max-h-1/4 scrollbar-thumb-blue-gray-800 scrollbar-thin shadow-md'>
                        <div>
                            {posts.map((post, index) => (
                                <div key={post.post_id + "_" + index} className="max-w-md mx-auto bg-white p-4 rounded shadow mb-4 border-b border-gray-300">
                                    <Post id={post.post_id} posts={[post]} setPosts={undefined} sample={false} />
                                    <p>Sent by: {post.senderId}</p>
                                    <p>Time: {formatDate(post.time)}</p> 
                                </div>

                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    );
}