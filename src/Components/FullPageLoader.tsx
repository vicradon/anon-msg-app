import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { MutatingDots } from "react-loader-spinner";

interface Props {}

function FullPageLoader(props: Props) {
  const {} = props;

  return (
    <Box
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      zIndex={100}
      bg="white"
      display="flex"
      flexDir={"column"}
      alignItems="center"
      justifyContent="center"
      height={"100vh"}
    >
      <Text fontSize={"lg"}>Anon Msg App</Text>

      <MutatingDots
        height="100"
        width="100"
        color="#4fa94d"
        secondaryColor="#4fa94d"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </Box>
  );
}

export default FullPageLoader;
