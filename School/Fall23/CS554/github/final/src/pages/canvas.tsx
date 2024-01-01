import Canvas from "@/components/Canvas";
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import { AuthContext } from "@/context/AuthContext";
import { logOutUser } from "@/firebase/functions";
import { Button } from "@material-tailwind/react";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useContext } from "react";
import UserDrafts from "@/components/UserDrafts";
import PostButton from "@/components/PostButton";

export default function CanvasPage() {
  const user = useContext(AuthContext);

  return (
    <Layout>
      {!user && (
        <div className="flex flex-row">
        <Button className="m-5" onClick={() => router.push("/login")}>
          Log In
        </Button>
        <Button className="m-5" onClick={() => router.push("/signup")}>
          Sign Up
        </Button>
        </div>
      )}
      <Canvas />
      {user && (
        <>
          <UserDrafts />
          
          <PostButton />
        </>
      )}
    </Layout>
  );
}
