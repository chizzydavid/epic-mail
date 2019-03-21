const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let connectionString;
console.log(process.env.NODE_ENV)
console.log(process.env.DATABASE_URL)
console.log(process.env.DATABASE_TEST_URL)
if(process.env.NODE_ENV === 'test') {
  connectionString = process.env.DATABASE_TEST_URL
} else {
  connectionString = process.env.DATABASE_URL
}
const pool = new Pool({ connectionString });

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
    .then((res) => {
      console.log('creating user database')
    })
    .catch((err) => {
  });
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
    .then((res) => {
    })
    .catch((err) => {
  });
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
    .then((res) => {
    })
    .catch((err) => {
  });
}

const createGroupUsersTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS group_users (
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_role VARCHAR(20) NOT NULL
  )`;

  pool.query(queryText)
    .then((res) => {
    })
    .catch((err) => {
  });
}

const createInboxTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS inbox (
  receiver_id INTEGER NOT NULL,
  message_id INTEGER NOT NULL)`;

  pool.query(queryText)
    .then((res) => {
    })
    .catch((err) => {
  });
}

const createOutboxTable = () => {
  const queryText =
  `CREATE TABLE IF NOT EXISTS outbox (
  sender_id INTEGER NOT NULL,
  message_id INTEGER NOT NULL)`;

  pool.query(queryText)
    .then((res) => {
    })
    .catch((err) => {
  });
}

const insertIntoUsers = () => {
  const queryText =
  `INSERT INTO users (email, first_name, last_name, password, is_admin) 
   VALUES('jimmycall@gmail.com', 'Jimmy', 'Call', 'jimmycall', 0)`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      console.log('inserting into users');
    })
    .catch((err) => {
  });
}


const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';

  pool.query(queryText)
    .then((res) => {
    })
    .catch((err) => {
  });
}

const dropMessageTable = () => {
  const queryText = 'DROP TABLE IF EXISTS messages';

  pool.query(queryText)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
  });
}

const dropGroupTable = () => {
  const queryText = 'DROP TABLE IF EXISTS groups';

  pool.query(queryText)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
  });
}

const dropGroupUsersTable = () => {
  const queryText ='DROP TABLE IF EXISTS group_users';

  pool.query(queryText)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
  });
}

const dropInboxTable = () => {
  const queryText ='DROP TABLE IF EXISTS inbox';

  pool.query(queryText)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
  });
}

const dropOutboxTable = () => {
  const queryText ='DROP TABLE IF EXISTS outbox';

  pool.query(queryText)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
  });
}


const createAllTables = () => {
  createUserTable();
  createMessageTable();
  createGroupTable();
  createGroupUsersTable();
  createInboxTable();
  createOutboxTable();
  insertIntoUsers();
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
  console.log('client removed');
});


module.exports = {
  createAllTables,
  dropAllTables
};

require('make-runnable');






