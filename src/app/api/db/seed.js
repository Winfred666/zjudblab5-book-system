const sqlite3 = require("sqlite3").verbose();
const open = require("sqlite").open;

// Open SQLite database connection
async function openDb() {
  return open({
    filename: "./mydb.db",
    driver: sqlite3.Database,
  });
}

async function setup() {
  // Open SQLite connection
  const db = await openDb();
  // Define table schema
  await db.exec(`
    DROP TABLE IF EXISTS book;
    DROP TABLE IF EXISTS account;
    DROP TABLE IF EXISTS borrow;

    CREATE TABLE IF NOT EXISTS book (
      bookid INTEGER PRIMARY KEY AUTOINCREMENT,  
      title VARCHAR(50) UNIQUE NOT NULL,
      author VARCHAR(50),
      borrowed BOOLEAN
    );

    CREATE TABLE IF NOT EXISTS account(
        accountid INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        create_time INTEGER,
        max_borrow INTEGER,
        is_admin BOOLEAN,
        md5 CHAR(32)
    );

    CREATE TABLE IF NOT EXISTS borrow(
        borrowid INTEGER PRIMARY KEY AUTOINCREMENT,
        bookid INTEGER NOT NULL UNIQUE,
        accountid INTEGER,
        borrow_date INTEGER,
        return_date INTEGER,
        FOREIGN KEY (bookid) REFERENCES book(bookid) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (accountid) REFERENCES account(accountid) ON UPDATE CASCADE ON DELETE SET NULL
    );
  `);

  //some triggers, such as, turn book state into borrowed if create a borrow segment.
  //and trun book state into not borrowed if delete a borrow segment,
  await db.exec(`
  DROP TRIGGER IF EXISTS borrowbook_trigger;
  DROP TRIGGER IF EXISTS returnbook_trigger;
  DROP TRIGGER IF EXISTS updatebook_trigger;
  DROP TRIGGER IF EXISTS deletebook_trigger;

  CREATE TRIGGER borrowbook_trigger BEFORE INSERT ON borrow
      FOR EACH ROW
      BEGIN

    SELECT CASE WHEN (EXISTS (SELECT * FROM book WHERE bookid = NEW.bookid and borrowed = 1)) THEN
            RAISE(ABORT, 'Book is already borrowed')
    END;
    UPDATE book SET borrowed = 1 WHERE bookid = NEW.bookid;
    
    SELECT CASE WHEN (SELECT COUNT(*) FROM borrow WHERE accountid = NEW.accountid) >= 
      (SELECT max_borrow FROM account WHERE accountid = NEW.accountid) THEN
            RAISE(ABORT, 'Number of borrowed books exceeds limit')
    END;
  END;

  CREATE TRIGGER returnbook_trigger BEFORE DELETE ON borrow
    FOR EACH ROW
    BEGIN
      UPDATE book SET borrowed = 0 WHERE bookid = OLD.bookid;
    END;

    
  CREATE TRIGGER deletebook_trigger BEFORE DELETE ON book
  FOR EACH ROW
  BEGIN
    DELETE FROM borrow WHERE bookid = OLD.bookid;
  END;

  
  CREATE TRIGGER updatebook_trigger BEFORE UPDATE ON book
  FOR EACH ROW
  WHEN (NEW.borrowed = 0) BEGIN
      DELETE FROM borrow WHERE bookid = NEW.bookid;
    END;
  `);

  //insert first admin account
  await db.exec(`
  INSERT INTO account(name, create_time, max_borrow, is_admin, md5) VALUES('admin', strftime('%s','now'), 10, 1, '21232f297a57a5a743894a0e4a801fc3');
  `);
  // Close connection
  await db.close();
}

setup().catch((err) => {
  console.error("数据库启动出错：", err.message);
});
