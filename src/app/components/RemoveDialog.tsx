"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useImperativeHandle, useState } from "react";

export default function RemoveDialog(props: any) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(""); //text to display
  const [callback, setCallback] = useState<()=>any>(); //callback function
  useImperativeHandle(props.onRef, () => {
    // 需要将暴露的接口返回出去
    return {
      open: (errText:string,sureCallback:()=>any) => {
        setText(errText);
        setCallback(()=>sureCallback);
        setOpen(true);
      },
    };
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog fullWidth={true} open={open} onClose={handleClose}>
        <DialogTitle>确定删除</DialogTitle>
        <DialogContent>
        <DialogContentText>
            {text}
        </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{
            if(callback)
                callback();
            handleClose();
          }} color="error">删除</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
