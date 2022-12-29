import { Button, Flex, Grid, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { FaShare } from "react-icons/fa";
import { AnonymousMessage } from "utils/types";
import { toPng } from "html-to-image";

interface Props {
  innerRef?: any;
  msg: AnonymousMessage;
}

function MessageCard(props: Props) {
  const { innerRef, msg } = props;
  const toast = useToast();

  const handleShareMsg = async (theRef) => {
    const footerSection = theRef.current.lastChild;
    const lastChild = footerSection.lastChild;
    footerSection.removeChild(footerSection.lastChild);

    try {
      const base64Text = await toPng(theRef.current);
      footerSection.appendChild(lastChild);

      const blob = await fetch(base64Text).then((res) => res.blob());
      const imageFile = new File([blob], "anonymous-message.png", {
        type: blob.type,
      });

      if (navigator.share) {
        await navigator.share({
          title: "Anonymous Message",
          text: "Check out this anonymous message I received",
          files: [imageFile],
        });
      } else if (navigator.clipboard) {
        navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
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
      ref={innerRef}
    >
      <Text>{msg.message}</Text>

      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text textAlign={"right"} fontSize={"sm"}>
          {msg.created_at &&
            new Date(msg?.created_at?.seconds * 1000).toLocaleString()}
        </Text>

        <Button
          onClick={() => handleShareMsg(innerRef)}
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
  );
}

export default MessageCard;
