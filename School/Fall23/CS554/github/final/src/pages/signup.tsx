import GoogleButton from "@/components/GoogleButton";
import Layout from "@/components/Layout";
import { AuthContext } from "@/context/AuthContext";
import { signUpWithEmailAndPassword } from "@/firebase/functions";
import { HomeModernIcon } from "@heroicons/react/24/solid";
import {
  Card,
  Typography,
  Input,
  Checkbox,
  Button,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState, useRef, useEffect } from "react";
import {isDisplayNameValid} from "@/utilities/displayNameChecker"
import { isPasswordValid } from "@/utilities/passwordChecker";
import { isEmailValid } from "@/utilities/emailChecker";

export default function SignUp() {
  const user = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState("");
  const router = useRouter();

  const displayNameRef:any = useRef(null)
  const passwordRef:any = useRef(null)
  const emailRef:any = useRef(null)


  useEffect(() => {
    const inputElement = emailRef.current;
  
    if (inputElement) {
      console.log(inputElement)
      inputElement.focus();
    }
  }, []);

  // Redirect to canvas if user is logged in
  if (user) router.push("/canvas");

  // Triggered on form submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Extract form data
    const form = e.target as HTMLFormElement;
    const displayName = form.elements.namedItem(
      "displayName"
    ) as HTMLInputElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const passwordConfirmation = form.elements.namedItem(
      "passwordConfirmation"
    ) as HTMLInputElement;

    try {

      //checking for display names
      
      if (!isDisplayNameValid(displayName.value)){
        displayNameRef.current.focus()
      }

      //checking for emails
      if (!isEmailValid(email.value)){
        emailRef.current.focus()
      }

      //checking for password

      if (password.value !== passwordConfirmation.value){
        throw "The passwords must be the same!"
    }
      if (!isPasswordValid(password.value, passwordConfirmation.value)){
        passwordRef.current.focus()
      }

    } catch (error) {
      alert(error)
      return 
    }
    

    // Check if passwords match
    if (password.value !== passwordConfirmation.value) {
      setPwMatch("Passwords do not match");
      return false;
    }

    // Sign up
    try {
      await signUpWithEmailAndPassword(
        email.value,
        password.value,
        displayName.value
      );
    }
    catch (error) {
      console.log(error, typeof error, "error");
      alert(error);
      return
    }
  };

  return (
    <Layout>
      <Card color="transparent" shadow={true} className="p-20">
        <CardHeader className="p-5">
          <Typography variant="h4" color="blue-gray">
            Sign Up
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Enter your details to continue to your canvas.
          </Typography>
        </CardHeader>
        <CardBody>
          <form
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
            onSubmit={handleSignUp}
          >
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Display Name
              </Typography>
              <Input
                ref={displayNameRef}
                name="displayName"
                size="lg"
                placeholder="Your Name"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                crossOrigin="anonymous"
              />
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Email
              </Typography>
              <Input
                ref={emailRef}
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
              {pwMatch.length > 0 && <Typography color="red">{pwMatch}</Typography>}
              <Input
                ref={passwordRef}
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
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Confirm Password
              </Typography>
              <Input
                name="passwordConfirmation"
                type="password"
                size="lg"
                placeholder="********"
                className="rounded-full p-3 !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                crossOrigin="anonymous"
              />
            </div>

            <Button className="mt-6" fullWidth type="submit">
              Sign Up
            </Button>
          </form>
        </CardBody>
        <CardFooter>
          <GoogleButton />
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-gray-900">
              Log In
            </Link>
          </Typography>
        </CardFooter>
      </Card>
    </Layout>
  );
}
