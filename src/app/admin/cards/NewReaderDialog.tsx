"use client";

import { FetchURL } from "@/utils/path";
import { IReader } from "@/utils/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useImperativeHandle, useState } from "react";
import { Md5 } from "ts-md5";

export default function NewReaderDialog(props: any) {
  const [name, setName] = useState("");
  const [borrow, setBorrow] = useState(10);
  const [password,setPassword] = useState("");
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
  const createReader = () => {
    const md5 = Md5.hashStr(password);
    const reader: IReader = {
      id: 0,
      name: name,
      createtime: Date.now(),
      maxBorrow: borrow,
      curBorrow: [],
      isAdmin: false,
    };
    //TODO: create reader account, change password to md5 firstly
    fetch("/api/card/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({reader,md5}),
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
        <DialogTitle>注册读者证</DialogTitle>
        <DialogContent>
          <div className=" flex flex-col gap-4 justify-start ml-2 mt-2">
            <TextField
              id="outlined-basic"
              label="姓名"
              variant="outlined"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              type="number"
              id="outlined-basic"
              label="最大借阅量"
              variant="outlined"
              onChange={(e) => {
                setBorrow(parseInt(e.target.value));
              }}
            />
            
            {/* reset password */}
            <TextField
              id="outlined-basic"
              label="密码"
              variant="outlined"
              type="password"
              defaultValue="********"
              onChange={(e)=>{
                setPassword(e.target.value);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={createReader}>创建</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
