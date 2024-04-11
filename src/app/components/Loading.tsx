"use client";

import { Backdrop, CircularProgress } from "@mui/material";
import { useImperativeHandle, useState } from "react";

export default function Loading(props: any) {
  const [isLoading, setIsLoading] = useState(false);
  useImperativeHandle(props.onRef, () => {
    return {
      open: () => setIsLoading(true),
      close: () => setIsLoading(false),
    };
  });
  return (
    <Backdrop
      sx={{ color: "#1976d2", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
