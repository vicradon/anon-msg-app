import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Heading,
  Box,
  Textarea,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getAuth,
  getRedirectResult,
} from "firebase/auth";
import NextLink from "next/link";
import { firebaseDb } from "../src/utils/firebase.config";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../src/Context/AuthContext";
import copyToClipboard from "../src/utils/copyToClipboard";
import Meta from "../src/Layout/Meta";
import Footer from "../src/Components/Footer";
import ToggleThemeButton from "../src/Components/ToggleThemeButton";
import Authenticator from "Components/Authenticator";

export default function Message() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [anonymousMsg, setAnonymousMsg] = useState("");
  const { isSignedIn, user, username } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userid = router.query.userid as string;
  const toast = useToast();

  const MAX_CHARACTER_COUNT = 250;

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= MAX_CHARACTER_COUNT) {
      setAnonymousMsg(inputValue);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (anonymousMsg.trim().length === 0) {
      toast({
        title: "Empty message!",
        description: "Please enter a message",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsSubmitting(false);
      return;
    } else if (anonymousMsg.trim().length > MAX_CHARACTER_COUNT) {
      toast({
        title: "Message too long!",
        description: "Please enter a message less than 250 characters",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsSubmitting(false);
      return;
    }

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

    const encryptedResponse = await fetch("/api/crypto/encrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        msg: anonymousMsg,
      }),
    });

    const encryptedMsg = await encryptedResponse.json();

    await addDoc(
      collection(firebaseDb, "anonymous-msgs", userEmail, "messages"),
      {
        message: encryptedMsg.msg,
        iv: encryptedMsg.iv,
        created_at: new Date(),
      }
    );

    setIsSubmitting(false);

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
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, [username, toast]);

  return (
    <div>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"2rem"}
      >
        <Heading fontWeight={"medium"} size={"md"} mb="0.5rem" as={"h1"}>
          <NextLink href={"/"}>Anon Msg</NextLink>
        </Heading>

        <ToggleThemeButton />
      </Flex>

      <Meta
        title={`Send me an anonymous message`}
        description={`Trust me I won't know you sent me this message. Confess your thoughts and feelings`}
        image={user?.photoURL}
        imageAlt={`${username} google profile picture`}
        canonical={`https://anon-msg-app/vercel.app/${username}`}
      />

      <Flex
        flexDirection={"column"}
        width={"100%"}
        maxW={"450px"}
        padding={"2rem"}
        margin={"0 auto"}
      >
        <Heading fontWeight={"medium"} size={"md"} mb="0.5rem" as={"h1"}>
          Send
          <Box px={"5px"} as="span" color="blue.500">
            {userid}
          </Box>
          an anonymous message
        </Heading>

        <Box as="form" onSubmit={handleSubmit}>
          <Textarea
            maxLength={250}
            display={"block"}
            value={anonymousMsg}
            onChange={handleInputChange}
            placeholder={`Write an anonymous message for ${userid}`}
            height={"200px"}
            mb={"1rem"}
          />
          <Flex justifyContent="space-between">
            <Text>
              <Box as="span">{anonymousMsg.length}</Box>/{MAX_CHARACTER_COUNT}{" "}
              characters
            </Text>
            <Button
              colorScheme={"blue"}
              bg={"#0D67FF"}
              width={"100px"}
              type="submit"
              isLoading={isSubmitting}
              loadingText="Sending"
            >
              Send
            </Button>
          </Flex>
        </Box>
      </Flex>

      <Footer />

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent paddingBottom={"2rem"}>
          <ModalHeader>{userid} has received your message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={"1.5rem"}>Now create your account</Text>
            <Authenticator isNewUser />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
