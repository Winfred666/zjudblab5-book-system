
export type IDType = number;
export type DateType = number;

export interface IBook{
    bookid:IDType,
    title:string,
    author:string,
    borrowed:boolean, //whether the book has been borrowed.
}

export interface IBorrow{
    borrowid:IDType, //primary key.
    borrowDate:DateType, //the date of borrowing.
    returnDate:DateType, //the date of returning.
    hasReturned:boolean, //whether the book has been returned.
    book:IBook,
    readerid:IDType, //foreign key, refer the borrower.
}

export interface IAccount{
    id:IDType,
    name:string,
    createtime:DateType,
    isAdmin:boolean,
}

export interface IReader extends IAccount{
    maxBorrow:number, //the ability of this account.
    curBorrow:IBorrow[],
}