import { saveDraft } from "@/firebase/functions";
import useCanvas from "@/hooks/useCanvas";
import { Button } from "@material-tailwind/react";
import { Dispatch, SetStateAction } from 'react';


interface SaveDraftProps {
    setDrafts: Dispatch<SetStateAction<string[]>>;
  }

export default function SaveDraft({setDrafts}: SaveDraftProps) {

    const handleSaveDraft = async () => {
        // Get canvas element
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        if(!canvas) return;

        // Save canvas to firestore
        const url = await saveDraft(canvas);
        if(!url) return;

        // Clear canvas
        const context = canvas.getContext('2d');
        context?.clearRect(0, 0, canvas.width, canvas.height);
        setDrafts((drafts: string[]) => [...drafts, url]);
    }

    return (
        <div className="flex items-center m-5">
            <Button variant="outlined" color="blue-gray" onClick={handleSaveDraft}>Save Draft</Button>
        </div>
    )
}