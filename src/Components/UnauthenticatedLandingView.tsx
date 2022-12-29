import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import ToggleThemeButton from "./ToggleThemeButton";
import Authenticator from "./Authenticator";

interface Props {}

function UnauthenticatedLandingView(props: Props) {
  const {} = props;

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

        <Authenticator />
      </Flex>
    </Box>
  );
}

export default UnauthenticatedLandingView;
