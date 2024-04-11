import { IBook, IDType } from "@/utils/types";
import { openDb } from "../../db/db";
import { sqlPromiseHandler } from "@/utils/path";

//delete one account,
//also by trigger delete the borrow info.
export async function POST(req: Request) {
  const id = (await req.json()).id;
  const db = await openDb();
  return sqlPromiseHandler(db.run("DELETE FROM account WHERE accountid=?", [
    id,
  ]).then(res=>{
    db.close();
    return res;
  }));
}
