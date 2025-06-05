const db = require('../config/db');

const User = {
  create: (firstName, lastName, email, role) => {
    return db.execute(
      'INSERT INTO users (first_name, last_name, email, role) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email, role]
    );
  },
  findAll: () => db.execute('SELECT * FROM users'),
};

module.exports = User;
