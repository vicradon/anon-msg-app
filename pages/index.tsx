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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../src/Context/AuthContext";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { firebaseApp, firebaseDb } from "../src/utils/firebase.config";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import copyToClipboard from "../src/utils/copyToClipboard";
import FullPageLoader from "../src/Components/FullPageLoader";
import Meta from "../src/Layout/Meta";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isSignedIn, user, username, setUsername, loading } = useAuth();
  const provider = new GoogleAuthProvider();
  const [usernameInput, setUsernameInput] = useState("");
  const [anonymousMsgs, setAnonymousMsgs] = useState([]);
  const toast = useToast();

  const handleLogin = () => {
    if (!isSignedIn) {
      const auth = getAuth();
      signInWithRedirect(auth, provider);
    }
  };

  const shareLink = async () => {
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
  };

  const handleChooseUsername = async (event) => {
    event.preventDefault();

    const anonymousMsgsRef = collection(firebaseDb, "anonymous-msgs");
    const q = await query(
      anonymousMsgsRef,
      where("username", "==", usernameInput)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      toast({
        title: "Username already exists!",
        description: "This username has already been taken by another user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      await setDoc(doc(firebaseDb, "anonymous-msgs", user.email), {
        email: user.email,
        username: usernameInput,
      });

      toast({
        title: "Username set successfully!",
        description: "You can now share your link with your friends",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setUsername(usernameInput);
      onClose();
    }
  };

  const logout = async () => {
    const auth = getAuth(firebaseApp);
    await auth.signOut();
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (user?.email) {
        const messageRef = collection(
          firebaseDb,
          "anonymous-msgs",
          user?.email,
          "messages"
        );

        const docSnap = await getDocs(messageRef);

        setAnonymousMsgs(
          docSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    };
    fetchMessages();
  }, [username, user?.email]);

  return (
    <Box overflowY={loading ? "hidden" : "visible"}>
      <Meta />

      {loading && <FullPageLoader />}

      <Box>
        {isSignedIn && (
          <Box>
            <Flex justifyContent={"space-between"} alignItems={"center"}>
              <Heading>Hi {user?.displayName}</Heading>
              <Button onClick={logout}>Logout</Button>
            </Flex>

            {!username ? (
              <Button onClick={onOpen}>Create your username</Button>
            ) : (
              <Box>
                <Button onClick={shareLink}>Share your link</Button>
              </Box>
            )}

            <Box>
              <Heading as="h2" size="md">
                Your messages
              </Heading>

              {anonymousMsgs.length === 0 && (
                <Text textAlign={"center"} fontSize={"sm"}>
                  No messages yet
                </Text>
              )}

              {anonymousMsgs.map((msg) => (
                <Box key={msg.id}>
                  <Text>{msg.message}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {!isSignedIn && (
          <Box>
            <Heading>Anonymous Message App</Heading>

            <Button leftIcon={<FaGoogle />} onClick={handleLogin}>
              Sign in with Google
            </Button>
          </Box>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent paddingBottom={"2rem"}>
          <ModalHeader>Create your username</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              onSubmit={handleChooseUsername}
              alignItems={"flex-end"}
              columnGap={"10px"}
              as="form"
            >
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  required
                  value={usernameInput}
                  onChange={({ target }) => setUsernameInput(target.value)}
                  placeholder="Choose a username"
                />
              </FormControl>
              <Button type="submit">Choose</Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
