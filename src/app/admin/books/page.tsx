"use client";
import { IBook, IDType } from "@/utils/types";
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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NewBookDialog from "./NewBookDialog";
import Toast from "@/app/components/Toast";
import Loading from "@/app/components/Loading";
import ModifyBookDialog from "./ModifyBookDialog";
import BookSearchBar, { getBooks } from "@/app/components/BookSearchBar";
import RemoveDialog from "@/app/components/RemoveDialog";
import { FetchURL } from "@/utils/path";
import MyTableFooter from "@/app/components/MyTableFooter";

function BooksPage() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [booksView, setBooksView] = useState<IBook[]>([]);

  const computeBooks = (from: number, to: number) => {
    setBooksView(books.slice(from, to));
  }

  // many, popup dialog.
  const modifyDialog = useRef();
  const dialog = useRef();
  const toast = useRef();
  const loading = useRef();
  const removeDialog = useRef();

  useEffect(() => {
    (loading.current as any).open();
    getBooks()
      .then(setBooks)
      .catch((e) => {
        console.error(e);
        (dialog.current as any).open("加载失败","error");
      })
      .finally(() => {
        (loading.current as any).close();
      });
  }, []);

  
    async function removeBook(bookid:IDType){
      return fetch("" + "/api/book/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookid }),
      }).then((res) => {
        if (res.status === 200) {
          (toast.current as any).open("删除成功", "success");
          updatePage();
        } else throw "数据库编号错误";
      }).catch((e) => {
        (toast.current as any).open(`删除失败:${e}`, "error");
      });
    }


  return (
    <div className="pt-10 w-full">
      <div className=" panelTitle ">
      <div className=" text-xl ml-10">书库管理</div>
      <BookSearchBar filterBooks={setBooks} />
      </div>
      {/* Add your content here */}
      <div className=" relative py-4 w-full h-fit flex flex-col justify-start items-center">
        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 660,
            }}
          >
            <TableHead>
              <TableRow>
                {["书名", "作者", "状态", "操作"].map((item) => (
                  <TableCell key={item}>{item}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {booksView.map((val) => (
                <TableRow key={val.bookid}>
                  <TableCell>{val.title}</TableCell>
                  <TableCell>{val.author}</TableCell>
                  <TableCell>
                    <div className={val.borrowed ? " text-rose-500" : ""}>
                      {val.borrowed ? "借出" : "在库"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ButtonGroup className=" h-6">
                      <Button
                        onClick={() => (modifyDialog.current as any).open(val)}
                      >
                        修改
                      </Button>
                      <Button color="error" onClick={()=>(removeDialog.current as any).open(
                        `确定删除书籍 ${val.title} 吗？`,
                        ()=>removeBook(val.bookid)
                      )}>
                        删除
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <MyTableFooter count={books.length} onChangeTableView={computeBooks}/>
          </Table>
        </TableContainer>

        <div onClick={() => (dialog.current as any).open()}>
          <Paper className=" mt-2 flex-col flex items-center py-2 px-4 gap-2 cursor-pointer">
            <AddCircleIcon color="info" />
            <div>添加新书</div>
          </Paper>
        </div>
      </div>

      <NewBookDialog onRef={dialog} toast={toast} refresh={updatePage} />
      <ModifyBookDialog onRef={modifyDialog} toast={toast} refresh={updatePage}/>
      <RemoveDialog onRef={removeDialog} />
      {/* loading mask */}
      <Loading onRef={loading} />
      <Toast onRef={toast} />
    </div>
  );
}

export default BooksPage;


export const updatePage = ()=>{
  //brute and fast
  window.location.reload();
  //router.refresh();
}