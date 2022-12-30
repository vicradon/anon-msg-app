import {
  Button,
  Flex,
  Grid,
  Text,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { FaShare } from "react-icons/fa";
import { AnonymousMessage } from "utils/types";

interface Props {
  msg: AnonymousMessage;
}

function MessageCard(props: Props) {
  const { msg } = props;
  const toast = useToast();
  const { colorMode } = useColorMode();

  const handleShareMsg = async () => {
    const generatedImageResponse = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: msg.message,
        theme: colorMode,
      }),
    });

    const generatedImageBlob = await generatedImageResponse.blob();

    try {
      const imageFile = new File(
        [generatedImageBlob],
        "anonymous-message.png",
        {
          type: generatedImageBlob.type,
        }
      );

      if (navigator.share) {
        await navigator.share({
          title: "Anonymous Message",
          text: "Check out this anonymous message I received",
          files: [imageFile],
        });
      } else if (navigator.clipboard) {
        navigator.clipboard.write([
          new ClipboardItem({ "image/png": generatedImageBlob }),
        ]);
        toast({
          title: "Image copied to clipboard!",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Your browser does not support sharing or copying images",
          status: "error",
          duration: 1000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("oops, something went wrong!", error);
    }
  };

  return (
    <Grid
      border={"1px solid #ccc"}
      padding={"1rem"}
      borderRadius={"md"}
      height={"200px"}
      width={"100%"}
      gridTemplateRows={"5fr 1fr"}
      justifySelf={"center"}
    >
      <Text>{msg.message}</Text>

      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text textAlign={"right"} fontSize={"sm"}>
          {msg.created_at &&
            new Date(msg?.created_at?.seconds * 1000).toLocaleDateString()}
        </Text>

        <Button onClick={() => handleShareMsg()} color={"gray"} size={"sm"}>
          <Flex alignItems={"center"} columnGap={"5px"}>
            <FaShare />
            <Text>Share</Text>
          </Flex>
        </Button>
      </Flex>
    </Grid>
  );
}

export default MessageCard;
