import { Button } from "@mui/material";
import Link from "next/link";

export default function Logout() {
  return (<Button color="error" variant="outlined">
    <Link href="/api/auth/signout">
    退出登录
    </Link>
  </Button>);
}