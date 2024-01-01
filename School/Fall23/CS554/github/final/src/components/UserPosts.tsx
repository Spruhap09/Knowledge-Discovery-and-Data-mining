import { getUserPosts, getUserPostsLimit } from "@/firebase/functions";
import { AuthContext } from "@/context/AuthContext";
import Post from "@/components/Post";
import { useContext, useEffect, useState } from "react";


export default function UserPosts({ setPosts, posts }: { setPosts:any, posts: any }) {
    const user = useContext(AuthContext);
    
   
    return (
        <div className="w-full h-full flex flex-row justify-evenly flex-wrap">
          {/* if user exists but post doesn't exist, return a div saying no current posts */}
          {user ? (
            posts ? (
                   
                posts.map((post: any) => { // Add type annotation for 'post'
                    // console.log(post);
                    return <Post key={post.post_id} id={post.post_id} posts={posts} setPosts={setPosts} sample={false} />;
                })
            ) : (
              <div>No current posts</div>
            )
          ) : (
            <div>Loading</div>
          )}
        </div>
      );
      
}

