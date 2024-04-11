import { IBook, IDType } from "@/utils/types"
import { openDb } from "../db/db";


export async function GET(req: Request) {
   const db = await openDb();
   let books = await db.all("SELECT * FROM book");
   books = books.map((book:IBook)=>{
    book.borrowed = (book.borrowed as any === 1);
    return book;
   });
   db.close();
   return Response.json({data:books});
}

//get book by id, using post
export async function POST(req:Request){
    const id:IDType|undefined = (await req.json()).bookid;
    if(!id) return new Response("书籍查询错误",{status:400});
    const db = await openDb();
    //get will only return first object, all will return an array
    const res = await db.all("SELECT * FROM book WHERE id=?",[id]);
    db.close();
    if(!res) return new Response(`未找到id为 ${id} 书籍`,{status:400});
    return Response.json({data:res});
}