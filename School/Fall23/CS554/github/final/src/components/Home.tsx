import Post from "./Post";
import { getPost, getImageFromUrl, getUserPostsLimit } from "@/firebase/functions"
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import UserPosts from "./UserPosts";





export default function Home({userObj, posts, setPosts}: {userObj: any, posts:any, setPosts:any}){

    const user = useContext(AuthContext);
    const [homePosts, setHomePosts]:any = useState(null)

    useEffect(() => {
        const getPosts = async () => {
                if(user && posts && userObj){

                    //get all the uids of the people the user is following
                    const following = userObj.following;
                    //get all posts from today from the people the user is following
                    let userPosts:any = [];
                    for(let i = 0; i < following.length; i++){
                        for (let j=0; j < posts?.length; j++){
                            if (following[i] === posts[j].userid){
                                userPosts = userPosts.concat(posts[j])
                            }
                        }
                    }
                    //add users own posts
                 
                    for(let i=0; i<posts?.length; i++){
                        if (userObj?.posts?.includes(posts[i].post_id)){
                            userPosts = userPosts.concat(posts[i])
                        }
                    }

                    //sort the posts by timestamp field
                    userPosts.sort((a: { timestamp: string; }, b: { timestamp: string; }) => {
                        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                    });

                    //set the posts
                    setHomePosts(userPosts || null);
                }
            }
            getPosts();
    }, [user]);

    return(
        <div>
            {homePosts && homePosts.map((post:any) =>
            <div key={post.post_id} className="px-3">
            
             <Post id={post.post_id} posts={homePosts} setPosts={setPosts} sample={false}/>
            </div> 
            )}
        </div>
    )
}
