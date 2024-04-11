"use client";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { IBook } from "@/utils/types";
import { FetchURL } from "@/utils/path";

export default function BookSearchBar({
  filterBooks,
}: {
  filterBooks: (books: IBook[]) => void;
}) {
  const searchBook = (keyword: string) => {
    console.log(keyword);
  };
  return (
    <TextField
      id="input-with-icon-textfield"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      variant="standard"
      onKeyDown={(ev) => {
        if (ev.key === "Enter") {
          // Do code here
          ev.preventDefault();
          searchBook((ev.target as any).value);
        }
      }}
    />
  );
}

export async function getBooks(): Promise<IBook[]> {
  return fetch("" + "/api/book")
    .then((res) => res.json())
    .then((data) => {
      return data.data;
    });
}
