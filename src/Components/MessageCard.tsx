import {
  border,
  Button,
  Flex,
  Grid,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaShare } from "react-icons/fa";
import { AnonymousMessage } from "utils/types";
import DeleteMessageModal from "Components/DeleteMessageModal";

interface Props {
  msg: AnonymousMessage;
}

function MessageCard(props: Props) {
  const { msg } = props;
  const {
    isOpen: deleteMsgIsOpen,
    onOpen: deleteMsgOnOpen,
    onClose: deleteMsgOnClose,
  } = useDisclosure();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [generatingImage, setGeneratingImage] = useState(false);

  const handleShareMsg = async () => {
    setGeneratingImage(true);
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
    setGeneratingImage(false);

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
    <>
      <Grid
        border={"1px solid #ccc"}
        padding={"1rem"}
        borderRadius={"md"}
        height={{ base: "350px", sm: "200px" }}
        width={"100%"}
        gridTemplateRows={"5fr 1fr"}
        justifySelf={"center"}
        position={"relative"}
      >
        <Button
          _hover={{
            background: "gray.900",
            boxShadow: "0 0 0 1px rgba(255, 255, 255, 1)",
            border: "1px solid transparent",
          }}
          _active={{
            background: "gray.900",
          }}
          _focus={{
            boxShadow: "unset",
          }}
          position={"absolute"}
          border={"1px solid #ccc"}
          w={"30px"}
          h={"30px"}
          title="Delete"
          minW={"0"}
          top={"-15px"}
          right={"-10px"}
          zIndex={"docked"}
          bg={"gray.900"}
          borderRadius={"full"}
          px={"0"}
          onClick={() => deleteMsgOnOpen()}
          color="white"
        >
          &times;
        </Button>

        <Text>{msg.message}</Text>

        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text textAlign={"right"} fontSize={"sm"}>
            {msg.created_at &&
              new Date(msg?.created_at?.seconds * 1000).toLocaleDateString()}
          </Text>

          <Button
            isLoading={generatingImage}
            onClick={() => handleShareMsg()}
            color={"gray"}
            size={"sm"}
          >
            <Flex alignItems={"center"} columnGap={"5px"}>
              <FaShare />
              <Text>Share</Text>
            </Flex>
          </Button>
        </Flex>
      </Grid>
      <DeleteMessageModal
        isOpen={deleteMsgIsOpen}
        onClose={deleteMsgOnClose}
        id={msg.id}
      />
    </>
  );
}

export default MessageCard;
