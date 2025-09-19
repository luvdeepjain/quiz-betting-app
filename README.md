# Quiz Betting App - MVP

A simple quiz betting application where users can wager on quiz questions, winning money for correct answers and losing money for wrong ones.

## 🎯 Features

### Core Functionality
- **User Authentication**: Secure registration and login system
- **Wallet System**: Users start with ₹1000 virtual currency
- **Quiz Categories**: Multiple categories including General Knowledge, Sports, Science, and History
- **Betting Mechanism**: Place bets on quiz questions with 2x payout for correct answers
- **Real-time Updates**: Wallet balance updates immediately after each bet
- **Betting History**: Track your wins and losses

### Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- Rate limiting (100 requests per 15 minutes per IP)
- Input validation on all forms
- SQL injection protection through parameterized queries

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd quiz-betting-mvp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Initialize the database**:
   ```bash
   npm run init-db
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000`

## 📖 How to Use

### Getting Started
1. **Register** a new account or **Login** with existing credentials
2. New users automatically receive ₹1000 in their wallet
3. Select a quiz category or choose "All Categories"
4. Click "New Question" to load a random question

### Playing the Game
1. Read the question and available options
2. Click on your chosen answer (A, B, C, or D)
3. Enter your bet amount in the modal
4. Confirm your bet
5. See immediate results and updated wallet balance

### Betting Rules
- **Correct Answer**: Win 2x your bet amount
- **Wrong Answer**: Lose your bet amount
- **Minimum Bet**: ₹1
- **Maximum Bet**: Limited by your wallet balance

## 🗂️ Project Structure

```
quiz-betting-mvp/
├── server/                    # Backend application
│   ├── app.js                # Main server file
│   ├── database/             # Database setup and connection
│   │   ├── db.js             # Database connection helper
│   │   ├── init.js           # Database initialization script
│   │   └── app.sqlite        # SQLite database file (created after init)
│   ├── models/               # Data models
│   │   ├── User.js           # User model with authentication
│   │   └── Quiz.js           # Quiz and betting model
│   ├── routes/               # API route handlers
│   │   ├── auth.js           # Authentication endpoints
│   │   └── quiz.js           # Quiz and betting endpoints
│   └── middleware/           # Custom middleware
│       └── auth.js           # JWT authentication middleware
├── public/                   # Frontend application
│   ├── index.html           # Main HTML file
│   ├── css/
│   │   └── styles.css       # Custom CSS styles
│   └── js/
│       └── app.js           # Frontend JavaScript application
├── package.json             # Project configuration and dependencies
├── ARCHITECTURE.md          # Technical architecture documentation
└── README.md               # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Quiz & Betting
- `GET /api/quiz/categories` - Get all quiz categories
- `GET /api/quiz/question` - Get random question (optionally by category)
- `POST /api/quiz/bet` - Place a bet on a question
- `GET /api/quiz/history` - Get user's betting history
- `GET /api/quiz/profile` - Get user profile and wallet balance

### System
- `GET /api/health` - Health check endpoint

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password_hash` - Encrypted password
- `wallet_balance` - Current wallet balance (starts at ₹1000)
- `created_at` - Registration timestamp

### Categories Table
- `id` - Primary key
- `name` - Category name
- `description` - Category description

### Questions Table
- `id` - Primary key
- `category_id` - Foreign key to categories
- `question_text` - The question
- `option_a`, `option_b`, `option_c`, `option_d` - Answer options
- `correct_answer` - Correct answer (a, b, c, or d)
- `difficulty` - Question difficulty level

### Bets Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `question_id` - Foreign key to questions
- `bet_amount` - Amount wagered
- `selected_answer` - User's selected answer
- `is_correct` - Whether the answer was correct
- `winnings` - Amount won (if any)
- `created_at` - Bet timestamp

## ⚖️ Legal and Compliance Considerations

**IMPORTANT**: This is a MVP for demonstration purposes only. Before deploying a real betting application:

### Required Compliance Steps
1. **Obtain proper gambling licenses** in your jurisdiction
2. **Implement age verification** (21+ in most regions)
3. **Add responsible gambling features**:
   - Deposit limits
   - Time-based restrictions
   - Self-exclusion options
   - Problem gambling resources
4. **Integrate real payment systems** with proper KYC/AML compliance
5. **Implement comprehensive audit logging**
6. **Add geolocation restrictions** based on local laws
7. **Include proper legal disclaimers and terms of service**

### Current MVP Limitations
- Uses virtual currency only
- No real money transactions
- No age verification
- No responsible gambling protections
- No regulatory compliance
- Basic security measures only

## 🔒 Security Notes

While this MVP includes basic security measures, production deployment would require:
- HTTPS enforcement
- Environment variables for secrets
- Database connection pooling
- More sophisticated rate limiting
- Comprehensive input sanitization
- Security headers middleware
- Regular security audits

## 🐛 Known Issues & Future Improvements

### Current Limitations
- SQLite database (suitable for demo only)
- No real-time multiplayer features
- Basic question pool (5 sample questions)
- No admin panel for content management
- No mobile app

### Potential Enhancements
- Real-time leaderboards
- Timed questions
- Multiple difficulty levels with different payouts
- Social features (friends, challenges)
- Achievement system
- More sophisticated betting options

## 📄 License

This project is for educational and demonstration purposes only.

## 🤝 Support

For questions about this MVP, please refer to the code documentation or create an issue in the project repository.
