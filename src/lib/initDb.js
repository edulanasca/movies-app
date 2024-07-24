const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function initDb() {
  try {
    const db = await open({
      filename: './users.sqlite',
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS favorites (
        username TEXT,
        id INTEGER,
        type TEXT,
        PRIMARY KEY (username, id),
        FOREIGN KEY (username) REFERENCES users(username)
      );
    `);

    await db.close();
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDb();