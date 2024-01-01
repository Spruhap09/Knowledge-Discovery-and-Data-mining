import Layout from "@/components/Layout";
import Home from "@/components/Home";
import Explore from "@/components/Explore"
import { AuthContext } from "@/context/AuthContext";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { getUserbyUid, getAllPosts} from "@/firebase/functions";
import TopFeed from "./TopFeed";



export default function Feed() {

    const user = useContext(AuthContext);
    const router = useRouter();
    if(!user) router.push('/login');

    const [activeTab, setTab] = useState('home');
    const [userObj, setUserObj] = useState<any | any >();
    const [ready, setReady] = useState(false);
    const [posts, setPosts] = useState(null)

    useEffect(()=> {
        const getUser = async () => {
            if (user?.uid) {
              const ret_user = await getUserbyUid(user.uid);
              if (ret_user){
              setUserObj(ret_user);
              try {
                let userPosts:any = await getAllPosts()
                setPosts(userPosts)
                setReady(true);
              } catch (error) {
                console.log(error)
              }
              }
            }
          }
          getUser();

    },[user, posts])

    return(
        <div className="flex flex-row">
            {ready ? (
            <>
                <div className="flex flex-col items-center h-screen p-4">
                    <div className="flex items-center justyify-center space-x-4 py-5">
                        <button className="btn bg-blue-gray-800 text-white font-bold py-6 px-6 rounded-full flex items-center justify-center" onClick={() => setTab('home')}>Home</button>
                        <button className="btn bg-blue-gray-800 text-white font-bold py-6 px-6 rounded-full flex items-center justify-center" onClick={() => setTab('expore')}>Explore</button>
                        <button className="btn bg-blue-gray-800 text-white font-bold py-6 px-6 rounded-full flex items-center justify-center" onClick={() => setTab('topFeed')}>Top 10 Posts</button>
                    </div>
                    <div className="flex items-center justyify-center text-4xl space-x-4 py-5 font-bold">
                        {activeTab == 'expore' ? (<p>Explore</p>) : activeTab == 'home' ? (
                            <p>Home</p>) : (<p>Top 10 Feed</p>)}
                    </div>
                    <div className="flex-2/3 h-200 overflow-y-scroll scrollbar-thumb-blue-gray-800 scrollbar-thin shadow-md">
                        {activeTab == 'home' && <Home posts={posts} setPosts={setPosts} userObj={userObj}/>} 
                        {activeTab == 'expore' && <Explore posts={posts} setPosts={setPosts} userObj={userObj}/>}
                        {activeTab == 'topFeed' && <TopFeed />}
                    </div>
                </div>
                
               
            </>
            ) : <div>Loading</div>}

        </div>
        
    )



}

