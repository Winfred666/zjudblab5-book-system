import { IReader } from "@/utils/types";
import { openDb } from "../db/db";
import { getAllBorrow } from "../reader/route";
import { sqlPromiseHandler } from "@/utils/path";

//this api is protect by middleware, so needless worry that non-admin call this.
//insert one new book into sqlite
export async function GET(req: Request) {
  const db = await openDb();
  const account = await db.all("SELECT * FROM account");
  const accPro = account.map(async (val): Promise<IReader> => {
    return getAllBorrow(val.accountid, db).then((borrows) => {
      return {
        id: val.accountid,
        name: val.name,
        createtime: val.create_time,
        maxBorrow: val.max_borrow,
        isAdmin: val.is_admin === 1,
        curBorrow: borrows,
      };
    });
  });
  return sqlPromiseHandler(
    Promise.all(accPro).then((res) => {
      db.close();
      return res;
    })
  );
}
