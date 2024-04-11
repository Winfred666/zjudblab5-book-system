import NextAuth from "next-auth"
import {options} from "./options"

//next-auth will automatically add sign in page, sign out page, and error, etc.
const handler = NextAuth(options);

//overtake both GET and POST method.
export {handler as GET, handler as POST}