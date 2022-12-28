import Head from "next/head";
import { useEffect, useState } from "react";
import {
  FormControl,
  Input,
  Button,
  Text,
  Flex,
  Heading,
  Box,
  Radio,
  RadioGroup,
  Textarea,
} from "@chakra-ui/react";

export default function Home() {
  const [value, setValue] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  return (
    <div>
      <Head>
        <title>Anonymous Messages App</title>
        <meta
          name="description"
          content="An app that allows you to send anonymous messages to friends"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Heading>Anonymous Message App</Heading>

        <Textarea
          value={value}
          onChange={handleInputChange}
          placeholder="Write an anonymous message for me"
          size="sm"
        />
      </Box>
    </div>
  );
}
