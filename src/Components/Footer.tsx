import { Link, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface Props {}

function Footer(props: Props) {
  const {} = props;

  return (
    <Flex
      position={"fixed"}
      bottom={"-10px"}
      justifyContent={"center"}
      alignItems={"center"}
      mb="2rem"
      top={{ base: "96%", lg: "96%" }}
      left={{ base: "50%", lg: "50%" }}
      transform={{ base: "translate(-50%, -50%)", lg: "translate(-50%, -50%)" }}
      flexDirection={"column"}
      fontSize={{ base: "xs", lg: "sm" }}
      zIndex={100}
      width={"100vw"}
      height={"70px"}
    >
      <Text>
        © {new Date().getFullYear()} AnonMsg - Send risky texts to friends
        anonymously
      </Text>
      <Flex justifyContent={"center"} flexWrap={"wrap"}>
        <Text pr={"3px"}>Built by </Text>
        <Link color={"green.400"} pr={"3px"} href="https://osinachi.me">
          Osi,
        </Link>{" "}
        <Text pr={"3px"}>designed by </Text>
        <Link
          color={"green.400"}
          pr={"3px"}
          href="https://www.behance.net/jonathanadah01"
        >
          Jonathan
        </Link>{" "}
      </Flex>
    </Flex>
  );
}

export default Footer;
