import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { logInWithEmailAndPassword } from "@/firebase/functions";
import { useRouter } from "next/router";
import {
  Card,
  Input,
  Typography,
  Button,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { HomeIcon } from "@heroicons/react/24/solid";
import GoogleButton from "@/components/GoogleButton";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function Login() {
  const user = useContext(AuthContext);
  const router = useRouter();

  // Called on form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Extract form data
    const form = e.target as HTMLFormElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    // Log in
    try {
      await logInWithEmailAndPassword(email.value, password.value);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found'){
          alert('Error: User not found')
        }
        else{
          alert('Error: Invalid login details');
        }
      
    }
  };

  // Redirect to canvas if user is logged in
  if (user) router.push("/canvas");

  return (
    <Layout >
      <Card color="transparent" shadow={false} className="p-20">
        <CardHeader className="p-5">
          <Typography variant="h4" color="blue-gray">
            Log In
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Log into your account.
          </Typography>
        </CardHeader>
        <CardBody>
          <form
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
            onSubmit={handleLogin}
          >
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Email
              </Typography>
              <Input
                name="email"
                size="lg"
                placeholder="name@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                crossOrigin="anonymous"
              />
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Password
              </Typography>
              <Input
                name="password"
                type="password"
                size="lg"
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                crossOrigin="anonymous"
              />
            </div>

            <Button className="mt-6" fullWidth type="submit">
              Log In
            </Button>
          </form>
        </CardBody>
        <CardFooter>
          <GoogleButton />
          <Typography color="gray" className="mt-4 text-center font-normal">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-gray-900">
              Sign Up
            </Link>
          </Typography>
        </CardFooter>
      </Card>
    </Layout>
  );
}
