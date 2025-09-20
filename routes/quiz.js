const express = require('express');
const Quiz = require('../models/Quiz');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await Quiz.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get a random question
router.get('/question', authenticateToken, async (req, res) => {
  try {
    const categoryId = req.query.category;
    const question = await Quiz.getRandomQuestion(categoryId);
    
    if (!question) {
      return res.status(404).json({ error: 'No questions found' });
    }
    
    // Remove correct answer from response
    const { correct_answer, ...questionForClient } = question;
    res.json(questionForClient);
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Place a bet on a question
router.post('/bet', authenticateToken, async (req, res) => {
  try {
    const { questionId, betAmount, selectedAnswer } = req.body;
    const userId = req.user.id;
    
    // Basic validation
    if (!questionId || !betAmount || !selectedAnswer) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (betAmount <= 0) {
      return res.status(400).json({ error: 'Bet amount must be positive' });
    }
    
    if (betAmount > req.user.wallet_balance) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }
    
    // Valid answers are a, b, c, d
    if (!['a', 'b', 'c', 'd'].includes(selectedAnswer)) {
      return res.status(400).json({ error: 'Invalid answer option' });
    }
    
    // Place the bet
    const result = await Quiz.placeBet(userId, questionId, betAmount, selectedAnswer);
    
    res.json({
      message: result.isCorrect ? 'Correct answer! You won!' : 'Wrong answer. Better luck next time!',
      isCorrect: result.isCorrect,
      correctAnswer: result.correctAnswer,
      winnings: result.winnings,
      betAmount: betAmount
    });
    
  } catch (error) {
    console.error('Place bet error:', error);
    res.status(500).json({ error: 'Failed to place bet' });
  }
});

// Get user's betting history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    
    const bets = await Quiz.getUserBets(userId, limit);
    res.json(bets);
  } catch (error) {
    console.error('Get betting history error:', error);
    res.status(500).json({ error: 'Failed to fetch betting history' });
  }
});

// Get user profile (including current wallet balance)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
