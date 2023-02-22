import { Button, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BsMoon, BsSun } from "react-icons/bs";

interface Props {}

function ToggleThemeButton(props: Props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const color = useColorModeValue('white', 'red')
  const {} = props;

  return (
    <Button
      leftIcon={colorMode === "light" ? <BsMoon /> : <BsSun />}
      aria-label="night mode switch"
      onClick={toggleColorMode}
    >
      {colorMode === "light" ? "Dark" : "Light"}
    </Button>
  );
}

export default ToggleThemeButton;
