import Head from "next/head";
import { useEffect, useState } from "react";
import {
  FormControl,
  Input,
  Button,
  Text,
  Flex,
  Heading,
  Box,
  Radio,
  RadioGroup,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
} from "firebase/auth";
import { firebaseApp } from "../src/utils/firebase.config";
import normalizeEmail from "../src/utils/normalizeEmail";

export default function Message() {
  const router = useRouter();
  const { userid } = router.query;
  const [value, setValue] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [stuff, setStuff] = useState(null);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  const provider = new GoogleAuthProvider();

  const handleAuth = () => {
    if (isSignedIn) {
      console.log(navigator);
      //   navigator["share"]({
      //     url: `https://anon.vercel.app/${normalizeEmail(user?.email)}`,
      //     title: "Anonymous Message App",
      //     text: "Send an anonymous message to a friend",
      //   });
    } else {
      const auth = getAuth(firebaseApp);
      signInWithRedirect(auth, provider);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
      setIsSignedIn(!!user);
    });
  }, []);

  useEffect(() => {
    const auth = getAuth();
    getRedirectResult(auth)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        navigator.share({
          url: `https://anon.vercel.app/${normalizeEmail(user?.email)}`,
          title: "Anonymous Message App",
          text: "Send an anonymous message to a friend",
        });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error?.code;
        const errorMessage = error?.message;
        // The email of the user's account used.
        const email = error?.customData?.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }, []);

  return (
    <div>
      <Head>
        <title>Anonymous Messages App</title>
        <meta
          name="description"
          content="An app that allows you to send anonymous messages to friends"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Heading>Anonymous Message App</Heading>

        <Box as="form" onSubmit={handleSubmit}>
          <Textarea
            value={value}
            onChange={handleInputChange}
            placeholder="Write an anonymous message for me"
            size="sm"
          />
          <Button type="submit">Send</Button>
        </Box>

        <Box>
          <Heading>Thank you for sending that message</Heading>
          <Text>Now send yours</Text>
          {JSON.stringify(stuff === undefined)}
          <Button onClick={() => setStuff(navigator.share)}>
            Trigger the JavaScript share API or send the user to the Auth screen
          </Button>
        </Box>
      </Box>
    </div>
  );
}
