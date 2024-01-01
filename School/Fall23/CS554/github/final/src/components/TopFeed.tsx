import Post from "./Post";
import { getPost, getImageFromUrl, getUserPostsLimit, getAllPosts } from "@/firebase/functions"
import { AuthContext } from "@/context/AuthContext";
import { Key, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { DocumentData } from "firebase/firestore";


export default function TopFeed() {
    const user = useContext(AuthContext);
    const [posts, setPosts] = useState<any[] | null>(null);


    useEffect(() => {
        const getPosts = async () => {
            //gets all the posts from the database
            const data: any = await getAllPosts();

            const newest = data.sort((a, b) => {
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            });

            // sorts the posts from most to least likes
            const sortedPosts = newest.sort((a:any, b:any) => b.likes.length - a.likes.length);
            
            //sets the current list of top posts
            setPosts(sortedPosts.slice(0,10));
        }
        getPosts(); 
        }

    , []);

    return(
        <div>
            {posts && posts.map((post: { post_id: Key | null | undefined | any; }) =>
                <div key={post.post_id} className="px-3">
                    <Post id={post.post_id} posts={posts} setPosts={undefined} sample={undefined} />

                </div> 
            )}
        </div>
    )
}