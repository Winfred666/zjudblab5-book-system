"use client";

import { TableFooter, TablePagination, TableRow } from "@mui/material";
import { useEffect, useState } from "react";

export default function MyTableFooter({
  count,
  onChangeTableView,
}: {
  count: number;
  onChangeTableView: (from: number, to: number) => void;
}) {
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  useEffect(() => {
    let end = (page + 1) * rowsPerPage;
    if(end>count) end = count;
    onChangeTableView(page * rowsPerPage, end);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, count]);
  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30, { label: "全部", value: -1 }]}
          colSpan={3}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            console.log(e.target.value);
            setPage(0);
          }}
          onPageChange={(e, newPage) => {
            setPage(newPage);
          }}
        ></TablePagination>
      </TableRow>
    </TableFooter>
  );
}
