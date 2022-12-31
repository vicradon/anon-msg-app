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
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { deleteDoc, collection, query, doc } from "firebase/firestore";
import { firebaseDb as db } from "../utils/firebase.config";
import { useAuth } from "Context/AuthContext";
import errorCodesMap from "utils/errorCodes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

const DeleteModal = (props: Props) => {
  const { isOpen, onClose, id } = props;
  const { user, setDeleted } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const toast = useToast();

  const closeMsgModal = () => {
    setDeleteLoading(false);
    onClose();
  };

  const handleDeleteMsg = (
    e: React.MouseEvent<HTMLElement>,
    currId: string
  ) => {
    e.preventDefault();

    setDeleteLoading((prev) => !prev);

    const collectionRef = collection(
      db,
      "anonymous-msgs",
      user?.email,
      "messages"
    );

    const docRef = doc(db, collectionRef.path, currId);

    deleteDoc(docRef)
      .then(() => {
        setDeleteLoading(false);
        toast({
          title: "Message deleted!",
          description: "Your message has been deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        setDeleted(true);
      })
      .catch(() => {
        setDeleteLoading(false);
        toast({
          title: "Error",
          description: "oops, something went wrong!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
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
