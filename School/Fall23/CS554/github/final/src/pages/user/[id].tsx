import Layout from "@/components/Layout";
import UserPosts from "@/components/UserPosts";
import { AuthContext } from "@/context/AuthContext";
import { Avatar, Button, CardHeader, Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { followUser, getUserPostsLimit, getUserStats, getUserbyUid, unfollowUser } from "@/firebase/functions";


export default function UserProfile(){
    const router = useRouter();
    const {id}:any = router.query;
    const user:any = useContext(AuthContext);
    const [posts, setPosts] = useState<any[] | null>(null);
    const [ready, setReady] = useState(false);
    const [userObj, setUserObj] = useState<any | any >();
    if(!user) router.push('/login');

    useEffect(() => {
        setReady(false);
        const getPosts = async () => {
                if(user && typeof id === 'string'){
                    const userPosts = await getUserPostsLimit(id);
                    if (userPosts) {
                        setReady(true)
                    };
                    const ret_user = await getUserbyUid(id);
                    if (ret_user){
                        setUserObj(ret_user);
                    }
                    setPosts(userPosts || null);
                }
            }
            getPosts();
    },[user, id])

    const handleFollow = async () => {
        if(user && typeof id === 'string'){

            await followUser(id, user?.uid);
            const accountUser = await getUserbyUid(id);
            setUserObj(accountUser);
        }
    };

    const handleUnfollow = async () => {
        if(user && typeof id === 'string'){
            await unfollowUser(id, user?.uid);
            const accountUser = await getUserbyUid(id);
            setUserObj(accountUser);
        }
    };

    return (
        <Layout>
            {ready ? (
        <div>
            <div>
                <div className="flex items-center p-5">
                    <img src={userObj?.profile_img === 'empty-profile.png' ? '../empty-profile.png' : userObj?.profile_img}
                    width={500} height={500} className="rounded-full h-12 w-12 object-contain border-2 p-1 mr-3" alt={"profile picture for " + userObj?.displayName} />
                    <div className="flex">
                        <p className="flex-1 font-bold whitespace-nowrap p-2">{userObj?.displayName}</p>
                        <p className="flex-1 font-bold whitespace-nowrap p-2">{`Following: ${userObj?.following.length}`}</p>
                        <p className="flex-1 font-bold whitespace-nowrap p-2">{`Followers: ${userObj?.followers.length}`}</p>
                    </div>    
                    {userObj?.uid !== user?.uid && ( 
                        userObj?.followers.includes(user?.uid) ? (
                            <Button onClick={handleUnfollow}>Unfollow</Button>
                        ) : (
                            <Button onClick={handleFollow}>Follow</Button>
                        )
                    )}
                </div>

                {posts && posts.length > 0 && <Typography variant="h4" className="text-center">User Posts</Typography>}
                {posts && posts.length === 0 && <Typography variant="h4" className="text-center">No Posts yet</Typography>}
                <UserPosts setPosts={setPosts} posts={posts} />
             </div>
        </div> ) : <div>Loading</div>}
        </Layout>
    )
}
