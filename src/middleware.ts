import { withAuth } from "next-auth/middleware";
import { NextMiddlewareResult } from "next/dist/server/web/types";
import { IReader } from "./utils/types";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token/session.
  function middleware(req): NextMiddlewareResult {
    //console.log("login token: ", req.nextauth.token);
    //if no token, only redirect to login page.
    if (!req.nextauth.token) {
      const absoluteURL = new URL(
        "/api/auth/signin",
        req.nextUrl.origin
      ).toString();
      return NextResponse.redirect(absoluteURL);
    }
    //console.log(req.nextauth.token);
    //if have token of admin, can go through all page.
    if ((req.nextauth.token as any as IReader).isAdmin) {
      return;
    }
    //if have token of reader,only go through readers page, not admin page.
    if (
      req.url.includes("/admin") ||
      req.url.includes("/api/card") ||
      req.url.includes("/api/book/")
    ) {
      const absoluteURL = new URL("/other/info?error=noadmin", req.nextUrl.origin).toString();
      return NextResponse.redirect(absoluteURL);
    }
  }
);
