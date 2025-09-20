// Quiz Betting App Frontend
class QuizBettingApp {
    constructor() {
        // No authentication needed - skip token
        this.currentUser = null;
        this.currentQuestion = null;
        this.selectedAnswer = null;
        this.categories = [];
        this.selectedCategory = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        
        // Skip authentication and load directly
        this.loadUserProfile();
    }
    
    setupEventListeners() {
        // Skip auth forms - they're hidden
        
        // Bet confirmation
        document.getElementById('confirm-bet-btn').addEventListener('click', () => this.confirmBet());
    }
    
    // Authentication Methods
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const response = await this.apiRequest('/api/auth/login', 'POST', {
                email,
                password
            });
            
            if (response.token) {
                this.token = response.token;
                localStorage.setItem('token', this.token);
                this.currentUser = response.user;
                this.showAppSection();
                this.showAlert('Login successful!', 'success');
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }
    
    async handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        try {
            const response = await this.apiRequest('/api/auth/register', 'POST', {
                username,
                email,
                password
            });
            
            if (response.token) {
                this.token = response.token;
                localStorage.setItem('token', this.token);
                this.currentUser = response.user;
                this.showAppSection();
                this.showAlert('Registration successful! You start with ₹1000 in your wallet.', 'success');
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }
    
    logout() {
        this.token = null;
        this.currentUser = null;
        this.currentQuestion = null;
        localStorage.removeItem('token');
        this.showAuthSection();
        this.showAlert('Logged out successfully!', 'info');
    }
    
    // API Methods
    async apiRequest(url, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        // No token needed anymore
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Request failed');
        }
        
        return result;
    }
    
    // User Profile
    async loadUserProfile() {
        try {
            const response = await this.apiRequest('/api/quiz/profile');
            this.currentUser = response.user;
            this.showAppSection();
            // Load categories after showing app
            this.loadCategories();
        } catch (error) {
            console.error('Failed to load profile:', error);
            // Show app anyway with default values
            this.showAppSection();
        }
    }
    
