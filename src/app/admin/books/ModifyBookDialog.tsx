"use client";

import { FetchURL, padID, validateBook } from "@/utils/path";
import { IBook, IDType } from "@/utils/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useImperativeHandle, useState } from "react";

export default function ModifyBookDialog(props: any) {
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState<IBook>({
    bookid: 0,
    title: "",
    author: "",
    borrowed: false,
  });

  useImperativeHandle(props.onRef, () => {
    // 需要将暴露的接口返回出去
    return {
      open: (bindBook: IBook) => {
        setBook(bindBook);
        setOpen(true);
      },
    };
  });

  const handleClose = () => {
    setOpen(false);
  };

  const modifyBook = () => {
    if (!validateBook(book.title, book.author)) {
      props.toast.current?.open("书名和作者不能为空或重名", "error");
      return;
    }
    //TODO: send request to modify book
    fetch(FetchURL + "/api/book/create", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    })
      .then((res) => {
        if (res.ok) {
          props.toast.current?.open("修改成功", "success");
          setOpen(false);
          props.refresh();
        } else throw "unknown error";
      })
      .catch((e) => {
        props.toast.current?.open("修改失败", "error");
      });
  };
  return (
    <>
      <Dialog fullWidth={true} open={open} onClose={handleClose}>
        <DialogTitle>修改图书：{padID(book.bookid)}</DialogTitle>
        <DialogContent>
          <div className=" flex flex-col gap-4 justify-start ml-2 mt-2">
            <TextField
              id="outlined-basic"
              label="书名"
              variant="outlined"
              defaultValue={book.title}
              onChange={(e) => {
                setBook((old) => ({ ...old, title: e.target.value }));
              }}
            />
            <TextField
              id="outlined-basic"
              label="作者"
              variant="outlined"
              defaultValue={book.author}
              onChange={(e) => {
                setBook((old) => ({ ...old, author: e.target.value }));
              }}
            />
            <RadioGroup name="radio-buttons-group"
            value={book.borrowed?"true":"false"}
            onChange={(e,v)=>{
              setBook((old)=>({...old,borrowed:v==="true"}));
            }}>
              <FormControlLabel value="true" control={<Radio />} label="借出" />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="在库"
              />
            </RadioGroup>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={modifyBook}>修改</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
