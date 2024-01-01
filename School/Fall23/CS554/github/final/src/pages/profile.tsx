import Layout from "@/components/Layout";
import UserPosts from "@/components/UserPosts";
import { AuthContext } from "@/context/AuthContext";
import { Avatar, Button, CardHeader, Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import EditProfile from "../components/EditProfile";
import ProfileStats from "../components/ProfileStats";
import { getUserPostsLimit } from "@/firebase/functions";

export default function Profile() {

    const user = useContext(AuthContext);
    const [posts, setPosts] = useState<any[] | null>(null);
    const [ready, setReady] = useState(false);
    const router = useRouter();
    const [changeValue, setChangedValue] = useState(false);
    if(!user) router.push('/login');

    useEffect(() => {
        setReady(false);
        const getPosts = async () => {
                if(user){
                    const userPosts = await getUserPostsLimit(user.uid);
                    if (userPosts) setReady(true);
                    setPosts(userPosts || null);
                }
            }
            getPosts();
    },[changeValue])

    return (
        
        
        <Layout>
            {ready ? (
                <>
                    <div className="sticky flex flex-col justify-center items-center">
                        <Typography variant="h2" className="">{'Welcome to your profile page!'} </Typography>
                    </div>
                    <div className="flex justify-between py-10 w-full">
                        <EditProfile setChangedValue={setChangedValue} changedValue={changeValue}/>
                        <ProfileStats posts={posts} />

                    </div>
                    <div>
                        <Typography variant="h4" className="text-center">Your Posts</Typography>
                        <UserPosts setPosts={setPosts} posts={posts} />
                    </div>
                    <Button color="blue-gray" variant="gradient" onClick={() => router.push('/canvas')}>Back to Canvas</Button>
                </>
                ) : <div>Loading</div>}
        </Layout>
        
    )
}