//way to edit: https://next-auth.js.org/configuration/options
//my providers: https://authjs.dev/guides/providers/credentials,
//here we use credentials and MySQL to login and manage account,
//assist by JWT to auto login.
//instead of using oauth, which is much simplier but too serious.

import { FetchURL } from "@/utils/path";
import { IReader } from "@/utils/types";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { openDb } from "../../db/db";
import { Md5 } from "ts-md5";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Account Name", type: "text", placeholder: "name" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        //input account or password is empty.
        if (!credentials || !credentials.username || !credentials.password)
          return null;

        //check database
        const db = await openDb();
        const account:
          | { accountid: string; name: string; is_admin: boolean; md5: string }
          | undefined = await db.get("SELECT * FROM account WHERE name = ?", [
          credentials?.username,
        ]);
        db.close();
        //if account not found, fail to login.
        if (!account) return null;
        //calculate MD5 hash of password.
        const md5 = Md5.hashStr(credentials.password);
        //match credential from database.
        if (md5 === account.md5) {
          //return user name and isAdmin as jwt session.
          return {
            name: account.name,
            isAdmin: account.is_admin,
          } as any;
        } else {
          return null;
        }

      },
    }),
  ], // way of sign in
  //sign page route is automatically create.

  //change session content (not safe because user might change it, though there is encryption.)
  callbacks: {
    //when manually login
    session: async ({ session, token, user }) => {
      //if user is admin, add isAdmin to session.
      if (session && user) {
        (session.user as any).isAdmin = (user as any).isAdmin;
      }
      return session;
    },
    //when auto login(after refresh).
    jwt: async ({ token, user }) => {
      if (user) {
        (token as any).isAdmin = (user as any).isAdmin;
      }
      return token;
    },
  },

  //settings of session, for autologin.
  session: {
    strategy: "jwt", //can also store in database.
    maxAge: 60*20, //20 minutes
    //can also self-define way to generate session token, but use default here.
  },

  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"

    brandColor: "", // Hex color code
    //logo: FetchURL+"/logo.png", // Absolute URL to image
    buttonText: "", // Hex color code
  },
};
