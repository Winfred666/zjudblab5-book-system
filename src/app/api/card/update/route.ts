import { IReader } from "@/utils/types";
import { openDb } from "../../db/db";
import { sqlPromiseHandler } from "@/utils/path";

//update one account, set password or other info.
export async function POST(req: Request) {
  const { reader, md5 } = await req.json();

  let prefix = "";
  if (md5.length > 1) prefix = `,md5='${md5}' `;

  const db = await openDb();
  return sqlPromiseHandler(
    db
      .run(
        `UPDATE account SET name=?, max_borrow=?, is_admin=? ${prefix} WHERE accountid=?`,
        [reader.name, reader.maxBorrow, reader.isAdmin, reader.id]
      )
      .then((res) => {
        db.close();
        return res;
      })
  );
}
