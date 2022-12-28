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
  Grid,
  Avatar,
} from "@chakra-ui/react";
import { FaCopy, FaGoogle, FaShare } from "react-icons/fa";
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
import { CiLogout } from "react-icons/ci";
import ToggleThemeButton from "../src/Components/ToggleThemeButton";

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
          docSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    };
    fetchMessages();
  }, [username, user?.email]);

  const handleCopyLink = (link) => {
    copyToClipboard(link);
    toast({
      title: "Link copied to clipboard!",
      status: "success",
      duration: 1000,
      isClosable: true,
    });
  };

  return (
    <Box overflowY={loading ? "hidden" : "visible"}>
      <Meta />

      {loading && <FullPageLoader />}

      <Box>
        {isSignedIn && (
          <Box padding={{ base: "2rem", lg: "2rem 5rem" }}>
            <Flex
              mb={"3rem"}
              justifyContent={"space-between"}
              alignItems={"center"}
              flexWrap={"wrap"}
            >
              <Flex flexDir={"column"}>
                <Flex
                  justifyContent={"center"}
                  alignItems={"center"}
                  columnGap={"1rem"}
                  flexWrap={"wrap"}
                  mb={"1rem"}
                >
                  <Avatar
                    display={{ base: "none", lg: "block" }}
                    name={user.displayName}
                    src={user.photoURL}
                  />
                  <Heading
                    fontWeight={"medium"}
                    size={"lg"}
                    mb="0.5rem"
                    as={"h1"}
                  >
                    Hi {user?.displayName}
                  </Heading>
                </Flex>
                {username && (
                  <Flex alignItems={"center"} columnGap={"1rem"}>
                    <Button
                      size={"xs"}
                      paddingRight={"2px"}
                      leftIcon={<FaCopy fontSize={"10px"} />}
                      onClick={() =>
                        handleCopyLink(
                          `https://anon-msg-app.vercel.app/${username}`
                        )
                      }
                    ></Button>

                    <Text>https://anon-msg-app.vercel.app/{username}</Text>
                  </Flex>
                )}
              </Flex>

              <Flex flexWrap={"wrap"} rowGap={"1rem"} columnGap={"1rem"}>
                {!username ? (
                  <Button
                    bg={"#0D67FF"}
                    colorScheme={"blue"}
                    textColor={"white"}
                    onClick={onOpen}
                  >
                    Create your username
                  </Button>
                ) : (
                  <Button
                    bg={"#0D67FF"}
                    colorScheme={"blue"}
                    textColor={"white"}
                    onClick={shareLink}
                  >
                    <Text display={{ base: "none", lg: "block" }}>
                      Share your link
                    </Text>

                    <Flex
                      columnGap={"5px"}
                      alignItems={"center"}
                      display={{ base: "flex", lg: "none" }}
                    >
                      <Text>Share</Text>
                      <FaShare />
                    </Flex>
                  </Button>
                )}
                <ToggleThemeButton />
                <Button
                  leftIcon={<CiLogout />}
                  variant={"outline"}
                  onClick={logout}
                >
                  <Text display={{ base: "none", lg: "block" }}>Logout</Text>
                </Button>
              </Flex>
            </Flex>

            <Box paddingBottom={"70px"}>
              <Heading as="h2" fontWeight={"medium"} size="md" mb={"2rem"}>
                Your messages
              </Heading>

              {anonymousMsgs.length === 0 && (
                <Flex
                  height={"70vh"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Text textAlign={"center"} fontSize={"sm"}>
                    Oops! 😅 No one has sent you a message. Share your profile
                    URL and check back later again!
                  </Text>
                </Flex>
              )}

              <Grid
                gridTemplateColumns={{
                  base: "1fr",
                  lg: "1fr 1fr",
                }}
                columnGap={"2rem"}
                rowGap={"2rem"}
              >
                {anonymousMsgs.map((msg) => (
                  <Grid
                    border={"1px solid #ccc"}
                    padding={"1rem"}
                    borderRadius={"md"}
                    key={msg.id}
                    height={"200px"}
                    width={"100%"}
                    gridTemplateRows={"5fr 1fr"}
                    justifySelf={"center"}
                  >
                    <Text>{msg.message}</Text>

                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Text textAlign={"right"} fontSize={"sm"}>
                        {msg.created_at &&
                          new Date(
                            msg?.created_at?.seconds * 1000
                          ).toLocaleString()}
                      </Text>

                      <Button color={"gray"} leftIcon={<FaShare />} size={"sm"}>
                        Share
                      </Button>
                    </Flex>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}

        {!isSignedIn && (
          <Box>
            <Flex padding={"1rem"} justifyContent={"flex-end"}>
              <ToggleThemeButton />
            </Flex>
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              height={"80vh"}
              flexDirection={"column"}
            >
              <Heading fontWeight={"medium"} size={"lg"} mb="0.5rem" as={"h1"}>
                Welcome to Anon Msg
              </Heading>

              <Text mb={"1rem"}>Send risky texts to friends anonymously</Text>

              <Button leftIcon={<FaGoogle />} onClick={handleLogin}>
                Sign in with Google
              </Button>
            </Flex>
          </Box>
        )}
      </Box>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
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
