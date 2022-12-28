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
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getAuth,
  getRedirectResult,
} from "firebase/auth";
import { firebaseApp, firebaseDb } from "../src/utils/firebase.config";
import normalizeEmail from "../src/utils/normalizeEmail";
import { share } from "../src/utils/share";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../src/Context/AuthContext";

export default function Message() {
  const router = useRouter();
  const [anonymousMsg, setAnonymousMsg] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { user } = useAuth();
  const userid = router.query.userid as string;
  const toast = useToast();

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setAnonymousMsg(inputValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const collectionRef = collection(firebaseDb, "anonymous-msgs");
    const q = await query(collectionRef, where("username", "==", userid));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast({
        title: "Anonymous user does not exist!",
        description:
          "There's no such user with this username. Shey you de whine me?",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const userEmail = querySnapshot?.docs[0]?.data()?.email;

    const newMessageRef = await addDoc(
      collection(firebaseDb, "anonymous-msgs", userEmail, "messages"),
      {
        message: anonymousMsg,
      }
    );

    toast({
      title: "Message sent!",
      description: "Your message has been sent successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const provider = new GoogleAuthProvider();

  const handleAuth = () => {
    if (isSignedIn) {
      share(`https://anon.vercel.app/${normalizeEmail(user?.email)}`);
    } else {
      const auth = getAuth(firebaseApp);
      signInWithRedirect(auth, provider);
    }
  };

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
            value={anonymousMsg}
            onChange={handleInputChange}
            placeholder="Write an anonymous message for me"
            size="sm"
          />
          <Button type="submit">Send</Button>
        </Box>

        <Box>
          <Heading>Thank you for sending that message</Heading>
          <Text>Now send yours</Text>

          <Button onClick={handleAuth}>
            Trigger the JavaScript share API or send the user to the Auth screen
          </Button>
        </Box>
      </Box>
    </div>
  );
}
