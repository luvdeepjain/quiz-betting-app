const { getDb } = require('./db');

function initDatabase() {
  const db = getDb();
  
  // Create tables
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      wallet_balance DECIMAL(10,2) DEFAULT 1000.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Categories table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    )`);
    
    // Questions table
    db.run(`CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      question_text TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      difficulty TEXT DEFAULT 'medium',
      FOREIGN KEY(category_id) REFERENCES categories(id)
    )`);
    
    // Bets table
    db.run(`CREATE TABLE IF NOT EXISTS bets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      question_id INTEGER,
      bet_amount DECIMAL(10,2) NOT NULL,
      selected_answer TEXT NOT NULL,
      is_correct BOOLEAN,
      winnings DECIMAL(10,2) DEFAULT 0.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(question_id) REFERENCES questions(id)
    )`);
    
    // Insert sample categories
    db.run(`INSERT OR IGNORE INTO categories (name, description) VALUES 
      ('General Knowledge', 'Basic general knowledge questions'),
      ('Sports', 'Sports trivia and facts'),
      ('Science', 'Science and technology questions'),
      ('History', 'Historical events and figures')`);
    
    // Insert sample questions
    db.run(`INSERT OR IGNORE INTO questions (category_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES 
      (1, 'What is the capital of India?', 'Mumbai', 'New Delhi', 'Kolkata', 'Chennai', 'b', 'easy'),
      (1, 'Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'b', 'easy'),
      (2, 'How many players are there in a cricket team?', '10', '11', '12', '13', 'b', 'easy'),
      (3, 'What is the chemical symbol for Gold?', 'Go', 'Gd', 'Au', 'Ag', 'c', 'medium'),
      (4, 'In which year did India gain independence?', '1946', '1947', '1948', '1949', 'b', 'medium')`);
    
    console.log('Database initialized successfully!');
  });
  
  db.close();
}

if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
