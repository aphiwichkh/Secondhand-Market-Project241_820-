const db = require('./config/db');

(async () => {
  try {
    const [tables] = await db.query("SHOW TABLES LIKE 'categories'");
    console.log('categories table exists:', tables.length > 0);
    if (!tables.length) {
      console.log('categories table not found');
      process.exit(1);
    }

    const [rows] = await db.query('SELECT id,name FROM categories ORDER BY id ASC');
    console.log('existing categories', rows);

    const catRows = [
      'เครื่องใช้ไฟฟ้า / Electronics',
      'แฟชั่น / Fashion',
      'หนังสือ / Books',
      'เฟอร์นิเจอร์ / Furniture',
      'ของสะสม / Collectibles',
      'ของใช้เด็ก / Kids',
      'กีฬา / Sports',
      'เครื่องดนตรี / Musical Instruments',
      'เครื่องสำอาง / Beauty',
      'เกมและงานอดิเรก / Games & Hobbies',
    ];

    for (const name of catRows) {
      await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    }

    const [newRows] = await db.query('SELECT id,name FROM categories ORDER BY id ASC');
    console.log('new categories', newRows);
  } catch (e) {
    console.error(e);
  } finally {
    await db.end();
  }
})();