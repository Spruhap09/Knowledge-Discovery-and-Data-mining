import app from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';

const httpServer = createServer(app);
const io = new Server(httpServer, {cors: {origin: '*'}});

import initFirebaseConfig from './dist/src/firebase/firebase.mjs';

const { db, auth } = initFirebaseConfig();

import { 
    addDoc,
    collection,
    getFirestore,
    doc,
    query,
    where,
    or,
    orderBy,
    getDocs,
    getDoc,
    arrayUnion,
    updateDoc,
    limit,
    deleteDoc,
    
  } from "firebase/firestore";
import { getUserbyUid, getPost } from './dist/src/firebase/functions.mjs';

io.on('connection', (socket => {
    console.log('a user connected');
    const token = socket.handshake.query.token;

    if(!token) {
        socket.disconnect();
    }

    socket.on('disconnect', () => {
        console.log('user disconnected');

    });
    
    socket.on('join', (room) => {
        socket.join(room);
        console.log('user joined room ' + room);
    });
    
    socket.on('leave', (room) => {
        socket.leave(room);
        console.log('user left room ' + room);
    });
    
    socket.on('send_post_to_user', async (data) => {
        console.log('send_post_to_user accessed');
        const { postId, recipientId, post } = data;

        // console.log(postId, recipientId, post);

        const senderId = token;
        const existingChat = query(collection(db, "chats"), where("participants", "array-contains", senderId));



        let chatID = await getDocs(existingChat).then((querySnapshot) => {
            let chatID = null;
            querySnapshot.forEach((doc) => {
                if(doc.data().participants.includes(recipientId)) {
                    chatID = doc.id;
                }
            });
            return chatID;
        });

        if(chatID) {
            const messageRef = doc(db, "chats", chatID);
            await updateDoc(messageRef, {
                updatedAt: new Date().toISOString(),
                messages: arrayUnion({
                    senderId: senderId,
                    post: postId,
                    createdAt: new Date().toISOString(),
                })
            });
            return;
        } else{
            const newChat = await addDoc(collection(db, "chats"), {
                participants:[senderId, recipientId],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                messages: []
            });

            // console.log(newChat.id);

            const messageRef = doc(db, "chats", newChat.id);
            await updateDoc(messageRef, {
                updatedAt: new Date().toISOString(),
                messages: arrayUnion({
                    senderId: senderId,
                    post: postId,
                    createdAt: new Date().toISOString(),
                })
            });
            chatID = newChat.id;
        }

        // socket.to(recipientId).emit('receive_post', post);
        socket.to(recipientId).emit('messages', chatID);
    });

    socket.on('chatrooms', async (data) => {
        console.log('chatrooms accessed');
        // console.log(data)
        const userId  = data;
        // console.log(userId);
        const chatrooms = query(collection(db, "chats"), where("participants", "array-contains", userId), orderBy("updatedAt", "desc"));
        const chatroomsSnapshot = await getDocs(chatrooms);
        const chatroomsData = [];
        chatroomsSnapshot.forEach((doc) => {
            chatroomsData.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        // console.log(chatroomsData);

        for (let i = 0; i < chatroomsData.length; i++) {
            const chatroom = chatroomsData[i];
            const pIds = chatroom.participants.filter((e) => {
                return e !== userId;
            });
            const person = await Promise.all(pIds.map(async (e) => {
                    return await getUserbyUid(e).then((user) => {
                        return user.displayName;
                    })
            }));
            chatroom.recipient = person[0];
        }
        // console.log(chatroomsData);
        socket.emit('chatrooms', chatroomsData);
    });

    socket.on('messages', async (data, userId) => {
        console.log('messages accessed');
        // console.log(data);
        // console.log(userId);
        const chatId = data;
        // console.log(chatId);
        const chat = query(doc(db, "chats", chatId));
        const messagesSnapshot = await getDoc(chat);
        const chatData = messagesSnapshot.data();
        const recipientId = chatData.participants.filter((e) => {
            return e !== userId;
        });
        const person = await Promise.all(recipientId.map(async (e) => {
            return await getUserbyUid(e).then((user) => {
                return user.displayName;
            })
        }));
        const recipientName = person[0];
        // console.log(recipientName);
        const messages = chatData.messages || [];
        messages.sort((a, b) => {
            //newest to oldest
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const posts = await Promise.all(messages.map(async (e) => {
            return await getPost(e.post).then(async (post) => {
                post.senderId = await getUserbyUid(e.senderId).then((user) => {
                    return user.displayName;
                });
                post.time = e.createdAt;
                // console.log(post);
                return post;
            })}));
        

        // console.log(posts);
        socket.emit('messages', posts, recipientName);
    });
}));

httpServer.listen(2000, () => {
    console.log(`socket.io server -> listening on *:${2000}`);
});



