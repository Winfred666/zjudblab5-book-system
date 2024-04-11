//here we insert some dummy data into database, as init
const sqlite3 = require("sqlite3").verbose();
const open = require("sqlite").open;

// Open SQLite database connection
async function openDb() {
  return open({
    filename: "./mydb.db",
    driver: sqlite3.Database,
  });
}

async function insert() {
  // Open SQLite connection
  const db = await openDb();
  //insert first admin account
  await db.exec(`
  DELETE FROM book;
  INSERT INTO book (title, author, borrowed) VALUES 
  ('1984', '乔治·奥威尔', 0),
  ('麦田里的守望者', 'J.D.塞林格', 0),
  ('傲慢与偏见', '简·奥斯汀', 0),
  ('百年孤独', '加西亚·马尔克斯', 0),
  ('飘', '玛格丽特·米切尔', 0),
  ('人类简史', '尤瓦尔·赫拉利', 0),
  ('小王子', '安托万·德·圣埃克苏佩里', 0),
  ('福尔摩斯探案集', '阿瑟·柯南·道尔', 0),
  ('战争与和平', '列夫·托尔斯泰', 0),
  ('无声告白', '伍绮诗', 0),
  ('呼啸山庄', '艾米莉·勃朗特', 0),
  ('活着', '余华', 0),
  ('骆驼祥子', '老舍', 0),
  ('三体', '刘慈欣', 0),
  ('围城', '钱钟书', 0),
  ('霍乱时期的爱情', '加西亚·马尔克斯', 0),
  ('罗生门', '芥川龙之介', 0),
  ('白鹿原', '陈忠实', 0),
  ('雾都孤儿', '查尔斯·狄更斯', 0),
  ('东方快车谋杀案', '阿加莎·克里斯蒂', 0),
  ('红楼梦', '曹雪芹', 0),
  ('时间简史', '史蒂芬·霍金', 0),
  ('哈利·波特与魔法石', 'J.K.罗琳', 0),
  ('钢铁是怎样炼成的', '尼古拉·奥斯特洛夫斯基', 0),
  ('追风筝的人', '卡勒德·胡赛尼', 0),
  ('茶馆', '老舍', 0),
  ('倾城之恋', '张爱玲', 0),
  ('动物农场', '乔治·奥威尔', 0),
  ('失乐园', '约翰·密尔顿', 0),
  ('指环王', 'J.R.R.托尔金', 0),
  ('荆棘鸟', '科勒·麦卡洛', 0),
  ('海边的卡夫卡', '村上春树', 0),
  ('巴黎圣母院', '维克多·雨果', 0),
  ('悲惨世界', '维克多·雨果', 0),
  ('百万英镑', 'Jules Verne', 0),
  ('老人与海', '海明威', 0),
  ('夏洛的网', 'E.B.怀特', 0),
  ('樱桃园', '安东尼·契诃夫', 0),
  ('三个火枪手', '亚历山大·大', 0),
  ('战争十四讲', '毛姆', 0),
  ('苔丝', '托马斯·哈代', 0),
  ('草房子', '曹文轩', 0),
  ('基督山伯爵', '大仲马', 0),
  ('侯卫东四部曲之一鸡毛飞上天', '李凤树', 0),
  ('红玫瑰与白玫瑰', '张爱玲', 0),
  ('雷雨', '曹禺', 0),
  ('鹿鼎记', '金庸', 0),
  ('平凡的世界', '路遥', 0),
  ('明朝那些事儿', '当年明月', 0),
  ('鬼吹灯', '天下霸唱', 0),
  ('白夜行', '东野圭吾', 0),
  ('大秦帝国', '孙皓晖', 0);
  


INSERT INTO account (name, create_time, max_borrow, is_admin, md5) VALUES ('Alice', strftime('%s','now'), 5, 1, '5d41402abc4b2a76b9719d911017c592');
INSERT INTO account (name, create_time, max_borrow, is_admin, md5) VALUES ('Bob', strftime('%s','now'), 3, 0, '098f6bcd4621d373cade4e832627b4f6');
INSERT INTO account (name, create_time, max_borrow, is_admin, md5) VALUES ('Charlie', strftime('%s','now'), 10, 0, '1c383cd30b7c298ab50293adfecb7b18');
INSERT INTO account (name, create_time, max_borrow, is_admin, md5) VALUES ('David', strftime('%s','now'), 7, 0, '1f0e3dad99908345f7439f8ffabdffc4');


-- Insert records into the borrow table with borrow_date as current time in milliseconds and return_date as January 2nd, 2020
INSERT INTO borrow (bookid, accountid, borrow_date, return_date) 
VALUES 
    (1, 1, strftime('%s','now') * 1000, 1577923200000),
    (2, 2, strftime('%s','now') * 1000, 1577923200000),
    (3, 3, strftime('%s','now') * 1000, 1577923200000);

  `);
  // Close connection
  await db.close();
}

insert().catch((err) => {
  console.error("数据库启动出错：", err.message);
});
