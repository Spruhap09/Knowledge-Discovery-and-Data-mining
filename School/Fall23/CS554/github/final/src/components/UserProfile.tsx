import { getUserPosts, getUserPostsLimit } from "@/firebase/functions";
import { AuthContext } from "@/context/AuthContext";
import Post from "@/components/Post";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";


export default function UserProfile({ userDetails }: { userDetails: any }){
    const router = useRouter();

    

    return(
        <div className="hover:cursor-pointer hover:text-blue-400" onClick={() => router.push(`/user/${userDetails?.uid}`)}>
            <div className="flex items-center p-5">
                <img src={userDetails?.profile_img} width={500} height={500} className="rounded-full h-12 w-12 object-contain border-2 p-1 mr-3" alt={"prfoile picture for " + userDetails?.displayName} />
                <p className="flex-1 font-bold">{userDetails?.displayName}</p>
            </div>
        </div>
    )
}