//suck here, all is client, hah.
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import SidePanel from "./components/SidePanel";
import TopPanel from "./components/TopPanel";
import { Box, Toolbar } from "@mui/material";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "图书管理系统",
  description: "2024-数据库Lab5",
};

export default function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    borrow: React.ReactNode;
    re: React.ReactNode;
    search: React.ReactNode;
    books: React.ReactNode;
    cards: React.ReactNode;
  }>
) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <Box sx={{display: "flex"}}>
            <TopPanel />
            <SidePanel />
            <div className=" bg-slate-50 w-full min-h-screen flex flex-col items-center">
              <Toolbar/>
              {props.children}
            </div>
          </Box>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
