import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { openDb } from "../../db/db";
import { MaxBorrowDay, sqlPromiseHandler } from "@/utils/path";
import { WhoAmI } from "../route";
import { revalidatePath } from "next/cache";

//no protect from middleware, need to check user carefully.
//but call /api/reader instead to get all result, instead of this one.
export async function GET(req: Request) {
  const name = (await getServerSession(options))?.user?.name;
  if (!name) {
    return new Response("账号无效，无法查看借书信息", { status: 400 });
  }
  const db = await openDb();

  return sqlPromiseHandler(WhoAmI().then((res) => res.curBorrow));
}

//borrow a new book, check session also.
export async function POST(req: Request) {
  const name = (await getServerSession(options))?.user?.name;
  if (!name) {
    return new Response("账号名称无效，无法借书", { status: 400 });
  }
  const bookid = (await req.json()).bookid;

  //get borrow book list according to reader account.
  const db = await openDb();
  const accountid = await db.get(
    "SELECT accountid as id FROM account WHERE name=?",
    [name]
  );
  if (!accountid.id) {
    console.log(accountid);
    return new Response("账号id无效，无法借书", { status: 400 });
  }
  //console.log("借书：", accountid, bookid);
  return sqlPromiseHandler(
    db
      .run(
        `INSERT INTO
    borrow(bookid,accountid,borrow_date,return_date) VALUES (?,?,?,?)`,
        [
          bookid,
          accountid.id,
          Date.now(),
          Date.now() + 1000 * 60 * 60 * 24 * MaxBorrowDay, //one month
        ]
      )
      .then((res) => {
        db.close();
        //SSR render, so need to set revalidate tag when borrow data need to refresh.
        revalidatePath("/reader/borrow", "page");
        return res;
      })
  );
}

export async function PUT(req: Request) {
  //renew the return_time of one borrow segment
  const name = (await getServerSession(options))?.user?.name;
  if (!name) {
    return new Response("账号名称无效，无法续借", { status: 400 });
  }
  const borrowid = (await req.json()).borrowid;
  const db = await openDb();
  return sqlPromiseHandler(
    db
      .run("UPDATE borrow SET return_date=? WHERE borrowid=?", [
        Date.now() + 1000 * 60 * 60 * 24 * MaxBorrowDay,
        borrowid,
      ])
      .then((res) => {
        db.close();
        return res;
      })
  );
}