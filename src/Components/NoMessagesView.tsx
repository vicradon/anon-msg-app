import { Flex, Text } from "@chakra-ui/react";
import React from "react";

interface Props {}

function NoMessagesView(props: Props) {
  const {} = props;

  return (
    <Flex height={"70vh"} justifyContent={"center"} alignItems={"center"}>
      <Text textAlign={"center"} fontSize={"sm"}>
        Oops! 😅 No one has sent you a message. Share your profile URL and check
        back later again!
      </Text>
    </Flex>
  );
}

export default NoMessagesView;
