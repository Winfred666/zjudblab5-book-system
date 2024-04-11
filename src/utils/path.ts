import { IDType } from "./types";

export const FetchURL = process.env.NEXT_PUBLIC_URL;

//time that reader can keep the book
export const MaxBorrowDay = 30;

const options = {
year: 'numeric',
month: 'long',
day: 'numeric',
};

export const dateTransfer = (date:number):string => {
    return new Date(date).toLocaleDateString(undefined,options as any);
}

export const sqlPromiseHandler = async (promise:Promise<any>):Promise<any>=>{
    return promise.then((res) => {
        return Response.json({ msg: "success",data:res});
      })
      .catch((e) => {
        console.error(e);
        return new Response("数据库查询错误！", { status: 500 });
      });
}

export const validateBook = (bookname:string,author:string):boolean=>{
    if(bookname === "" || author === ""){
        return false;
    }
    return true;
}

export const padID = (id:IDType):string=>{
    return id.toString().padStart(6,'0');
}