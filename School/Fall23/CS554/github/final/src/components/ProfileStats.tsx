import { AuthContext } from "@/context/AuthContext";
import { getUserStats } from "@/firebase/functions";
import { Typography } from "@material-tailwind/react";
import { getUserbyUid } from "@/firebase/functions";
import { useContext, useEffect, useState, useRef } from "react";
import Popout from "../components/Popout"
import { useRouter } from "next/router";

export default function ProfileStats ({posts}: { posts: any }) {
    const user = useContext(AuthContext);
    const [following, setFollowing] = useState<string[]>([]);
    const [followers, setFollowers] = useState<string[]>([]);
    const [drafts, setDrafts] = useState<string[]>([]);
    const [isOpen, setOpen] = useState(false)
    const [followingOpen, setFollowsOpen] = useState(false)
    const router = useRouter();

    const popRef:any = useRef(null)
    const pop2Ref:any = useRef(null)

    //toggles open for followers list
    const togglePop = () => {
        setOpen(!isOpen)
    }

    //toggles open for following list
    const toggle2Pop = () => {
        setFollowsOpen(!followingOpen)
    }

    const handleClickOutside = (e:any) => {

        //will close followers list menu when clicking outside of it
        if (popRef.current && !popRef.current.contains(e.target)){
            setOpen(false)
        }

        //will close following list men u when clicking outside of it
        if(pop2Ref.current && !pop2Ref.current.contains(e.target)){
            setFollowsOpen(false)
        }
    }

    

    useEffect(() => {
        
        const getStats = async () => {
            if(user){
                const stats = await getUserStats(user.uid);
                //get user object for each follower and following
                if (stats){
                let followers_info:any = []
                let following_info:any = []
                for (let i=0; i < stats.followers.length; i++){
                    const ret_user:any = await getUserbyUid(stats.followers[i]);
                    if(!ret_user?.profile_img){
                        ret_user.profile_img = 'empty-profile.png'
                    }
                    followers_info.push(ret_user)
                }

                for(let i=0; i < stats.following.length; i++){
                    const ret_user:any = await getUserbyUid(stats.following[i]);
                    if(!ret_user?.profile_img){
                        ret_user.profile_img = 'empty-profile.png'
                    }
                    following_info.push(ret_user)
                }
                
                
                setFollowers(followers_info);
                setFollowing(following_info);
                setDrafts(stats.drafts);
                }

            }
        }
        getStats();
        
        document.addEventListener('mousedown', handleClickOutside);

        // Remove event listener when the component unmounts
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [user])

    const mostLikedPost = posts && posts.length > 0 &&
    posts.reduce((prev: { likes: string | any[]; }, current: { likes: string | any[]; }) => {
        if (current.likes.length > prev.likes.length) {
          return current;
        } else {
          return prev;
        }
    }, posts[0]);

    const mostCommentedPost = posts && posts.length > 0 &&
    posts.reduce((prev: { comments: string | any[]; }, current: { comments: string | any[]; }) => {
        if (current.comments.length > prev.comments.length) {
          return current;
        } else {
          return prev;
        }
    }, posts[0]);


    //TODO: ADD STUFF ABOUT YOUR MOST LIKED POST SO FAR...
    return (
        <>
        <div className="flex-grow box-border w-32 p-4 border-4 mr-4 rounded-lg flex flex-col items-center justify-center">
            <Typography variant="h5" color="blue-gray" className="my-2">Here are your profile stats!</Typography>
            <Typography onClick={togglePop} className="h6 hover:cursor-pointer hover:cursor-pointer hover:text-blue-400">{`You have `} <span className="font-bold text-xl">{followers.length}</span> {`${followers.length === 1 ? 'follower' : 'followers'}`}</Typography>
            <Typography onClick={toggle2Pop} className="h6 hover:cursor-pointer hover:cursor-pointer hover:text-blue-400">  {`You're ${following.length === 1 ? 'following' : 'following'} `}
                                        <span className="font-bold text-xl">{following.length}</span>
                                        {` ${following.length === 1 ? 'person' : 'people'}`}</Typography>
            <Typography className="h6">{`You have  `} <span className="font-bold text-xl">{posts.length}</span> {`${posts.length === 1 ? 'post' : 'posts'}`}</Typography>
            <Typography className="h6">{`You have `} <span className="font-bold text-xl">{drafts.length}</span> {`${drafts.length === 1 ? 'draft' : 'drafts'}`}</Typography>
            {posts && posts.length > 0 && mostLikedPost && mostLikedPost.likes && (
                <Typography onClick={() => router.push(`/post/${mostLikedPost.post_id}`)} className="h6 hover:cursor-pointer hover:text-blue-400">
                    <span className="font-bold text-xl">{mostLikedPost.description}</span> {` is your most liked post with `} 
                    <span className="font-bold text-xl">{mostLikedPost.likes.length}</span> {`${mostLikedPost.likes.length === 1 ? ' like' : ' likes'}`}
                </Typography>
            )}
            {posts && posts.length > 0 && mostCommentedPost && mostCommentedPost.comments && (
                <Typography onClick={() => router.push(`/post/${mostCommentedPost.post_id}`)} className="h6 hover:cursor-pointer hover:text-blue-400">
                    <span className="font-bold text-xl">{mostCommentedPost.description}</span> {` is your most commented post with `} 
                    <span className="font-bold text-xl">{mostCommentedPost.comments.length}</span> {`${mostCommentedPost.comments.length === 1 ? ' comment' : ' comments'}`}
                </Typography>
            )}
            
        </div>  

        <div>
            {followers.length > 0 && <Popout content={followers} isOpen={isOpen} popRef={popRef}/>}
            {following.length > 0 && <Popout content={following} isOpen={followingOpen} popRef={pop2Ref}/>}
        </div>
        </>
    )
}