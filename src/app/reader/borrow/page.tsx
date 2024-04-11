
import React from "react";
import BorrowTable from "./borrowTable";
import BorrowState from "./BorrowState";
import { WhoAmI } from "@/app/api/reader/route";


async function BorrowPage() {
  
  //call who am I directly from server, good choice
  const reader = await WhoAmI();
  
  return (
    <div className=" mt-2 w-full">
      {/* account state, with brief info */}
      <BorrowState reader={reader}/>
      {/* borrowed table with action bar */}
      <div className=" w-full">
        <BorrowTable borrows={reader.curBorrow}/>
      </div>
    </div>
  );
}

export default BorrowPage;