import React from 'react';
import ProfileCard from "@/components/ProfileCard";
import ChangePassword from "../../components/ChangePassword";
import Layout from "../../components/Layout";
import ChangeDisplayName from '../../components/ChangeDisplayName';
import { useRouter } from 'next/router';
import { Button } from '@material-tailwind/react';
import { useContext} from "react";
import { AuthContext } from "@/context/AuthContext";

 const EditProfileButton = () => {
     const router = useRouter();
     const user = useContext(AuthContext);

     return (
         <>
            <Layout>
             <div className="flex flex-col items-center justify-start space-y-4 w-full pb-10">
                 <div className="max-w-xl w-full mx-auto p-4">
                     <h1 className="text-2xl font-bold text-black mb-4 ml-4">Edit Profile</h1>
                     <ProfileCard />
                 </div>
                 <div className="max-w-xl w-full mx-auto p-4">
                     <ChangeDisplayName />
                 </div>
                 <div className="max-w-xl w-full mx-auto p-4">
                    <div className="max-w-xl mx-auto p-4">
                        <h2 className="text-lg font-medium text-gray-700">Email</h2>
                            <h3 className="mt-4 bg-gray-50 w-full py-2 px-4 text-left text-black font-semibold rounded-lg shadow-md">
                                {user?.email}
                            </h3>
                    </div>
                 </div>
                 <div className="max-w-xl w-full mx-auto p-4">
                     <ChangePassword />
                 </div>
                 <Button color="blue-gray" variant="gradient" className="my-2" onClick={() => router.push("/profile")}>Back to Profile</Button>
             </div>
            </Layout>
         </>
     );
}

 export default EditProfileButton;