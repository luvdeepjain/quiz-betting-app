const { getDb } = require('../database/db');

class Quiz {
  static async getCategories() {
    const db = getDb();
    
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories', (err, rows) => {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  
  static async getRandomQuestion(categoryId = null) {
    const db = getDb();
    let query = 'SELECT * FROM questions';
    let params = [];
    
    if (categoryId) {
      query += ' WHERE category_id = ?';
      params.push(categoryId);
    }
    
    query += ' ORDER BY RANDOM() LIMIT 1';
    
    return new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
  
  static async placeBet(userId, questionId, betAmount, selectedAnswer) {
    const db = getDb();
    
    return new Promise((resolve, reject) => {
      // First get the correct answer
      db.get('SELECT correct_answer FROM questions WHERE id = ?', [questionId], (err, question) => {
        if (err) {
          db.close();
          reject(err);
          return;
        }
        
        const isCorrect = question.correct_answer === selectedAnswer;
        const winnings = isCorrect ? betAmount * 2 : 0; // Simple 2x multiplier for correct answers
        
        // Insert the bet
        db.run(
          'INSERT INTO bets (user_id, question_id, bet_amount, selected_answer, is_correct, winnings) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, questionId, betAmount, selectedAnswer, isCorrect, winnings],
          function(err) {
            if (err) {
              db.close();
              reject(err);
              return;
            }
            
            // Update user wallet
            const walletChange = isCorrect ? winnings - betAmount : -betAmount;
            db.run(
              'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
              [walletChange, userId],
              function(err) {
                db.close();
                if (err) {
                  reject(err);
                } else {
                  resolve({
                    betId: this.lastID,
                    isCorrect,
                    winnings,
                    correctAnswer: question.correct_answer
                  });
                }
              }
            );
          }
        );
      });
    });
  }
  
  static async getUserBets(userId, limit = 10) {
    const db = getDb();
    
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT b.*, q.question_text, c.name as category_name 
         FROM bets b 
         JOIN questions q ON b.question_id = q.id 
         JOIN categories c ON q.category_id = c.id 
         WHERE b.user_id = ? 
         ORDER BY b.created_at DESC 
         LIMIT ?`,
        [userId, limit],
        (err, rows) => {
          db.close();
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
}

module.exports = Quiz;
