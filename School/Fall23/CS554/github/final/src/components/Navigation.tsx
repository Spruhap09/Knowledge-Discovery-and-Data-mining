import { useRouter } from "next/router";
import { MagnifyingGlassIcon, PencilSquareIcon, RectangleStackIcon, UserCircleIcon, HomeIcon, ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import {
  Navbar,
  Typography,
  IconButton,
  Button,
  Input,
} from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { getPost, getUserbyUid, logOutUser, getChatroomParticipants} from "@/firebase/functions";
import Head from "next/head";
import Home from "./Home";
import ToggleButton from './ToggleButton';
import { get } from "http";
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Navigation() {
    const router = useRouter();
    const user = useContext(AuthContext);
    const [pageName, setPageName] = useState("");
    const userId = user?.uid;

    useEffect(() => {
      async function getPageName(){

        if (router.asPath.startsWith('/user/')){
          const id = router.asPath.split('/')[2]
          const viewUser = await getUserbyUid(id);
          setPageName(`${viewUser?.displayName}'s Profile`)
        } else if (router.asPath.startsWith('/post/')){
          const id = router.asPath.split('/')[2]
          const viewPost = await getPost(id);
          setPageName(`Post titled ${viewPost.description}`)
        } else if(router.asPath.startsWith('/chatrooms/')){
          const id = router.asPath.split('/')[2]
          let viewUser = await getChatroomParticipants(id, userId);
          viewUser = await getUserbyUid(viewUser[0]);
          setPageName(`Chatroom with ${viewUser?.displayName}`)
        }
        else{
          setPageName(router.asPath.slice(1, router.asPath.length));
        }
        
      }
      getPageName()
    }, [router.asPath])


  return (
    <Navbar
      variant="gradient"
      color="blue-gray"
      className="mx-auto max-w-screen-xl from-blue-gray-900 to-blue-gray-800 px-4 py-3"
    >
      <Head><title>{capitalize(pageName)}</title></Head>
      <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="mr-4 ml-2 cursor-pointer py-1.5 capitalize"
        >
          {pageName}
        </Typography>

        <div className="ml-auto flex gap-1 md:mr-4">
          <ToggleButton />
          {!user && (          
            <IconButton title='Home' variant="text" color="white" onClick={() => router.push('/')}>
              <HomeIcon className="h-4 w-4" />
            </IconButton>)}


          {user && (
            <>
            <IconButton title="Chatrooms" variant="text" color="white" onClick={() => router.push('/chatrooms')}>
              <ChatBubbleBottomCenterIcon className="h-4 w-4" /> 
            </IconButton>
            <IconButton title="Feed" variant="text" color="white" onClick={() => router.push('/feed')}>
              <RectangleStackIcon className="h-4 w-4" />
            </IconButton>
            <IconButton title="Search" variant="text" color="white" onClick={() => router.push('/search')}>
              <MagnifyingGlassIcon className="h-4 w-4" />
            </IconButton>
            <IconButton title="Profile" variant="text" color="white" onClick={() => router.push('/profile')}>
              <UserCircleIcon className="h-4 w-4" />
            </IconButton></>
          )}
          <IconButton title="Canvas" variant="text" color="white" onClick={() => router.push('/canvas')}>
            <PencilSquareIcon className="h-4 w-4" />
          </IconButton>
            {user ? <Button onClick={() => logOutUser()}>Sign Out</Button> : <Button onClick={() => router.push('/login')}>Log In</Button>}
        </div>

      </div>
    </Navbar>
  );
}
