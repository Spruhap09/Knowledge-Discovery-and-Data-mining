import Layout from "@/components/Layout";
import UserPosts from "@/components/UserPosts";
import { AuthContext } from "@/context/AuthContext";
import { Avatar, Button, CardHeader, Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { getPost } from "@/firebase/functions";
import Post from "@/components/Post";
import { DocumentData } from "firebase/firestore";


export default function IndividualPost(){
    const router = useRouter();
    const {id}:any = router.query;
    const user = useContext(AuthContext);
    const [ready, setReady] = useState(false);
    const [post, setPost]:any = useState([])
    const posts: DocumentData[] = [];
    
    if(!user) router.push('/login');

    useEffect(() => {
        setReady(false);
        const getIndividualPost = async () => {
            if (user){
              try {
                const individualPost = await getPost(id)
                setPost([individualPost])
                
                
              } catch (error) {
                console.log(error + " big error man")
                setReady(true)
              }
            }   
        }
        getIndividualPost()
        setReady(true)
    }, [user, id])

    return (
        <Layout>
          {ready ? (
            <div>
              <Post id={post[0]?.post_id} posts={post} setPosts={setPost} sample={false} />
            </div>
          ) : (
            <div>Loading</div>
          )}
        </Layout>
      );
}