import { openDb } from "../../db/db";
import { sqlPromiseHandler } from "@/utils/path";

//delete book by id
export async function POST(req: Request) {
  const id = (await req.json()).bookid;
  const db = await openDb();
  return sqlPromiseHandler(db.run("DELETE FROM book WHERE bookid=?", [id]).then(res=>{
    db.close();
    return res;
  }));
}
