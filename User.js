const { getDb } = require('../database/db');
const bcrypt = require('bcrypt');

class User {
  static async create(username, email, password) {
    const db = getDb();
    const password_hash = await bcrypt.hash(password, 10);
    
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, password_hash],
        function(err) {
          db.close();
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, username, email });
          }
        }
      );
    });
  }
  
  static async findByEmail(email) {
    const db = getDb();
    
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          db.close();
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }
  
  static async findById(id) {
    const db = getDb();
    
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id, username, email, wallet_balance FROM users WHERE id = ?',
        [id],
        (err, row) => {
          db.close();
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }
  
  static async updateWallet(userId, amount) {
    const db = getDb();
    
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
        [amount, userId],
        function(err) {
          db.close();
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }
  
  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
