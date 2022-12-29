import { Box, Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { firebaseApp } from "utils/firebase.config";
import LogoutButton from "./LogoutButton";
import ToggleThemeButton from "./ToggleThemeButton";

interface Props {}

function VerifyEmailView(props: Props) {
  const {} = props;
  const toast = useToast();
  const auth = getAuth(firebaseApp);

  const handleVerifyEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      toast({
        title: "Verification email sent",
        status: "success",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box padding={"2rem"} height={"100vh"}>
      <Flex columnGap={"1rem"} justifyContent={"flex-end"}>
        <ToggleThemeButton />
        <LogoutButton />
      </Flex>

      <Flex
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Flex
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          mb={"1rem"}
        >
          <Heading fontWeight={"medium"} size={"lg"} mb="0.5rem" as={"h1"}>
            Thank you for signing up!
          </Heading>
          <Text>You will need to verify your email before proceeding.</Text>
        </Flex>

        <Button onClick={handleVerifyEmail}>Verify Email</Button>
      </Flex>
    </Box>
  );
}

export default VerifyEmailView;
