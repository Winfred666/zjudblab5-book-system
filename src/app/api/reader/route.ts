import { IBorrow, IDType, IReader } from "@/utils/types";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

import { redirect } from "next/navigation";
import { FetchURL } from "@/utils/path";
import { openDb } from "../db/db";
import { Database } from "sqlite";

export async function GET(req: Request) {
  //get reader, from current token first
  return WhoAmI().then(reader=>{
    //nead a response
    return Response.json({data:reader});
  });
}


export async function WhoAmI(): Promise<IReader> {
  let name="";
  let database:Database|null = null;
  return getServerSession(options)
    .then((session) => {
      if (!session || !session.user || !session.user.name) {
        //another little guard
        throw "invalid user";
      }
      name = session.user.name;
      return openDb();
    })
    .then(db=>{
      database = db;
      //get only one account
      return db.get(`SELECT * FROM account WHERE name=?`,[name]);
    }).then(async acc=>{
      if(!database) throw "打开数据库失败";
      return getAllBorrow(acc.accountid,database)
      .then(borrows=>{
        return {
        id: acc.accountid as IDType,
        name: acc.name,
        createtime: acc.create_time,
        maxBorrow: acc.max_borrow,
        curBorrow: borrows,
        isAdmin: acc.is_admin,
      }});
    })
    .then(res=>{
      database?.close();
      return res;
    })
    .catch((e) => {
      console.error("获取用户信息失败：",e);
      return redirect("" + "/api/auth/login?error=CredentialsSignin");
    });
}


export async function getAllBorrow(accountid:IDType,db:Database):Promise<IBorrow[]>{
  return db.all(
    `SELECT * FROM borrow 
    WHERE accountid=?`,
    [accountid]
  ).then(borrows=>{
    const promises = borrows.map(async (val:any):Promise<IBorrow>=>{
      //extract book from every borrow segment.
      return db.get(`SELECT * FROM book WHERE bookid=?`,[val.bookid])
      .then(book=>{
        return {
        borrowid:val.bookid,
        borrowDate:val.borrow_date,
        returnDate:val.return_date,
        hasReturned:false, //TODO: not delete but record borrow segment when return book
        readerid:val.accountid,
        book:book,
      };
    });
    });
    return Promise.all(promises);
  });
}