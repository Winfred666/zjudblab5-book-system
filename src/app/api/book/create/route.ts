import { IBook } from "@/utils/types";
import { openDb } from "../../db/db";
import { sqlPromiseHandler } from "@/utils/path";

//insert one new book into sqlite
export async function POST(req: Request) {
  const book = (await req.json()) as IBook;
  const db = await openDb();
  return sqlPromiseHandler(db.run("INSERT INTO book (title, author, borrowed) VALUES (?, ?, ?)", [
    book.title,
    book.author,
    0,
  ]).then(res=>{
    db.close();
    return res;
  }));
}

//update the info of one book
export async function PUT(req:Request){
  const book = (await req.json()) as IBook;
  const db = await openDb();
  return sqlPromiseHandler(db.run("UPDATE book SET title=?, author=?,borrowed=? WHERE bookid=?", [
    book.title,
    book.author,
    book.borrowed,
    book.bookid,
  ]).then(res=>{
    db.close();
    return res;
  }));
}