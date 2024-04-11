"use client"
import { FetchURL, padID } from "@/utils/path";
import { IReader } from "@/utils/types";
import { Card, CardContent, Divider } from "@mui/material";
import { useEffect, useState } from "react";

export default function BorrowState({reader}: {reader: IReader}){

    return (
        <Card variant="outlined">
        <CardContent>
            <div className="flex flex-row justify-start mb-4">
            <div className=" w-1/2">卡号: {reader? padID(reader.id) : "******"}</div>
            <div>姓名: {reader?.name ?? "***"}</div>
            </div>
            <div className="flex flex-row justify-start">
                <div className=" w-1/2">已借书目: {reader?.curBorrow.length ?? "-"}</div>
                <div>剩余借阅次数: {(reader?(reader.maxBorrow - reader.curBorrow.length):"-")}</div>
            </div>
            
        </CardContent>
      </Card>
    )
}


