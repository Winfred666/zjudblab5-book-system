

//here the main title could solve as a dash board or welcome page.

import Image from "next/image";

//but by default just leave it blank
export default function Home() {
  return (
    <div className=" mt-10">
      <Image src="/logo.png" alt="logo" priority width={200} height={200} />
      <div className=" mt-4 text-3xl">图书管理系统</div>
    </div>
  );
}
