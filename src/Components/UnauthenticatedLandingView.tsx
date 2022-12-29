import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "Context/AuthContext";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import React from "react";
import { FaGoogle } from "react-icons/fa";
import ToggleThemeButton from "./ToggleThemeButton";

interface Props {}

function UnauthenticatedLandingView(props: Props) {
  const {} = props;

  const { isSignedIn } = useAuth();
  const provider = new GoogleAuthProvider();

  const handleLogin = () => {
    if (!isSignedIn) {
      const auth = getAuth();
      signInWithRedirect(auth, provider);
    }
  };

  return (
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
  );
}

export default UnauthenticatedLandingView;
