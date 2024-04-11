"use client";
import { Alert, Slide, Snackbar } from "@mui/material";
import { useImperativeHandle, useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";
export default function Toast(props: any) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ToastType>("success");
  const [text, setText] = useState("");
  useImperativeHandle(props.onRef, () => {
    return {
      open: (text: string, type: ToastType) => {
        setText(text);
        setType(type);
        setOpen(true);
      },
    };
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
      TransitionComponent={Slide}
       anchorOrigin={{vertical:"top",horizontal:"center"}}>
        <Alert
          severity={type}
          sx={{ width: "100%" }}
        >
          {text}
        </Alert>
      </Snackbar>
    </div>
  );
}
