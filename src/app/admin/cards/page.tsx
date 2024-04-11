"use client";

import Loading from "@/app/components/Loading";
import MyTableFooter from "@/app/components/MyTableFooter";
import RemoveDialog from "@/app/components/RemoveDialog";
import Toast from "@/app/components/Toast";
import { IDType, IReader } from "@/utils/types";
import {
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ModifyReaderDialog from "./ModifyReaderDialog";
import NewReaderDialog from "./NewReaderDialog";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { FetchURL, dateTransfer } from "@/utils/path";
import { updatePage } from "../books/page";

function CardsPage() {
  const [readers, setReaders] = useState<IReader[]>([]);
  const [readersView, setReadersView] = useState<IReader[]>([]);
  const computeReaders = (from: number, to: number) => {
    setReadersView(readers.slice(from, to));
  };

  useEffect(() => {
    (loading.current as any).open();
    getReaders()
      .then(setReaders)
      .catch((e) => {
        console.error(e);
        toast.current.open("加载失败", "error");
      })
      .finally(() => {
        (loading.current as any).close();
      });
  }, []);

  const removeDialog = useRef();
  const loading: any = useRef();
  const toast: any = useRef();
  const modifyDialog = useRef();
  const newDialog = useRef();

  async function removeReader(id: IDType) {
    //TODO: remove reader by id. send request.
    fetch("/api/card/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        if (res.status === 200) {
          setReaders((old) => old.filter((val) => val.id !== id));
          toast.current.open("删除成功", "success");
        } else {
          throw "删除失败";
        }
      })
      .catch((e) => {
        console.error(e);
        toast.current.open("删除失败", "error");
      });
  }

  return (
    <div className="pt-10 w-full">
      <div className="pannelTitle">
        <div className="ml-10 text-xl">读者证管理</div>
      </div>
      <div className=" relative py-4 w-full h-fit flex flex-col justify-start items-center">
        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 650,
            }}
          >
            <TableHead>
              <TableRow>
                {["姓名", "建立时间", "当前借书","管理员", "操作"].map((item) => (
                  <TableCell key={item}>{item}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {readersView.map((val) => (
                <TableRow key={val.name}>
                  <TableCell>{val.name}</TableCell>
                  <TableCell>{dateTransfer(val.createtime)}</TableCell>
                  <TableCell>
                    <div className="flex flex-row flex-wrap gap-1 text-sm">
                    <div>{`${val.curBorrow.length}本:`}</div>
                    {val.curBorrow.map((borrow) => (
                      <div
                        className={
                          borrow.returnDate < Date.now() ? " text-red-500" : ""
                        }
                        key={borrow.borrowid}
                      >
                        《{borrow.book.title}》
                      </div>
                    ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {val.isAdmin?"是":"否"}
                  </TableCell>
                  <TableCell>
                    <ButtonGroup className=" h-6" variant="outlined">
                      <Button
                        onClick={() => (modifyDialog.current as any).open(val)}
                        
                      >
                        修改
                      </Button>
                      <Button
                        color="error"
                        onClick={() =>
                          (removeDialog.current as any).open(
                            `确定删除${val.name} 的读者证吗？`,
                            () => removeReader(val.id)
                          )
                        }
                      >
                        删除
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <MyTableFooter
              count={readers.length}
              onChangeTableView={computeReaders}
            />
          </Table>
        </TableContainer>

        {/* create reader here */}
        <div onClick={() => (newDialog.current as any).open()}>
          <Paper className=" mt-2 flex-col flex items-center py-2 px-4 gap-2 cursor-pointer">
            <AddCircleIcon color="info" />
            <div>注册读者证</div>
          </Paper>
        </div>
      </div>
      <ModifyReaderDialog
        admin={true}
        onRef={modifyDialog}
        toast={toast}
        refresh={updatePage}
      />
      <NewReaderDialog onRef={newDialog} toast={toast} refresh={updatePage} />
      <RemoveDialog onRef={removeDialog} toast={toast} />
      {/* loading mask */}
      <Loading onRef={loading} />
      <Toast onRef={toast} />
    </div>
  );
}

export default CardsPage;

async function getReaders(): Promise<IReader[]> {
  //TODO:get all readers from server
  return fetch(FetchURL + "/api/card")
    .then((res) => res.json())
    .then((res) => {
      return res.data;
    });
}
