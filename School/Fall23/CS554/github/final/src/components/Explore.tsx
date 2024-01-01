import Post from "./Post";
import { getPost, getImageFromUrl, getUserPostsLimit, getAllPosts } from "@/firebase/functions"
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";


export default function Explore({userObj, posts, setPosts}: {userObj: any, posts:any, setPosts:any}){

    const user = useContext(AuthContext);
    const [explorePosts, setExplorePosts]:any = useState(null)

    useEffect(() => {
        const getPosts = async () => {
                if(user){
                    let userPosts = posts

                    //make sure there are no posts from the current user
                    userPosts = userPosts.filter((post:any) => {
                        return post.userid !== user.uid;
                    })

                    //make copy of posts
                    let userPostsCopy = [...userPosts];
                    
                    //only take the posts that were made today
                    userPosts = userPosts.filter((post:any) => {
                        const today = new Date();
                        const postDate = new Date(post.timestamp);
                        return today.getDate() === postDate.getDate() && today.getMonth() === postDate.getMonth() && today.getFullYear() === postDate.getFullYear();
                    })

                    //sort by likes
                    userPosts.sort((a: { likes: string | any[]; }, b: { likes: string | any[]; }) => {
                        return b.likes.length - a.likes.length;
                    });

                    //if there are less than 10 posts, add the rest of posts sorted by most liked
                    if(userPosts.length < 10){
                        userPostsCopy.sort((a, b) => {
                            return b.likes.length - a.likes.length;
                        });
                        userPosts = userPosts.concat(userPostsCopy.slice(0, 10 - userPosts.length));
                    }

                    //make sure there are no duplicate posts in userPosts
                    const seen = new Set();
                    userPosts = userPosts.filter((post:any) => {
                        const duplicate = seen.has(post.post_id);
                        seen.add(post.post_id);
                        return !duplicate;
                    })

                    //set the posts
                    setExplorePosts(userPosts || null);
                }
            }
            getPosts();
    }, [user]);

    return(
        <div>
            {explorePosts && explorePosts.map((post:any) =>
            <div key={post.post_id} className="px-3">
            
                <Post id={post.post_id} posts={explorePosts} setPosts={setPosts} sample={false}/>
                {/* <Post id={post.post_id} posts={posts} setPosts={undefined} sample={undefined}/> */}
            </div> 
            )}
        </div>
    )
}