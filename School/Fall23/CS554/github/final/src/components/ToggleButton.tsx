import React, { useContext, useEffect } from "react";
import { ThemeContext} from "../context/ThemeContext";
import { Button } from "@material-tailwind/react";

export default function ToggleButton() {
  const { darkmode, toggleMode } = useContext(ThemeContext);
  useEffect(() => {
    if (darkmode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkmode]);
  return (
    <>
    <Button onClick={toggleMode}>
        {darkmode ? "Light Mode" : "Dark Mode"}
    </Button>
    </>
  );
}