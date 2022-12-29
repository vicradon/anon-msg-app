import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  useDisclosure,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useAuth } from "Context/AuthContext";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaEnvelope, FaGoogle } from "react-icons/fa";
import errorCodesMap from "utils/errorCodes";

interface Props {
  isNewUser?: boolean;
}

function Authenticator(props: Props) {
  const { isNewUser = false } = props;
  const router = useRouter();

  const { isSignedIn } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formState, setFormState] = useState({
    isNewUser: isNewUser,
    email: "",
    password: "",
    showPassword: false,
    isSubmitting: false,
    showForgotPassword: false,
  });
  const googleProvider = new GoogleAuthProvider();
  const toast = useToast();

  const handleLogin = () => {
    if (!isSignedIn) {
      const auth = getAuth();
      signInWithRedirect(auth, googleProvider);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    setFormState({ ...formState, isSubmitting: true });

    try {
      if (formState.isNewUser) {
        await createUserWithEmailAndPassword(
          auth,
          formState.email,
          formState.password
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          formState.email,
          formState.password
        );
        router.push("/");
      }
    } catch (error) {
      setFormState({ ...formState, isSubmitting: false });

      toast({
        title: "Error",
        description: errorCodesMap[error.code],
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    setFormState({ ...formState, isSubmitting: true });

    try {
      await sendPasswordResetEmail(auth, formState.email);
      toast({
        title: "Email sent",
        description: "Check your inbox for a password reset link",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: errorCodesMap[error.code],
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setFormState({ ...formState, isSubmitting: false });
    }
  };

  const showModalHeading = () => {
    if (formState.isNewUser && !formState.showForgotPassword) {
      return "Create account";
    } else if (formState.showForgotPassword) {
      return "Reset password";
    } else {
      return "Login";
    }
  };

  return (
    <>
      <Grid rowGap={3}>
        <Button leftIcon={<FaGoogle />} onClick={handleLogin}>
          Sign in with Google
        </Button>

        <Button leftIcon={<FaEnvelope />} onClick={onOpen}>
          Sign in Email
        </Button>
      </Grid>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent paddingBottom={"2rem"}>
          <ModalHeader>{showModalHeading()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!formState.showForgotPassword && (
              <Flex
                onSubmit={handleEmailAuth}
                flexDirection={"column"}
                rowGap={"1rem"}
                as="form"
              >
                <FormControl>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    placeholder="e.g. john.doe@gmail.com"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState((prevFormState) => ({
                        ...prevFormState,
                        email: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Password</FormLabel>

                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={formState.showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={formState.password}
                      onChange={(e) =>
                        setFormState((prevFormState) => ({
                          ...prevFormState,
                          password: e.target.value,
                        }))
                      }
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() =>
                          setFormState((prevFormState) => ({
                            ...prevFormState,
                            showPassword: !prevFormState.showPassword,
                          }))
                        }
                      >
                        {formState.showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  isLoading={formState.isSubmitting}
                  loadingText={"Submitting"}
                  type="submit"
                >
                  Submit
                </Button>
              </Flex>
            )}

            {formState.showForgotPassword && (
              <Flex
                onSubmit={handleForgotPassword}
                flexDirection={"column"}
                rowGap={"1rem"}
                as="form"
              >
                <FormControl>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    placeholder="e.g. john.doe@gmail.com"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState((prevFormState) => ({
                        ...prevFormState,
                        email: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <Button
                  isLoading={formState.isSubmitting}
                  loadingText={"Submitting"}
                  type="submit"
                >
                  Submit
                </Button>
              </Flex>
            )}

            <Flex
              flexWrap={"wrap"}
              rowGap={"1rem"}
              justifyContent={"space-between"}
              mt={"1rem"}
            >
              <Button
                variant={"link"}
                onClick={() =>
                  setFormState((prevFormState) => ({
                    ...prevFormState,
                    showForgotPassword: !prevFormState.showForgotPassword,
                  }))
                }
              >
                {formState.showForgotPassword
                  ? "Back to login"
                  : "Forgot password"}
              </Button>
              <Button
                variant={"link"}
                onClick={() =>
                  setFormState((prevFormState) => ({
                    ...prevFormState,
                    isNewUser: !prevFormState.isNewUser,
                  }))
                }
              >
                {formState.isNewUser
                  ? "Do you have an existing account?"
                  : "No account?"}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Authenticator;
