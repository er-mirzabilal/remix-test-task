import * as React from "react";
import type { MetaFunction } from "remix";
import { Menu, MenuItem, TextField } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export const meta: MetaFunction = () => {
  return {
    title: "Task",
  };
};

export default function Index() {
  const [value, setValue] = useState("");

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [options] = useState([
    { key: "W", label: "This is option 1" },
    { key: "E", label: "This is option 2" },
    { key: "R", label: "This is option 3" },
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSlash, setShowSlash] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mousePosition, setMousePosition] = useState<{
    mouseX: number;
    mouseY: number;
  }>({ mouseX: 0, mouseY: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ mouseX: event.clientX, mouseY: event.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "/") {
        setContextMenu(mousePosition);
        setShowSlash(true);
      } else if (event.key === "Escape") {
        setContextMenu(null);
        setShowSlash(true);
      } else if (event.key === "ArrowDown") {
        setSelectedIndex((prevIndex) =>
          prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (event.key === "ArrowUp") {
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      } else if (
        contextMenu !== null &&
        ["w", "e", "r"].includes(event.key.toLowerCase())
      ) {
        const index = options.findIndex(
          (option) => option.key.toLowerCase() === event.key.toLowerCase()
        );
        if (index !== -1) {
          handleOptionSelect(index);
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [contextMenu, options, mousePosition]);

  const handleClose = () => {
    setContextMenu(null);
    setShowSlash(false);
  };

  const handleOptionSelect = (index: number) => {
    const selectedOption = options[index];
    const selectionStart = textareaRef.current?.selectionStart;
    const selectionEnd = textareaRef.current?.selectionEnd;
    const insertText = `${selectedOption.label}`;

    if (selectionStart !== undefined && selectionEnd !== undefined) {
      const newValue =
        value.substring(0, selectionStart) +
        insertText +
        value.substring(selectionEnd, value.length);

      setValue(newValue);
    }

    handleClose();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      textareaRef.current &&
      !textareaRef.current.contains(event.target as Node)
    ) {
      setContextMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <React.Fragment>
      <>
        <TextField
          label="Enter text"
          inputRef={textareaRef}
          value={showSlash ? value + "/" : value}
          variant="outlined"
          color="primary"
          multiline
          rows={5}
          onChange={({ target }) => setValue(target.value)}
          fullWidth
          sx={{
            backgroundColor: "#FFFFFF",
            color: "#008080",
            fontFamily: "Calibri",
            "& .MuiInputBase-root": {
              "&:hover": {
                backgroundColor: "#E0FFFF",
              },
            },
          }}
        />
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
          PaperProps={{
            sx: {
              backgroundColor: "#E0FFFF",
              border: "none",
              width: "200px",
              boxShadow: "none",
            },
          }}
        >
          {options.map((option, index) => (
            <MenuItem
              sx={{
                backgroundColor: "#E0FFFF",
                color: "#008080",
                fontFamily: "Calibri",
                marginTop: 1,
                "&:hover": {
                  backgroundColor: "#7FFFD4",
                  color: "#FFFFFF",
                },
              }}
              key={option.key}
              selected={index === selectedIndex}
              onClick={() => handleOptionSelect(index)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </>
    </React.Fragment>
  );
}
