//see sqlite https://www.sqlite.org/features.html

import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Open SQLite database connection
export async function openDb() {
  
  const db = await open({
    filename: "./mydb.db",
    driver: sqlite3.Database,
  });

  db.on('trace', (sql:string) => {
    console.log('SQL: ', sql);
  });
  
  return db;
}
