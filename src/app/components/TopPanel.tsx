"use client";

import { AppBar, Avatar, List, ListItem, ListItemButton, ListItemText, Popover, Popper, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Logout from "../other/info/Logout";

export default function TopPanel() {
  const router = useRouter();
  const avator = useRef(null);
  const [isPopper,setIsPopper] = useState(false);

  return (
    <div>
      <Popover open={isPopper} anchorEl={avator.current}
       sx={{

        zIndex:(theme) => theme.zIndex.drawer + 2,
        pointerEvents:"none"
      }}
      onMouseEnter={()=>setIsPopper(true)}
      onMouseLeave={()=>setIsPopper(false)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      >
        <List disablePadding className=" pointer-events-auto">
          <ListItem>
            <ListItemButton onClick={()=>router.push("/other/info")}>
            <ListItemText primary="个人信息" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <Logout />
          </ListItem>
        </List>
      </Popover>


      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
            <div className=" tracking-wide font-semibold text-xl flex flex-row items-center justify-between w-screen">
              <div className="flex flex-row items-end">
                <div>图书管理系统</div>
                <div className=" ml-2 text-sm text-neutral-200">2024-数据库Lab5</div>
                </div>

              <div onMouseEnter={()=>setIsPopper(true)}
                  onMouseLeave={()=>setIsPopper(false)}>
                <Avatar ref={avator}>
                  
                </Avatar>
              </div>
            </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
