import React from 'react';
import { useRouter } from "next/router";

export default function Popout({content, isOpen, popRef}: {content:any, isOpen:boolean, popRef:any}) {
    const router = useRouter();

const handleClick = (user:any) => {
    console.log("from handle clicked: ")
        router.push(`/user/${user?.uid}`)
}

return (
    <div className='relative'>
    
        {isOpen && (
            <div ref={popRef} className='fixed rounded-xl top-1/3 w-auto h-40 left-1/2 overflow-y-scroll scrollbar-thumb-white scrollbar-thin transform -translate-x-1/2 -translate-y-1/2 bg-blue-gray-800 bg-opacity-80 p-8 text-white'>
                {content.map((e:any) => (
                    <div onClick={() => handleClick(e)} key={e.uid} className="flex items-center space-x-2 ab-3 p-2 block hover:cursor-pointer hover:text-blue-400" >
                        <img src={e?.profile_img === 'empty-profile.png' ? '/../empty-profile.png' : e?.profile_img}
                        alt={"profile picture for user " + e?.displayName}
                        className="h-7 rounded-full" />
                        <p className="text-sm flex-1 truncate space-x-4 overflow-ellipsis block whitespace-no-wrap">
                            <span className="font-bold mr-2">{e?.displayName}</span>
                        </p>
                    </div>
                ))}
                
            </div>
        )}

    </div>



)

}