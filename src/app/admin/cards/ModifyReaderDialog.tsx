"use client";

import { padID } from "@/utils/path";
import { IReader, IDType } from "@/utils/types";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useImperativeHandle, useState } from "react";
import { Md5 } from "ts-md5";

export default function ModifyReaderDialog(props: any) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [reader, setReader] = useState<IReader>({
    id: 0,
    name: "",
    createtime: 0,
    maxBorrow: 10,
    curBorrow: [],
    isAdmin: false,
  });

  useImperativeHandle(props.onRef, () => {
    // 需要将暴露的接口返回出去
    return {
      open: (bindReader: IReader) => {
        setReader(bindReader);
        setOpen(true);
      },
    };
  });

  const handleClose = () => {
    setOpen(false);
  };

  const modifyReader = () => {
    //TODO: send request to modify reader
    //change password to md5 firstly
    let pw = "";
    if (password.length > 0) {
      pw = Md5.hashStr(password);
    }

    fetch("/api/card/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reader: {
          id: reader.id,
          name: reader.name,
          maxBorrow: reader.maxBorrow,
          isAdmin: reader.isAdmin,
        },
        md5: pw,
      }),
    })
      .then((res) => {
        if (res.status !== 200)
          return Promise.reject("change fail in database");
        //toast success
        props.toast.current.open("读者证新建成功", "success");
        handleClose();
        props.refresh();
      })
      .catch((err) => {
        props.toast.current.open("新建失败", "error");
        console.error(err);
      });
  };
  return (
    <>
      <Dialog fullWidth={true} open={open} onClose={handleClose}>
        <DialogTitle>读者证号：{padID(reader.id)}</DialogTitle>
        <DialogContent>
          <div className=" flex flex-col gap-4 justify-start ml-2 mt-2">
            <TextField
              id="outlined-basic"
              label="姓名"
              variant="outlined"
              defaultValue={reader.name}
              onChange={(e) => {
                setReader((old) => ({ ...old, name: e.target.value }));
              }}
            />
            {/* reset password */}
            <TextField
              id="outlined-basic"
              label="重置密码(不重置请留空)"
              variant="outlined"
              type="password"
              placeholder="********"
              defaultValue=""
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            {/* admin only */}
            {props.admin ? (
              <>
                <TextField
                  id="outlined-basic"
                  label="最大可借书量"
                  variant="outlined"
                  type="number"
                  defaultValue={reader.maxBorrow}
                  onChange={(e) => {
                    setReader((old) => ({
                      ...old,
                      maxBorrow: parseInt(e.target.value),
                    }));
                  }}
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked={reader.isAdmin} onChange={(e,checked)=>{
                    setReader((old)=>{
                      old.isAdmin = checked;
                      return old;
                    })
                  }}/>}
                  label="任命为管理员"
                />
              </>
            ) : (
              ""
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={modifyReader}>修改</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
