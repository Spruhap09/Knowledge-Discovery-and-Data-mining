import { Button, Typography } from "@material-tailwind/react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import SamplePost from "@/components/SamplePost";

export default function Home() {
  const router = useRouter();
  return (
    <Layout>
      <Typography variant="h1">5 Devs: Burgers and Bevs</Typography>
      <div className="flex flex-col md:flex-row md:justify-between w-1/2 ">
        <div className="flex flex-row md:flex-col w-1/2">
          <div className="p-4 text-xl">
            <p>Introducing <span className="font-bold">5 Devs</span>, an innovative application crafted for artists and creative minds who are passionate about digital artistry. 5 Devs is not just another drawing app; it's a revolutionary platform that combines the thrill of artistic creation with the joys of social interaction, akin to popular platforms like Instagram but with a unique focus on direct artistic creation.</p>
          </div>
          <div className="p-4 text-xl">
            <p><span className="font-bold">Your Personalized Artistic Profile: </span>Create a profile that mirrors your artistic evolution. On 5 Devs, your profile is more than just a gallery; it's a narrative of your creative journey. Publish your completed pieces, share insights into your artistic process, and curate a portfolio that truly represents your artistic identity.</p>
          </div>
          <div className="p-4 text-xl">
            <p>5 Devs is more than just an application; it's a movement that celebrates creativity, collaboration, and community. It's a platform where every line drawn and every color chosen tells a story and connects you with a world of artists.</p>
          </div>
          <div className="items-center justify-center p-4 text-xl text-center">
              <p><span className="font-bold">Embark on your creative journey with 5 Devs today and redefine the way you create and share art!</span></p>
              {/* <Button className="m-5" onClick={() => router.push("/canvas")}>
              Try Canvas Now!
              </Button> */}
          </div>
        </div>
        
        <div className="flex flex-col items-center w-1/2">
          <div className="p-4 text-xl">
            <p>Samples of Popular ArtWork on the Platform!</p>
          </div>
          <div className="flex-grow h-60 overflow-y-scroll scrollbar-thumb-blue-gray-800 scrollbar-thin shadow-md">
            {<SamplePost/>}
          </div>
          <div>
            <Button className="m-5" onClick={() => router.push("/canvas")}>
              Try Canvas Now!
            </Button>
          </div>
        </div>

      </div>

      <div>
        <Button className="m-5" onClick={() => router.push("/login")}>
          Log In
        </Button>
        <Button className="m-5" onClick={() => router.push("/signup")}>
          Sign Up
        </Button>
      </div>
    </Layout>
  );
}
