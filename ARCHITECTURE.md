# Quiz Betting App MVP - Architecture

## Tech Stack

### Backend
- **Node.js** with **Express.js** - Simple, fast web server
- **SQLite** - Lightweight database, no setup required
- **bcrypt** - Password hashing for security
- **jsonwebtoken** - JWT tokens for authentication
- **express-rate-limit** - Basic rate limiting

### Frontend
- **Vanilla HTML/CSS/JavaScript** - No framework complexity for MVP
- **Bootstrap** - Quick styling and responsive design

### Database Schema
```
Users Table:
- id (PRIMARY KEY)
- username (UNIQUE)
- email (UNIQUE)
- password_hash
- wallet_balance (DECIMAL)
- created_at

Categories Table:
- id (PRIMARY KEY)
- name
- description

Questions Table:
- id (PRIMARY KEY)
- category_id (FOREIGN KEY)
- question_text
- option_a
- option_b
- option_c
- option_d
- correct_answer
- difficulty

Bets Table:
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- question_id (FOREIGN KEY)
- bet_amount (DECIMAL)
- selected_answer
- is_correct
- winnings (DECIMAL)
- created_at
```

## MVP Features
1. User registration and login
2. Basic wallet system (add/view balance)
3. Quiz categories
4. Question answering with betting
5. Win/loss calculation
6. Simple dashboard showing balance and history
7. Basic security measures

## File Structure
```
/
├── server/
│   ├── app.js
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── database/
├── public/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
├── package.json
└── README.md
```
