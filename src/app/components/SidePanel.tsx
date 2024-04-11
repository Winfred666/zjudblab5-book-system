"use client";

import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BookIcon from "@mui/icons-material/Book";
import { useRouter } from "next/navigation";

import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useEffect, useState } from "react";
import { FetchURL } from "@/utils/path";

//return current panel to parent component
export default function SidePanel() {
  const [curRoute, setCurRoute] = useState("/reader/borrow");
  const readerBar = [
    {
      text: "还书/续借",
      route: "/reader/borrow", //in fact it's only slots, not a page route.
      icon: <BookmarkIcon />,
    },
    { text: "浏览书目", route: "/reader/browse", icon: <ManageSearchIcon /> },
  ];

  const adminBar = [
    { text: "图书管理", route: "/admin/books", icon: <BookIcon /> },
    { text: "读者证管理", route: "/admin/cards", icon: <CreditCardIcon /> },
  ];

  const otherBar = [
    { text: "个人信息", route: "/other/info", icon: <PersonIcon /> },
    { text: "关于", route: "/other/about", icon: <InfoIcon /> },
  ];

  const router = useRouter();
  const changeRoute = (route: string) => {
    setCurRoute(route);
    //Navigate to route
    //for ssr page like /reader/borrow, we need to refresh the page
    if(route === curRoute) router.refresh();
    else if(route === "/reader/borrow") window.location.href = FetchURL+"/reader/borrow";
    else router.push(route);
  };

  //init router according to current route
  useEffect(() => {
    setCurRoute(window.location.href.split(window.location.origin)[1]);
  }, []);

  return (
    <>
      <Drawer
        variant="persistent"
        anchor="left"
        open={true}
        sx={{
          width: 220,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 220,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List subheader={<ListSubheader>读者</ListSubheader>}>
          {readerBar.map(({ text, route, icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => changeRoute(route)}
                selected={route === curRoute}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List subheader={<ListSubheader>管理员</ListSubheader>}>
          {adminBar.map(({ text, route, icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => changeRoute(route)}
                selected={route === curRoute}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List subheader={<ListSubheader>其他</ListSubheader>}>
          {otherBar.map(({ text, route, icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => changeRoute(route)}
                selected={route === curRoute}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
