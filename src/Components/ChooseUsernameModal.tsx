import {
  FormControl,
  Input,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { firebaseDb } from "utils/firebase.config";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "Context/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function ChooseUsernameModal(props: Props) {
  const { isOpen, onClose } = props;
  const [usernameInput, setUsernameInput] = useState("");
  const toast = useToast();
  const { user, setUsername } = useAuth();

  const handleChooseUsername = async (event) => {
    event.preventDefault();

    const anonymousMsgsRef = collection(firebaseDb, "anonymous-msgs");
    const q = await query(
      anonymousMsgsRef,
      where("username", "==", usernameInput)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      toast({
        title: "Username already exists!",
        description: "This username has already been taken by another user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      await setDoc(doc(firebaseDb, "anonymous-msgs", user.email), {
        email: user.email,
        username: usernameInput,
      });

      toast({
        title: "Username set successfully!",
        description: "You can now share your link with your friends",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setUsername(usernameInput);
      onClose();
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent paddingBottom={"2rem"}>
        <ModalHeader>Create your username</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            onSubmit={handleChooseUsername}
            alignItems={"flex-end"}
            columnGap={"10px"}
            as="form"
          >
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                required
                value={usernameInput}
                onChange={({ target }) =>
                  setUsernameInput(target.value.trim().toLowerCase())
                }
                placeholder="Choose a username"
              />
            </FormControl>
            <Button type="submit">Choose</Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ChooseUsernameModal;
