import { IBook, IReader } from "@/utils/types";
import { openDb } from "../../db/db";
import { sqlPromiseHandler } from "@/utils/path";

//create an account to data base:
//query with reader and md5 as password
export async function POST(req: Request) {
  const {reader,md5} = (await req.json());
  const db = await openDb();
  return sqlPromiseHandler(db.run("INSERT INTO account (name,create_time,max_borrow,is_admin,md5) VALUES (? ,? ,? ,?, ?);", [
    reader.name,
    reader.createtime,
    reader.maxBorrow,
    reader.isAdmin,
    md5
  ]).then(res=>{
    db.close();
    return res;
  }));
}
