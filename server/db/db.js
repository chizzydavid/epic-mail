const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  // console.log('connected to the db');
});

const createUserTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(128) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        password VARCHAR(128),
        is_admin SMALLINT,
        photo VARCHAR(200)
     )`;

  await pool.query(queryText);
};

const createMessageTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    subject VARCHAR(128),
    message TEXT,
    parent_msg_id VARCHAR(50),
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER,
    created_at VARCHAR(150) NOT NULL,
    status VARCHAR(10) NOT NULL
  )`;

  await pool.query(queryText);
};

const createGroupTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS groups (
    group_id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    owner_id INTEGER NOT NULL
  )`;

  await pool.query(queryText);
};

const createGroupUsersTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS group_users (
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_role VARCHAR(20) NOT NULL
  )`;

  await pool.query(queryText);
};

const createInboxTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS inbox (
  receiver_id INTEGER NOT NULL,
  message_id INTEGER NOT NULL)`;

  await pool.query(queryText);
};

const createOutboxTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS outbox (
  sender_id INTEGER NOT NULL,
  message_id INTEGER NOT NULL)`;

  await pool.query(queryText);
};

const insertIntoUsers = async () => {
  const queryText = `INSERT INTO users (email, first_name, last_name, password, is_admin) 
   VALUES('jimmycall@gmail.com', 'Jimmy', 'Call', 'jimmycall', 0)`;

  await pool.query(queryText);
};


const dropUserTable = async () => {
  const queryText = 'DROP TABLE IF EXISTS users';

  await pool.query(queryText);
};

const dropMessageTable = async () => {
  const queryText = 'DROP TABLE IF EXISTS messages';

  await pool.query(queryText);
};

const dropGroupTable = async () => {
  const queryText = 'DROP TABLE IF EXISTS groups';

  await pool.query(queryText);
};

const dropGroupUsersTable = async () => {
  const queryText = 'DROP TABLE IF EXISTS group_users';

  await pool.query(queryText);
};

const dropInboxTable = async () => {
  const queryText = 'DROP TABLE IF EXISTS inbox';

  await pool.query(queryText);
};

const dropOutboxTable = async () => {
  const queryText = 'DROP TABLE IF EXISTS outbox';

  await pool.query(queryText);
};


const createAllTables = async () => {
  await createUserTable();
  await createMessageTable();
  await createGroupTable();
  await createGroupUsersTable();
  await createInboxTable();
  await createOutboxTable();
  await insertIntoUsers();
};

const dropAllTables = async () => {
  await dropUserTable();
  await dropMessageTable();
  await dropGroupTable();
  await dropGroupUsersTable();
  await dropInboxTable();
  await dropOutboxTable();
};

const setupTables = async () => {
  await dropAllTables();
  await createAllTables();
};


pool.on('remove', () => {
  // console.log('client removed');
  process.exit(0);
});


module.exports = {
  dropAllTables,
  createAllTables,
  setupTables,
};

require('make-runnable');
