import { AuthContext } from "@/context/AuthContext";
import { changePassword, updateDisplayName, getUserbyUid } from "@/firebase/functions";
import { Avatar, Button, Input, Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useState, useEffect, useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import noAvatar from 'public/noAvatar.jpeg'
import PhotoUploadButton from "./PhotoUpload";
import Image from "next/image";
import { isDisplayNameValid } from "@/utilities/displayNameChecker";
import { isPasswordValid } from "@/utilities/passwordChecker";



export default function EditProfile ({setChangedValue, changedValue} : {setChangedValue: any, changedValue: any}){
    const user = useContext(AuthContext);
    const [editName, setEditName] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [profileUpload, setProfileUpload] = useState(false)
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [ready, setReady] = useState(false);
    const [image, setImage]:any = useState(null)
    const [userObj, setUserObj] = useState<any | any >();
    const router = useRouter();
    if(!user) router.push('/login');

    useEffect(() => {
        setReady(false);
        const getUser = async () => {
            if (user?.uid) {
              const ret_user = await getUserbyUid(user.uid);
              if (ret_user){
              setUserObj(ret_user);
              setReady(true);
              }
            }
          }
          getUser();
           
    }, [user])
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        if(editName){
            try{
                if (!isDisplayNameValid(displayName)){
                    throw e;
                }
                await updateDisplayName(displayName)
                
                setEditName(false) 
                setChangedValue(!changedValue)         
            }
            catch(error){
                alert(error)
            }
        }
        else if (editPassword){
        
            const email = form.elements.namedItem("email") as HTMLInputElement;
            try{
                if (!isDisplayNameValid(displayName)){
                    throw e;
                }
                await updateDisplayName(displayName)

                if (oldPassword === newPassword){
                    throw 'The passwords cannot be the same!'
                }

                if(!isPasswordValid(oldPassword, newPassword)){
                    throw e;
                }

                await changePassword(email.value, oldPassword, newPassword)
                setEditPassword(false)
                setChangedValue(!changedValue)
            }
            catch(error){
                alert(error)
            }     
        }
    }


    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(e.target.value)
    }

    const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOldPassword(e.target.value)
    }
    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value)
    }

    if(editName){
        return(
            <div className="flex-grow box-border w-32 p-4 border-4 mr-4 rounded-lg flex flex-col items-center justify-center">
                <Avatar className="my-2" src={userObj?.profile_img|| noAvatar.src} alt="avatar" size="xxl"/>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" color="blue-gray" className="my-2">Your Name</Typography>
                    <Input
                        name="displayName" 
                        size="lg"
                        value= {displayName}
                        onChange={handleNameChange}
                        crossOrigin="anonymous"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                    }}/>
                    <Typography variant="h6" color="blue-gray" className="my-2">Your Email</Typography>
                    <Input
                        name="email" 
                        size="lg"
                        readOnly
                        defaultValue={user?.email || ''}
                        crossOrigin="anonymous"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                    }}/>
                    <Button className="mt-6" fullWidth type="submit">Submit</Button>
                    <Button className="mt-6" fullWidth type="button"  onClick={() => setEditName(!editName)}>Cancel</Button>
                </form>
            </div>
        )
    }

    else if (profileUpload){
        return(
        <div className="flex-grow box-border w-32 p-4 border-4 mr-4 rounded-lg flex flex-col items-center justify-center">
                <Avatar className="my-2" src={userObj?.profile_img|| noAvatar.src} alt="avatar" size="xxl"/>
                <PhotoUploadButton setChanged={setChangedValue} changedValue={changedValue}/>
                <Button className="mt-6" fullWidth type="button"  onClick={() => setProfileUpload(!profileUpload)}>Cancel</Button>
        </div>
        )

    }
    else if(editPassword){
        return(
            <div className="flex-grow box-border w-32 p-4 border-4 mr-4 rounded-lg flex flex-col items-center justify-center">
                <Avatar className="my-2"src={userObj?.profile_img || noAvatar.src} alt="avatar" size="xxl"/>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" color="blue-gray" className="my-2">Your Name</Typography>
                    <Input
                        name="displayName" 
                        size="lg"
                        value={displayName || ''}
                        onChange={handleNameChange}
                        crossOrigin="anonymous"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                    }}/>
                    <Typography variant="h6" color="blue-gray" className="my-2">Your Email</Typography>
                    <Input
                        name="email" 
                        size="lg"
                        readOnly
                        defaultValue={user?.email || ''}
                        crossOrigin="anonymous"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                    }}/>
                    <Typography variant="h6" color="blue-gray" className="my-2">Old Password</Typography>
                    <Input
                        name="oldPassword" 
                        type="password"
                        size="lg"
                        onChange={handleOldPasswordChange}
                        placeholder="************"
                        crossOrigin="anonymous"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                    }}/>
                    <Typography
                        variant="small"
                        color="gray"
                        className="mt-1 flex items-center gap-1 font-normal"
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="-mt-px h-4 w-4"
                        >
                        <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                            clipRule="evenodd"
                        />
                        </svg>
                        Use at least 8 characters, one uppercase, one lowercase, one number and one special character.
                    </Typography>
                    <Typography variant="h6" color="blue-gray" className="my-2">New Password</Typography>
                    <Input
                        name="newPassword" 
                        type="password"
                        size="lg"
                        onChange={handleNewPasswordChange}
                        placeholder="************"
                        crossOrigin="anonymous"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                    }}/>
                    <Button className="mt-6" fullWidth type="submit">Submit</Button>
                    <Button className="mt-6" fullWidth type="button"  onClick={() => setEditPassword(!editPassword)}>Cancel</Button>
                </form>
            </div>
        )
    }
    
    return (
        <>
            {ready ? (
                <div className="flex-grow box-border w-32 p-4 border-4 mr-4 rounded-lg flex flex-col items-center justify-center">
                <Avatar className="my-2"src={userObj?.profile_img || noAvatar.src} alt="avatar" size="xxl"/>
                <Typography className="h5">{`Your Name`} </Typography>
                <Typography className="font-bold text-xl h5">{user?.displayName}</Typography>
                <Typography className="h5">{`Your Email`} </Typography>
                <Typography className="font-bold text-xl h5">{user?.email}</Typography>
                <br></br>
                <div className="flex space-x-4">
                    <Button color="blue-gray" variant="gradient" className="my-2" onClick={() => setEditName(true)}>Edit Display Name</Button>
                    <Button color="blue-gray" variant="gradient" className="my-2" onClick={() => setEditPassword(true)}>Edit Password</Button>
                </div>
                <Button color="blue-gray" variant="gradient" className="my-2" onClick={() => setProfileUpload(true)}>Edit Profile Image</Button>
                
                
            </div>
            ) : <div>Loading</div>}
        </>
       
    )
}