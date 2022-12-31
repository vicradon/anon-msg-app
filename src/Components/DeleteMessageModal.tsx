import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { doc, deleteDoc, collection, query } from "firebase/firestore";
import { firebaseDb as db } from "../utils/firebase.config";
import { useAuth } from "Context/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

const DeleteModal = (props: Props) => {
  const { isOpen, onClose, id } = props;
  const { isSignedIn, user, username, loading } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const handleDeleteMsg = async (
    e: React.MouseEvent<HTMLElement>,
    currId: string
  ) => {
    e.preventDefault();
    setDeleteLoading((prev) => !prev);

    const { id: msgId } = collection(
      db,
      "anonymous-msgs",
      user?.email,
      "messages"
    );

    const docRef = doc(db, msgId, currId);
    await deleteDoc(docRef)
      .then(() => {
        console.log("deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const closeMsgModal = () => {
    setDeleteLoading(false);
    onClose();
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent paddingBottom={"1rem"}>
        <ModalHeader>Delete Message</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to delete this message?</Text>
          <Flex
            mt={"4"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            gap={"4"}
          >
            <Button
              textTransform={"capitalize"}
              _hover={{
                boxShadow: `${deleteLoading ? "unset" : "0 0 0 3px red"}`,
              }}
              onClick={(e) => handleDeleteMsg(e, id)}
              type="submit"
              isLoading={deleteLoading}
              loadingText="Deleting"
              border={`${
                deleteLoading ? "3px solid red" : "0px solid transparent"
              }`}
            >
              yes
            </Button>
            <Button
              textTransform={"capitalize"}
              onClick={() => closeMsgModal()}
            >
              no
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
