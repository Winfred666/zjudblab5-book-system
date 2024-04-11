import { FetchURL, dateTransfer, padID } from "@/utils/path";
import { IAccount, IReader } from "@/utils/types";
import Logout from "./Logout";
import { WhoAmI } from "@/app/api/reader/route";
import NoAdminTip from "./NoAdminTip";

async function InfoPage() {
  const {id,name,createtime,isAdmin} = await getAccountInfo();
  return (
    <div className=" mt-10 pl-32  w-full  flex flex-col items-start gap-10">
      <div className=" text-3xl">账号信息</div>
        <div className=" grid grid-rows-4 grid-flow-col gap-10">
            <div >账号ID：</div>
            <div >昵称：</div>
            <div >创建时间：</div>
            <div >是否是管理员：</div>
            <div>{padID(id)}</div>
            <div>{name}</div>
            <div>{dateTransfer(createtime)}</div>
            <div>{isAdmin?"是":"否"}</div>
        </div>
        <NoAdminTip/>
        <Logout/>
    </div>
  );
}

export default InfoPage;

async function getAccountInfo(): Promise<IAccount> {
  //get server session from next auth. easy, because it's a server component
  return WhoAmI();
}