    // Quiz Methods
    async loadCategories() {
        try {
            this.categories = await this.apiRequest('/api/quiz/categories');
            this.renderCategories();
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }
    
    async loadNewQuestion(categoryId = null) {
        try {
            this.selectedCategory = categoryId;
            const url = categoryId ? `/api/quiz/question?category=${categoryId}` : '/api/quiz/question';
            this.currentQuestion = await this.apiRequest(url);
            this.renderQuestion();
        } catch (error) {
            this.showAlert('Failed to load question: ' + error.message, 'danger');
        }
    }
    
    async placeBet(selectedAnswer) {
        if (!this.currentQuestion) return;
        
        this.selectedAnswer = selectedAnswer;
        
        // Show bet modal
        const betModal = new bootstrap.Modal(document.getElementById('betModal'));
        betModal.show();
    }
    
    async confirmBet() {
        const betAmount = parseInt(document.getElementById('bet-amount').value);
        
        if (!betAmount || betAmount <= 0) {
            this.showAlert('Please enter a valid bet amount', 'warning');
            return;
        }
        
        if (betAmount > this.currentUser.wallet_balance) {
            this.showAlert('Insufficient wallet balance', 'warning');
            return;
        }
        
        try {
            const response = await this.apiRequest('/api/quiz/bet', 'POST', {
                questionId: this.currentQuestion.id,
                betAmount: betAmount,
                selectedAnswer: this.selectedAnswer
            });
            
            // Close modal
            const betModal = bootstrap.Modal.getInstance(document.getElementById('betModal'));
            betModal.hide();
            
            // Update user balance
            await this.loadUserProfile();
            
            // Show result
            this.showBetResult(response);
            
            // Load betting history
            this.loadBettingHistory();
            
            // Clear bet amount
            document.getElementById('bet-amount').value = '';
            
        } catch (error) {
            this.showAlert('Failed to place bet: ' + error.message, 'danger');
        }
    }
    
    async loadBettingHistory() {
        try {
            const history = await this.apiRequest('/api/quiz/history?limit=5');
            this.renderBettingHistory(history);
        } catch (error) {
            console.error('Failed to load betting history:', error);
        }
    }
    
    // Rendering Methods
    showAuthSection() {
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('app-section').style.display = 'none';
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'none';
    }
    
    showAppSection() {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'block';
        document.getElementById('user-info').style.display = 'inline';
        document.getElementById('logout-btn').style.display = 'none'; // Hide logout in demo mode
        
        // Update user info with mock or loaded data
        if (this.currentUser) {
            document.getElementById('username').textContent = this.currentUser.username;
            document.getElementById('wallet-balance').textContent = this.currentUser.wallet_balance;
        } else {
            // Default values if profile load failed
            document.getElementById('username').textContent = 'Player';
            document.getElementById('wallet-balance').textContent = '10000';
        }
        
        // Load initial data
        this.loadCategories();
        this.loadBettingHistory();
    }
    
    renderCategories() {
        const container = document.getElementById('categories-list');
        
        if (this.categories.length === 0) {
            container.innerHTML = '<div class=\"text-center text-muted\">No categories available</div>';
            return;
        }
        
        const html = this.categories.map(cat => `
            <button class=\"btn btn-outline-primary btn-sm me-2 mb-2\" 
                    onclick=\"app.loadNewQuestion(${cat.id})\">
                ${cat.name}
            </button>
        `).join('');
        
        container.innerHTML = html + `
            <button class=\"btn btn-outline-secondary btn-sm mb-2\" 
                    onclick=\"app.loadNewQuestion()\">
                All Categories
            </button>
        `;
    }
    
    renderQuestion() {
        if (!this.currentQuestion) return;
        
        const container = document.getElementById('question-area');
        
        const categoryName = this.categories.find(cat => cat.id === this.currentQuestion.category_id)?.name || 'General';
        
        container.innerHTML = `
            <div class=\"question-container\">
                <span class=\"category-tag\">${categoryName}</span>
                <div class=\"question-text\">${this.currentQuestion.question_text}</div>
                <div class=\"options\">
                    <button class=\"btn btn-outline-primary option-btn\" onclick=\"app.placeBet('a')\">
                        A) ${this.currentQuestion.option_a}
                    </button>
                    <button class=\"btn btn-outline-primary option-btn\" onclick=\"app.placeBet('b')\">
                        B) ${this.currentQuestion.option_b}
                    </button>
                    <button class=\"btn btn-outline-primary option-btn\" onclick=\"app.placeBet('c')\">
                        C) ${this.currentQuestion.option_c}
                    </button>
                    <button class=\"btn btn-outline-primary option-btn\" onclick=\"app.placeBet('d')\">
                        D) ${this.currentQuestion.option_d}
                    </button>
                </div>
            </div>
        `;
    }
    
    renderBettingHistory(history) {
        const container = document.getElementById('recent-bets');
        
        if (!history || history.length === 0) {
            container.innerHTML = '<div class=\"text-center text-muted\">No bets yet</div>';
            return;
        }
        
        const html = history.map(bet => {
            const resultClass = bet.is_correct ? 'win' : 'loss';
            const resultText = bet.is_correct ? `Won ₹${bet.winnings}` : `Lost ₹${bet.bet_amount}`;
            
            return `
                <div class=\"bet-history-item ${resultClass}\">
                    <div class=\"small\">${bet.category_name}</div>
                    <div class=\"small fw-bold\">${resultText}</div>
                    <div class=\"text-muted\" style=\"font-size: 0.75rem;\">
                        ${new Date(bet.created_at).toLocaleDateString()}
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }
    
    showBetResult(result) {
        const alertType = result.isCorrect ? 'success' : 'danger';
        const message = result.isCorrect 
            ? `🎉 Correct! You won ₹${result.winnings}!`
            : `❌ Wrong answer. You lost ₹${result.betAmount}. The correct answer was ${result.correctAnswer.toUpperCase()}.`;
        
        this.showAlert(message, alertType, 5000);
    }
    
    showAlert(message, type = 'info', duration = 3000) {
        const alertArea = document.getElementById('alert-area');
        const alertId = 'alert-' + Date.now();
        
        const alertHtml = `
            <div id=\"${alertId}\" class=\"alert alert-${type} alert-dismissible fade show\" role=\"alert\">
                ${message}
                <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\"></button>
            </div>
        `;
        
        alertArea.innerHTML = alertHtml + alertArea.innerHTML;
        
        // Auto-dismiss after duration
        setTimeout(() => {
            const alertElement = document.getElementById(alertId);
            if (alertElement) {
                const alert = bootstrap.Alert.getOrCreateInstance(alertElement);
                alert.close();
            }
        }, duration);
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new QuizBettingApp();
});

// Global functions for HTML onclick handlers
function logout() {
    // Logout disabled in demo mode
    app.showAlert('Logout is disabled in demo mode', 'info');
}

function loadNewQuestion(categoryId = null) {
    app.loadNewQuestion(categoryId);
}
