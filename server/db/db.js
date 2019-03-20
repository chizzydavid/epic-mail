const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
	console.log('connected to the db');
})

const createUserTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS users (
		    user_id SERIAL PRIMARY KEY,
		    email VARCHAR(128) NOT NULL,
		    first_name VARCHAR(50) NOT NULL,
		    last_name VARCHAR(50) NOT NULL,
		    password VARCHAR(128),
		    is_admin SMALLINT
		 )`;

  pool.query(queryText)
    .then((res) => pool.end())
    .catch((err) => pool.end());
}

const createMessageTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    subject VARCHAR(128),
    message TEXT,
    parent_msg_id VARCHAR(50),
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER,
    created_at VARCHAR(50) NOT NULL,
    status VARCHAR(10) NOT NULL
  )`;

  pool.query(queryText)
    .then((res) => pool.end())
    .catch((err) => pool.end());
}

const createGroupTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS groups (
    group_id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    owner_id INTEGER NOT NULL
 	)`;

  pool.query(queryText)
    .then((res) => pool.end())
    .catch((err) => pool.end());
}

const createGroupUsersTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS group_users (
	  group_id INTEGER NOT NULL,
	  user_id INTEGER NOT NULL,
	  user_role VARCHAR(20) NOT NULL
  )`;

  pool.query(queryText)
    .then((res) =>  pool.end())
    .catch((err) =>  pool.end());
}

const createInboxTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS inbox (
  receiver_id INTEGER NOT NULL,
  message_id INTEGER NOT NULL)`;

  pool.query(queryText)
    .then((res) => pool.end())
    .catch((err) => pool.end());
}

const createOutboxTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS outbox (
  receiver_id INTEGER NOT NULL,
  message_id INTEGER NOT NULL)`;

  pool.query(queryText)
    .then((res) => pool.end())
    .catch((err) => pool.end());
}


const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';

  pool.query(queryText)
    .then((res) => pool.end())
    .catch((err) => pool.end());
}

const dropMessageTable = () => {
  const queryText = 'DROP TABLE IF EXISTS messages';

  pool.query(queryText)
    .then((res) => pool.end())
    .catch((err) => pool.end());
}

const dropGroupTable = () => {
  const queryText = 'DROP TABLE IF EXISTS groups';

  pool.query(queryText)
    .then((res) =>pool.end())
    .catch((err) =>pool.end());
}

const dropGroupUsersTable = () => {
  const queryText ='DROP TABLE IF EXISTS group_users';

  pool.query(queryText)
    .then((res) => pool.end())
    .catch((err) => pool.end());
}

const dropInboxTable = () => {
  const queryText ='DROP TABLE IF EXISTS inbox';

  pool.query(queryText)
    .then((res) => pool.end())
    .catch((err) => pool.end());
}

const dropOutboxTable = () => {
  const queryText ='DROP TABLE IF EXISTS outbox';

  pool.query(queryText)
    .then((res) => pool.end())
    .catch((err) => pool.end());
}


const createAllTables = () => {
  createUserTable();
  createMessageTable();
  createGroupTable();
  createGroupUsersTable();
  createInboxTable();
  createOutboxTable();
}

const dropAllTables = () => {
  dropUserTable();
  dropMessageTable();
  dropGroupTable();
  dropGroupUsersTable();
  dropInboxTable();
  dropOutboxTable();
}

pool.on('remove', () => {
  process.exit(0);
});


module.exports = {
  createAllTables,
  dropAllTables
};

require('make-runnable');