import { Button, Text } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import React from "react";
import { CiLogout } from "react-icons/ci";
import { firebaseApp } from "utils/firebase.config";

interface Props {}

function LogoutButton(props: Props) {
  const {} = props;

  const logout = async () => {
    const auth = getAuth(firebaseApp);
    await auth.signOut();
  };

  return (
    <Button leftIcon={<CiLogout />} variant={"outline"} onClick={logout}>
      <Text display={{ base: "none", lg: "block" }}>Logout</Text>
    </Button>
  );
}

export default LogoutButton;
