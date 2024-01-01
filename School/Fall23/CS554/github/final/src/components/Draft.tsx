import useCanvas from "@/hooks/useCanvas";
import { Button, Card, CardFooter, CardHeader, IconButton } from "@material-tailwind/react";
import { getImageFromUrl, getBytesFromUrl, deleteDraft } from "@/firebase/functions";

import { useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "@/context/AuthContext";


export default function Draft({ url, setDrafts }: { url: string, setDrafts: Function }) {

    const [src, setSrc] = useState<string>("");
    const user = useContext(AuthContext);

    useEffect(() => {
        const getSrc = async () => {
            const imgSrc = await getImageFromUrl(url)
            setSrc(imgSrc);
        }
        getSrc();
    }, [url])


    // Loads the draft image into the canvas
    const loadDraft = async () => {
        // Get displayable url from bucket
        const res = await fetch(`/api/image?url=${url}`)
        const {imageUrl} = await res.json();
        if(!imageUrl) return;

        // Get canvas element
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        if (!canvas || !context) return;

        // Load image into canvas
        const img = new window.Image();
        img.src = imageUrl;
        img.crossOrigin = "anonymous";
        img.onload = () => {
            context?.clearRect(0, 0, canvas.width, canvas.height);
            context?.drawImage(img, 0, 0);
        }
        img.onerror = function() {
            console.error("Failed to load image. Check CORS settings.");
        };
    }
    
    // TODO investigate if this loads the drafts faster
    // const loadDraft = async () => {
    //     const bytes = await getBytesFromUrl(src);

    //     const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    //     const context = canvas.getContext("2d");
    //     if (!canvas || !context) return;

    //     const imgData = new ImageData(new Uint8ClampedArray(bytes), canvas.width, canvas.height);
    //     context?.clearRect(0, 0, canvas.width, canvas.height);
    //     context.putImageData(imgData, 0, 0);
    // }

    // Deletes the draft from firestore
    const trash = async () => {
        if(!user || !user.uid) throw 'No user in draft component'
        const newDrafts = await deleteDraft(url, user.uid);
        setDrafts(newDrafts);
    }

    return (
        <Card className="p-2 m-2">
            <CardHeader onClick={loadDraft} className="p-2">
                {src &&<Image src={src} alt="draft" width={100} height={100} className="border-2 border-blue-gray-200 rounded-md"/>}
            </CardHeader>
            <CardFooter className="w-full flex justify-center">
                {src && <IconButton variant="outlined" fullWidth onClick={trash}>
                    <TrashIcon className="w-full"/>
                </IconButton>
                    }
            </CardFooter>
        </Card>
    )
}