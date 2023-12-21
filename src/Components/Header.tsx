import {
  Button,
  Text,
  Flex,
  Heading,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import { useAuth } from "Context/AuthContext";
import { FaCopy, FaShare } from "react-icons/fa";
import copyToClipboard from "utils/copyToClipboard";
import LogoutButton from "./LogoutButton";
import ToggleThemeButton from "./ToggleThemeButton";

interface Props {
  onOpen: () => void;
}

function Header(props: Props) {
  const { onOpen } = props;
  const { user, username } = useAuth();
  const toast = useToast();

  const uniqueLink = `${window.location.href}${username}`;

  const handleCopyLink = (link) => {
    copyToClipboard(link);
    toast({
      title: "Link copied to clipboard!",
      status: "success",
      duration: 1000,
      isClosable: true,
    });
  };

  const shareLink = async () => {
    copyToClipboard(
      `Send me and anonymous message and I won't know\n${uniqueLink}`
    );

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
        url: uniqueLink,
      });
    }
  };

  return (
    <Flex
      mb={"3rem"}
      justifyContent={"space-between"}
      alignItems={"center"}
      flexWrap={"wrap"}
      rowGap={"1rem"}
    >
      <Flex flexDir={"column"}>
        <Flex
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
          <Heading fontWeight={"medium"} size={"lg"} as={"h1"}>
            Hi {user?.displayName}
          </Heading>
        </Flex>
        {username && (
          <Flex alignItems={"center"} columnGap={"1rem"}>
            <Button
              size={"xs"}
              paddingRight={"2px"}
              leftIcon={<FaCopy fontSize={"10px"} />}
              onClick={() => handleCopyLink(uniqueLink)}
            ></Button>

            <Text fontSize={{ base: "0.7rem", lg: "1rem" }}>{uniqueLink}</Text>
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
            <Text display={{ base: "none", lg: "block" }}>Share your link</Text>

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
        <LogoutButton />
      </Flex>
    </Flex>
  );
}

export default Header;
