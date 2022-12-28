import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
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
import copyToClipboard from "../src/utils/copyToClipboard";

export default function Message() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [anonymousMsg, setAnonymousMsg] = useState("");
  const { isSignedIn, user, username } = useAuth();
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

    if (!isSignedIn) {
      onOpen();
    } else {
      toast({
        title: "Message sent!",
        description: "Your message has been sent successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }

    setAnonymousMsg("");
  };

  const provider = new GoogleAuthProvider();

  const handleLinkShare = useCallback(async () => {
    const url = `https://anon-msg-app.vercel.app/${username}`;

    copyToClipboard(`Send me and anonymous message and I won't know\n${url}`);

    toast({
      title: "Link copied to clipboard!",
      status: "success",
      duration: 1000,
      isClosable: true,
    });

    if (navigator.share) {
      await navigator.share({
        title: "Send me an anonymous message",
        text: "Send an anonymous message 😉 to me and I won't know. 🙈",
        url,
      });
    }
  }, [username, toast]);

  const handleAuth = async () => {
    if (isSignedIn) {
      await handleLinkShare();
    } else {
      const auth = getAuth();
      signInWithRedirect(auth, provider);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          window.location.href = "/";
        }
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
  }, [username]);

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
            border={"3px solid #333"}
            value={anonymousMsg}
            onChange={handleInputChange}
            placeholder="Write an anonymous message for me"
            size="sm"
          />
          <Button type="submit">Send</Button>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent paddingBottom={"2rem"}>
          <ModalHeader>Thank you for sending that message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Button onClick={handleAuth}>Now send yours</Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
