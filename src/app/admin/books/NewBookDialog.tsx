"use client";

import { validateBook } from "@/utils/path";
import { IBook } from "@/utils/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useImperativeHandle, useState } from "react";

export default function NewBookDialog(props: any) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [open, setOpen] = useState(false);
  useImperativeHandle(props.onRef, () => {
    // 需要将暴露的接口返回出去
    return {
      open: () => setOpen(true),
    };
  });

  const handleClose = () => {
    setOpen(false);
  };

  const createBook = () => {
    if (!validateBook(title, author)) {
      props.toast.current?.open("书名和作者不能为空或重名", "error");
    }
    fetch("/api/book/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, author }),
    })
      .then((res) => {
        if (res.status === 200) {
          props.toast.current?.open(`创建成功`, "success");
          handleClose();
          props.refresh();
        } else throw "数据库编号错误";
      })
      .catch((e) => {
        props.toast.current?.open(`创建失败:${e}`, "error");
      });
  };
  return (
    <>
      <Dialog fullWidth={true} open={open} onClose={handleClose}>
        <DialogTitle>创建图书</DialogTitle>
        <DialogContent>
          <div className=" flex flex-col gap-4 justify-start ml-2 mt-2">
            <TextField
              id="outlined-basic"
              label="书名"
              variant="outlined"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <TextField
              id="outlined-basic"
              label="作者"
              variant="outlined"
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={createBook}>创建</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
