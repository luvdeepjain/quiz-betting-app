# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Initialize database (required before first run)
npm run init-db

# Start the server
npm start
# or
npm run dev

# Check server health
curl http://localhost:3000/api/health
```

### Database Operations
```bash
# Reinitialize database (WARNING: destroys all data)
npm run init-db

# View database schema and data (SQLite CLI required)
sqlite3 server/database/app.sqlite ".schema"
sqlite3 server/database/app.sqlite "SELECT * FROM users;"
```

## Architecture Overview

This is a **fullstack Node.js quiz betting application** with the following key architectural decisions:

### Backend Architecture
- **Express.js server** with RESTful API design
- **SQLite database** for simplicity (single file, no setup required)
- **JWT authentication** with bcrypt password hashing
- **Model-based data access** with promise-based SQLite operations
- **Rate limiting** (100 requests per 15 minutes per IP)

### Frontend Architecture
- **Vanilla JavaScript SPA** served as static files
- **Bootstrap styling** for responsive UI
- **JWT token storage** in localStorage
- **API-driven** interaction with backend

### Key Design Patterns

#### Database Connection Pattern
Each model method opens and closes its own database connection. The `getDb()` function in `server/database/db.js` creates a new SQLite connection for each operation.

#### Authentication Flow
1. JWT tokens are issued on login (`/api/auth/login`)
2. Protected routes use `server/middleware/auth.js` to verify tokens
3. User context is attached to `req.user` for authenticated requests

#### Betting System
- Users start with ₹1000 virtual currency
- Betting logic is in `Quiz.js` model with transaction-like operations
- 2x payout for correct answers, loss of bet amount for incorrect

### Critical Files

#### Server Entry Point
- `server/app.js` - Express server setup, middleware, and route mounting

#### Data Models
- `server/models/User.js` - User CRUD operations, authentication, wallet management
- `server/models/Quiz.js` - Quiz operations, betting logic, question fetching

#### API Routes
- `server/routes/auth.js` - Registration and login endpoints
- `server/routes/quiz.js` - Quiz gameplay and betting endpoints

#### Database
- `server/database/init.js` - Database schema creation and seed data
- `server/database/db.js` - Database connection helper
- `server/database/app.sqlite` - SQLite database file (created after init)

#### Frontend
- `public/index.html` - Single HTML file with embedded navigation
- `public/js/app.js` - Frontend JavaScript application logic
- `public/css/styles.css` - Custom styling

### API Endpoints Structure

```
/api/auth/
  POST /register - User registration
  POST /login - User authentication

/api/quiz/
  GET /categories - Get quiz categories
  GET /question?category=<id> - Get random question
  POST /bet - Place bet on question
  GET /history - Get user betting history
  GET /profile - Get user profile and wallet

/api/health - Server health check
```

### Database Schema

The application uses 4 main tables with the following relationships:
- `users` (wallet_balance, authentication)
- `categories` (quiz organization)
- `questions` (belongs to category)
- `bets` (links user + question, stores outcomes)

### Security Considerations

This is an MVP with basic security measures:
- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Rate limiting
- Parameterized SQL queries
- CORS enabled

**Production deployment would require additional security measures.**

### Development Notes

- The app automatically initializes the database on server startup
- SQLite database is suitable for development but not production scale
- No real money transactions - uses virtual currency only
- Frontend is a single-page application that handles routing client-side
- Error handling is basic - production apps need more comprehensive error management

### Common Debugging

If you encounter issues:
1. **Database errors**: Run `npm run init-db` to reset database
2. **Authentication errors**: Check JWT token format and expiration
3. **Connection issues**: Verify server is running on port 3000
4. **Wallet issues**: Check user wallet balance and bet amount validation
