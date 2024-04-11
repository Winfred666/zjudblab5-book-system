import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { openDb } from "../../db/db";
import { sqlPromiseHandler } from "@/utils/path";

//delete means return book.
export async function POST(req: Request) {
    //return a book, delete a borrow segment.
    const name = (await getServerSession(options))?.user?.name;
    if (!name) {
      return new Response("账号名称无效，无法还书", { status: 400 });
    }
    
    const borrowid = (await req.json()).borrowid;
    console.log(borrowid);
    
    const db = await openDb();
    return sqlPromiseHandler(
      db
        .run("DELETE FROM borrow WHERE borrowid=?", [borrowid])
        .then((res) => {
          db.close();
          return res;
        })
    );
  }