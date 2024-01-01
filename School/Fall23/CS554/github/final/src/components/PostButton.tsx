import { PlusIcon } from "@heroicons/react/24/outline";
import {
  IconButton,
  Input,
  Button,
  SpeedDial,
  SpeedDialAction,
  SpeedDialContent,
  SpeedDialHandler,
} from "@material-tailwind/react";
import { postCanvasToProfile } from "@/firebase/functions";
import { useRouter } from "next/router";
export default function PostButton() {
  const router = useRouter();


  const handleChange = (e:any) => {
    e.target.value = e.target.value.substring(0, 59)
  }

  // Called when user posts a canvas image to their profile
  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Extract the form data
    const form = e.target as HTMLFormElement;
    const description = form.elements.namedItem(
      "description"
    ) as HTMLInputElement;
    if (description.value.length > 59){
      description.value = description.value.substring(0, 30)
    }
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) throw "Canvas is null";
    //last test is if its only spaces
    if (!description || !description.value || /^\s*$/.test(description.value)) throw "Description is null";

    // Store canvas in firestore/cloud storage
    await postCanvasToProfile(canvas, description.value);

    // Send user to profile page to see new post
    router.push("/profile");
  };

  return (
    <div className="w-full flex flex-col items-end ">
      <SpeedDial placement="top">
        <SpeedDialHandler>
          <IconButton size="lg" className="rounded-full">
            <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
          </IconButton>
        </SpeedDialHandler>
        <SpeedDialContent className="bg-white rounded-full">
          <form onChange={handleChange} onSubmit={handlePost} className="flex flex-col justify-center">
            <Input
              name="description"
              label="Title"
              crossOrigin="use-credentials"
              className="p-2"
              autoComplete="off"
            />
            <Button type="submit" className="m-2">
              Post
            </Button>
          </form>
        </SpeedDialContent>
      </SpeedDial>
    </div>
  );
}
