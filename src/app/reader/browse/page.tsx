"use client";
import BookSearchBar, { getBooks } from "@/app/components/BookSearchBar";
import Loading from "@/app/components/Loading";
import Toast from "@/app/components/Toast";
import { FetchURL } from "@/utils/path";
import { IBook } from "@/utils/types";
import {
  Button,
  Divider,
  Paper,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

function BrowsePage() {
  const [books, setBooks] = useState<IBook[]>([]);
  useEffect(() => {
    getBooks().then((data) => setBooks(data));
  }, []);
  const toast = useRef();
  const loading = useRef();
  const borrowBook = (bookid: number) => {
    (loading.current as any).open();
    fetch("" + "/api/reader/borrow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookid: bookid }),
      })
      .then((res) => {
        (toast.current as any).open("借阅成功","success");
        //set the book borrowed
        setBooks((old)=>old.map((val) => {
          if (val.bookid === bookid) {
            val.borrowed = true;
          }
          return val;
        }));
      })
      .catch((err) => {
        (toast.current as any).open("借阅失败:"+err.toString(),"error");
      })
      .finally(()=>{
        (loading.current as any).close();
      });
    };

  return (
    <div className=" mt-2 w-full px-10">
      <div className="panelTitle">
        <div>书库</div>
        <BookSearchBar filterBooks={setBooks} />
      </div>
      <Divider />
      {/* Add your content here */}
      <div className="flex flex-row flex-wrap justify-center items-start">
        {books.map((val) => (
          <Paper
            elevation={3}
            key={val.bookid}
            className="m-4 p-4 flex flex-col items-start w-40 h-48"
          >
            <div className=" text-lg">{val.title}</div>
            <p className=" subtext">作者：{val.author}</p>
            <p className=" subtext">编号：{val.bookid}</p>
            <div className=" self-center flex-grow flex flex-col justify-end">
              <Button variant="contained" disabled={val.borrowed}
                onClick={()=>borrowBook(val.bookid)}>
                {val.borrowed ? "已借出" : "借阅"}
              </Button>
            </div>
          </Paper>
        ))}
      </div>
      <Loading onRef={loading}/>
      <Toast onRef={toast}/>
    </div>
  );
}

export default BrowsePage;