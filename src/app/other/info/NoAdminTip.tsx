"use client"

import { Alert } from "@mui/material";
import { useEffect, useState } from "react";

function NoAdminTip() {
  const [error,setError] = useState(false);
  useEffect(()=>{
    const router = window.location.href;
    setError(router.includes("noadmin"));
  },[]);
  return error?(
    <div className = "relative mt-10">
        <Alert
          severity="warning"
          sx={{ width: "100%" }}
        >
          没有权限，无法打开管理员面板，请重新以管理员账号登录！
        </Alert>
    </div>
  ):(<></>);
}

export default NoAdminTip;
