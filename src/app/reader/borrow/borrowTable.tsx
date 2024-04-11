"use client";

import Loading from "@/app/components/Loading";
import Toast from "@/app/components/Toast";
import { MaxBorrowDay, FetchURL, dateTransfer } from "@/utils/path";
import { IBorrow, IDType } from "@/utils/types";
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
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

export default function BorrowTable({ borrows }: { borrows: IBorrow[] }) {
  //needless to fetch borrowed books, already get it in server parent.
  const loading = useRef();
  const toast:any = useRef();
  const router = useRouter();
  const continueAll = () => {
    for (let i = 0; i < borrows.length; i++) {
      continueBorrow(borrows[i]);
    }
  };

  
  const returnBook = (borrow: IBorrow) => {
    fetch(FetchURL + "/api/reader/return",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        borrowid: borrow.borrowid,
      }),
    }).then((res)=>{
      if(res.status === 200){
        toast.current.open(
          `《${borrow.book.title}》还书成功`,
          "success"
        );
        router.refresh();
      }else throw "fail"
    }).catch(err=>{
      toast.current.open(
        `《${borrow.book.title}》还书失败`,
        "error"
      );
      console.error(err);
    })
  };

  const continueBorrow = (borrow: IBorrow) => {
    //delay the return date.
    //if return time is half month later, no need to renew
    if (borrow.returnDate - Date.now() > 15 * 24 * 60 * 60 * 1000) {
      toast.current.open(
        `《${borrow.book.title}》距离还书时间超半个月，无法续借`,
        "info"
      );
      return;
    }
    fetch(FetchURL + "/api/reader/borrow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        borrowid: borrow.borrowid,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          toast.current.open(
            `《${borrow.book.title}》续借成功`,
            "success"
          );
          //call parent to get a reload.
          router.refresh();
        } else throw "fail";
      })
      .catch((err) => {
        toast.current.open(
          `《${borrow.book.title}》续借失败`,
          "error"
        );
        console.error(err);
      });
  };


  return (
    <div className=" relative py-4 w-full h-fit flex flex-col justify-start items-center">
      <div className=" mb-2">已借书目</div>
      <TableContainer component={Paper}>
        <Table
          sx={{
            minWidth: 650,
          }}
        >
          <TableHead>
            <TableRow>
              {["书名", "借阅日期", "应还日期", "操作"].map((item) => (
                <TableCell key={item}>{item}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {borrows.map((borrow) => (
              <TableRow key={borrow.borrowid}>
                <TableCell>{borrow.book.title}</TableCell>
                <TableCell>{dateTransfer(borrow.borrowDate)}</TableCell>
                <TableCell>
                  <div className={
                    borrow.returnDate < Date.now()
                      ? "text-red-500"
                      : ""
                  }>
                  {dateTransfer(borrow.returnDate)}
                  </div>
                </TableCell>
                <TableCell>
                  <ButtonGroup variant="text">
                    <Button
                      onClick={() =>
                        returnBook(borrow)
                      }
                    >
                      归还
                    </Button>
                    <Button
                      onClick={() => continueBorrow(borrow)}
                    >
                      续借
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mt-4">
        <Button variant="contained" color="primary" onClick={continueAll}>
          续借全部
        </Button>
      </div>
      {/* loading mask */}
      <Toast onRef={toast} />
      <Loading onRef={loading} />
    </div>
  );
}
