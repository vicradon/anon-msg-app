import React, { useRef, useEffect, useState } from "react";
import { Heading, Box, useDisclosure, Grid } from "@chakra-ui/react";
import { useAuth } from "../src/Context/AuthContext";
import { firebaseDb } from "../src/utils/firebase.config";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import FullPageLoader from "../src/Components/FullPageLoader";
import Meta from "../src/Layout/Meta";
import MessageCard from "../src/Components/MessageCard";
import UnauthenticatedLandingView from "Components/UnauthenticatedLandingView";
import ChooseUsernameModal from "Components/ChooseUsernameModal";
import NoMessagesView from "Components/NoMessagesView";
import Header from "Components/Header";
import { createRef } from "react";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isSignedIn, user, username, setUsername, loading } = useAuth();
  const [anonymousMsgs, setAnonymousMsgs] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (user?.email) {
        const messagesRef = collection(
          firebaseDb,
          "anonymous-msgs",
          user?.email,
          "messages"
        );

        const q = query(messagesRef, orderBy("created_at", "desc"));
        const docSnap = await getDocs(q);

        const messages = docSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const decryptedResponse = await fetch("/api/crypto/decrypt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            msgs: messages,
          }),
        });

        const decryptedMsgs = await decryptedResponse.json();
        setAnonymousMsgs(decryptedMsgs.messages);
      }
    };
    fetchMessages();
  }, [username, user?.email]);

  const refs = useRef([]);

  return (
    <Box overflowY={loading ? "hidden" : "visible"}>
      <Meta />

      {loading && <FullPageLoader />}

      <Box>
        {isSignedIn && (
          <Box padding={{ base: "2rem", lg: "2rem 5rem" }}>
            <Header onOpen={onOpen} />

            <Box paddingBottom={"70px"}>
              <Heading as="h2" fontWeight={"medium"} size="md" mb={"2rem"}>
                Your messages
              </Heading>

              {anonymousMsgs.length === 0 && !loading && <NoMessagesView />}

              <Grid
                gridTemplateColumns={{
                  base: "1fr",
                  lg: "1fr 1fr",
                }}
                columnGap={"2rem"}
                rowGap={"2rem"}
              >
                {anonymousMsgs.map((msg) => {
                  const ref = createRef();
                  refs.current.push(ref);
                  return <MessageCard key={msg.id} msg={msg} innerRef={ref} />;
                })}
              </Grid>
            </Box>
          </Box>
        )}

        {!isSignedIn && <UnauthenticatedLandingView />}
      </Box>

      <ChooseUsernameModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
