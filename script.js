/**
 * QUIZMO - Interactive Quiz Application
 * Pure Vanilla JavaScript Implementation
 */

// ==========================================
// State Management
// ==========================================
const state = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    answers: [], // { questionIndex, selectedAnswer, isCorrect, isSkipped }
    settings: {
        timerEnabled: false,
        timePerQuestion: 30,
        showAnswerAfterEach: true,
        shuffleQuestions: false
    },
    timer: {
        remaining: 0,
        interval: null
    },
    quizStartTime: null,
    quizEndTime: null,
    theme: 'system'
};

// ==========================================
// DOM Elements
// ==========================================
const elements = {
    // Screens
    homeScreen: document.getElementById('home-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultsScreen: document.getElementById('results-screen'),
    
    // Theme
    themeBtn: document.getElementById('theme-btn'),
    themeDropdown: document.getElementById('theme-dropdown'),
    
    // Home Screen
    tabs: document.querySelectorAll('.tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    jsonInput: document.getElementById('json-input'),
    fileInput: document.getElementById('file-input'),
    dropZone: document.getElementById('drop-zone'),
    fileName: document.getElementById('file-name'),
    startQuizBtn: document.getElementById('start-quiz-btn'),
    errorMessage: document.getElementById('error-message'),
    
    // Settings
    timerToggle: document.getElementById('timer-toggle'),
    timerSettings: document.getElementById('timer-settings'),
    timePerQuestion: document.getElementById('time-per-question'),
    showAnswerToggle: document.getElementById('show-answer-toggle'),
    shuffleToggle: document.getElementById('shuffle-toggle'),
    
    // Quiz Screen
    currentQuestion: document.getElementById('current-question'),
    totalQuestions: document.getElementById('total-questions'),
    progressFill: document.getElementById('progress-fill'),
    quizTimer: document.getElementById('quiz-timer'),
    timerDisplay: document.getElementById('timer-display'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    nextBtn: document.getElementById('next-btn'),
    quitBtn: document.getElementById('quit-btn'),
    
    // Results Screen
    trophyContainer: document.getElementById('trophy-container'),
    resultsMessage: document.getElementById('results-message'),
    scorePercentage: document.getElementById('score-percentage'),
    scoreRingFill: document.getElementById('score-ring-fill'),
    correctCount: document.getElementById('correct-count'),
    incorrectCount: document.getElementById('incorrect-count'),
    skippedCount: document.getElementById('skipped-count'),
    timeTaken: document.getElementById('time-taken'),
    reviewSection: document.getElementById('review-section'),
    reviewList: document.getElementById('review-list'),
    retryBtn: document.getElementById('retry-btn'),
    newQuizBtn: document.getElementById('new-quiz-btn'),
    
    // Confetti
    confettiContainer: document.getElementById('confetti-container'),
    
    // Welcome Modal
    welcomeModal: document.getElementById('welcome-modal'),
    closeWelcome: document.getElementById('close-welcome'),
    getStartedBtn: document.getElementById('get-started-btn'),
    dontShowAgain: document.getElementById('dont-show-again'),
    helpBtn: document.getElementById('help-btn'),
    copyPromptBtn: document.getElementById('copy-prompt'),
    aiPrompt: document.getElementById('ai-prompt')
};

// ==========================================
// Theme Management
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem('quizmo-theme') || 'system';
    setTheme(savedTheme);
}

function setTheme(theme) {
    state.theme = theme;
    localStorage.setItem('quizmo-theme', theme);
    
    // Set the data-theme attribute for icon display
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update active state in dropdown
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    
    // Determine actual theme (resolve system preference)
    let actualTheme = theme;
    if (theme === 'system') {
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Apply the actual theme colors via CSS variables
    applyThemeColors(actualTheme);
    
    // Update body class for theme-specific styling
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${actualTheme}`);
}

function applyThemeColors(actualTheme) {
    const root = document.documentElement;
    
    if (actualTheme === 'dark') {
        root.style.setProperty('--bg-primary', '#0f0f1a');
        root.style.setProperty('--bg-secondary', '#1a1a2e');
        root.style.setProperty('--text-primary', '#f0f0f5');
        root.style.setProperty('--text-secondary', '#b0b0c0');
        root.style.setProperty('--text-muted', '#6a6a80');
        root.style.setProperty('--glass-bg', 'rgba(30, 30, 50, 0.7)');
        root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
        root.style.setProperty('--glass-shadow', 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--input-bg', 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--input-border', 'rgba(255, 255, 255, 0.1)');
        root.style.setProperty('--code-bg', 'rgba(102, 126, 234, 0.2)');
        root.style.setProperty('--orb-1', 'rgba(102, 126, 234, 0.3)');
        root.style.setProperty('--orb-2', 'rgba(118, 75, 162, 0.25)');
        root.style.setProperty('--orb-3', 'rgba(240, 147, 251, 0.2)');
    } else {
        root.style.setProperty('--bg-primary', '#f0f4ff');
        root.style.setProperty('--bg-secondary', '#ffffff');
        root.style.setProperty('--text-primary', '#1a1a2e');
        root.style.setProperty('--text-secondary', '#4a4a6a');
        root.style.setProperty('--text-muted', '#8888a0');
        root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
        root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.5)');
        root.style.setProperty('--glass-shadow', 'rgba(31, 38, 135, 0.15)');
        root.style.setProperty('--input-bg', 'rgba(255, 255, 255, 0.5)');
        root.style.setProperty('--input-border', 'rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--code-bg', 'rgba(102, 126, 234, 0.1)');
        root.style.setProperty('--orb-1', 'rgba(102, 126, 234, 0.4)');
        root.style.setProperty('--orb-2', 'rgba(118, 75, 162, 0.3)');
        root.style.setProperty('--orb-3', 'rgba(240, 147, 251, 0.3)');
    }
}

function toggleThemeDropdown() {
    elements.themeDropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!elements.themeBtn.contains(e.target) && !elements.themeDropdown.contains(e.target)) {
        elements.themeDropdown.classList.remove('show');
    }
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (state.theme === 'system') {
        // Re-apply theme when system preference changes
        setTheme('system');
    }
});

// ==========================================
// Tab Management
// ==========================================
function switchTab(tabName) {
    elements.tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
}

// ==========================================
// File Handling
// ==========================================
function handleFileSelect(file) {
    if (!file) return;
    
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        showError('Please select a valid JSON file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        elements.jsonInput.value = e.target.result;
        elements.fileName.textContent = `Selected: ${file.name}`;
        validateJSON();
    };
    reader.onerror = () => {
        showError('Error reading file');
    };
    reader.readAsText(file);
}

function handleDragOver(e) {
    e.preventDefault();
    elements.dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    elements.dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    elements.dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
}

// ==========================================
// JSON Validation
// ==========================================
function validateJSON() {
    const input = elements.jsonInput.value.trim();
    
    if (!input) {
        elements.startQuizBtn.disabled = true;
        hideError();
        return false;
    }
    
    try {
        const data = JSON.parse(input);
        
        if (!Array.isArray(data)) {
            showError('JSON must be an array of questions');
            elements.startQuizBtn.disabled = true;
            return false;
        }
        
        if (data.length === 0) {
            showError('Quiz must have at least one question');
            elements.startQuizBtn.disabled = true;
            return false;
        }
        
        // Validate each question
        for (let i = 0; i < data.length; i++) {
            const q = data[i];
            
            if (!q.question || typeof q.question !== 'string') {
                showError(`Question ${i + 1}: Missing or invalid "question" field`);
                elements.startQuizBtn.disabled = true;
                return false;
            }
            
            if (!q.answer || typeof q.answer !== 'string') {
                showError(`Question ${i + 1}: Missing or invalid "answer" field`);
                elements.startQuizBtn.disabled = true;
                return false;
            }
            
            // Auto-detect question type if not specified
            if (!q.type) {
                q.type = q.options && Array.isArray(q.options) && q.options.length > 0 
                    ? 'multiple-choice' 
                    : 'text-input';
            }
            
            // Validate based on type
            if (q.type === 'multiple-choice') {
                if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
                    showError(`Question ${i + 1}: Multiple-choice questions need at least 2 options`);
                    elements.startQuizBtn.disabled = true;
                    return false;
                }
                
                // Check if answer matches one of the options (case-insensitive)
                const answerLower = q.answer.toLowerCase().trim();
                const optionsLower = q.options.map(opt => String(opt).toLowerCase().trim());
                
                if (!optionsLower.includes(answerLower)) {
                    showError(`Question ${i + 1}: Answer must match one of the options`);
                    elements.startQuizBtn.disabled = true;
                    return false;
                }
            } else if (q.type === 'text-input') {
                // Text input questions don't need options
                if (!q.answer || q.answer.trim() === '') {
                    showError(`Question ${i + 1}: Text-input questions need a valid answer`);
                    elements.startQuizBtn.disabled = true;
                    return false;
                }
            } else {
                showError(`Question ${i + 1}: Invalid type "${q.type}". Use "multiple-choice" or "text-input"`);
                elements.startQuizBtn.disabled = true;
                return false;
            }
        }
        
        state.questions = data;
        elements.startQuizBtn.disabled = false;
        hideError();
        return true;
        
    } catch (e) {
        showError(`Invalid JSON format: ${e.message}`);
        elements.startQuizBtn.disabled = true;
        return false;
    }
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.add('show');
}

function hideError() {
    elements.errorMessage.classList.remove('show');
}

// ==========================================
// Settings Management
// ==========================================
function updateSettings() {
    state.settings.timerEnabled = elements.timerToggle.checked;
    state.settings.timePerQuestion = parseInt(elements.timePerQuestion.value) || 30;
    state.settings.showAnswerAfterEach = elements.showAnswerToggle.checked;
    state.settings.shuffleQuestions = elements.shuffleToggle.checked;
    
    // Show/hide timer settings
    elements.timerSettings.classList.toggle('show', state.settings.timerEnabled);
}

// ==========================================
// Screen Management
// ==========================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ==========================================
// Quiz Logic
// ==========================================
function startQuiz() {
    if (!validateJSON()) return;
    
    // Update settings
    updateSettings();
    
    // Shuffle questions if enabled
    if (state.settings.shuffleQuestions) {
        state.questions = shuffleArray([...state.questions]);
    }
    
    // Reset state
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.answers = [];
    state.quizStartTime = Date.now();
    state.quizEndTime = null;
    
    // Update UI
    elements.totalQuestions.textContent = state.questions.length;
    elements.quizTimer.classList.toggle('hidden', !state.settings.timerEnabled);
    
    // Show quiz screen
    showScreen('quiz-screen');
    
    // Load first question
    loadQuestion();
}

function loadQuestion() {
    const question = state.questions[state.currentQuestionIndex];
    const questionNumber = state.currentQuestionIndex + 1;
    
    // Update progress
    elements.currentQuestion.textContent = questionNumber;
    const progress = (questionNumber / state.questions.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
    
    // Update question text
    elements.questionText.textContent = question.question;
    
    // Clear options container
    elements.optionsContainer.innerHTML = '';
    
    // Render based on question type
    if (question.type === 'text-input') {
        renderTextInputQuestion();
    } else {
        renderMultipleChoiceQuestion(question);
    }
    
    // Reset next button
    elements.nextBtn.disabled = true;
    elements.nextBtn.querySelector('span').textContent = 
        state.currentQuestionIndex === state.questions.length - 1 ? 'Finish Quiz' : 'Next Question';
    
    // Start timer if enabled
    if (state.settings.timerEnabled) {
        startTimer();
    }
}

function renderMultipleChoiceQuestion(question) {
    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerHTML = `
            <span class="option-marker">${optionLetters[index]}</span>
            <span class="option-text">${escapeHTML(option)}</span>
            <svg class="option-icon check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg class="option-icon cross" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        button.addEventListener('click', () => selectOption(button, option));
        elements.optionsContainer.appendChild(button);
    });
}

function renderTextInputQuestion() {
    const inputContainer = document.createElement('div');
    inputContainer.className = 'text-answer-container';
    inputContainer.innerHTML = `
        <label for="text-answer-input" class="text-answer-label">Type your answer:</label>
        <input 
            type="text" 
            id="text-answer-input" 
            class="text-answer-input" 
            placeholder="Enter your answer here..."
            autocomplete="off"
        >
        <button class="btn btn-primary submit-answer-btn" id="submit-text-answer">
            <span>Submit Answer</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </button>
        <div class="text-answer-feedback" id="text-answer-feedback"></div>
    `;
    elements.optionsContainer.appendChild(inputContainer);
    
    const input = document.getElementById('text-answer-input');
    const submitBtn = document.getElementById('submit-text-answer');
    
    // Enable submit when user types
    input.addEventListener('input', () => {
        submitBtn.disabled = input.value.trim() === '';
    });
    
    // Submit on Enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== '') {
            submitTextAnswer();
        }
    });
    
    submitBtn.addEventListener('click', submitTextAnswer);
    
    // Focus on input
    setTimeout(() => input.focus(), 100);
}

function submitTextAnswer() {
    const input = document.getElementById('text-answer-input');
    const submitBtn = document.getElementById('submit-text-answer');
    const feedback = document.getElementById('text-answer-feedback');
    const userAnswer = input.value.trim();
    
    if (!userAnswer) return;
    
    const question = state.questions[state.currentQuestionIndex];
    
    // Case-insensitive comparison
    const isCorrect = userAnswer.toLowerCase() === question.answer.toLowerCase();
    
    // Disable input and button
    input.disabled = true;
    submitBtn.disabled = true;
    
    // Stop timer
    stopTimer();
    
    // Record answer
    state.answers.push({
        questionIndex: state.currentQuestionIndex,
        selectedAnswer: userAnswer,
        isCorrect: isCorrect,
        isSkipped: false
    });
    
    if (isCorrect) {
        state.score++;
    }
    
    // Show feedback
    input.classList.add(isCorrect ? 'correct' : 'incorrect');
    feedback.className = 'text-answer-feedback ' + (isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
        feedback.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Correct! 🎉</span>
        `;
        createConfetti(20);
    } else {
        feedback.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>Incorrect. The correct answer is: <strong>${escapeHTML(question.answer)}</strong></span>
        `;
    }
    
    feedback.style.display = 'flex';
    
    // Enable next button
    elements.nextBtn.disabled = false;
}

function selectOption(button, selectedAnswer) {
    const question = state.questions[state.currentQuestionIndex];
    
    // Case-insensitive comparison for multiple-choice
    const isCorrect = selectedAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim();
    
    // Check if answer is already locked (when showAnswerAfterEach is true and answered)
    if (elements.optionsContainer.querySelector('.correct, .incorrect')) {
        return;
    }
    
    // If showAnswerAfterEach is disabled, allow changing selection
    if (!state.settings.showAnswerAfterEach) {
        // Remove previous selection
        const previousSelected = elements.optionsContainer.querySelector('.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // Remove previous answer record for this question
        state.answers = state.answers.filter(a => a.questionIndex !== state.currentQuestionIndex);
        
        // Recalculate score
        state.score = state.answers.filter(a => a.isCorrect).length;
        
        // Mark as selected
        button.classList.add('selected');
        
        // Record answer
        state.answers.push({
            questionIndex: state.currentQuestionIndex,
            selectedAnswer: selectedAnswer,
            isCorrect: isCorrect,
            isSkipped: false
        });
        
        if (isCorrect) {
            state.score++;
        }
        
        // Enable next button
        elements.nextBtn.disabled = false;
        return;
    }
    
    // If showAnswerAfterEach is true, lock the answer
    // Prevent selecting if already answered
    if (elements.optionsContainer.querySelector('.selected')) {
        return;
    }
    
    // Stop timer
    stopTimer();
    
    // Record answer
    state.answers.push({
        questionIndex: state.currentQuestionIndex,
        selectedAnswer: selectedAnswer,
        isCorrect: isCorrect,
        isSkipped: false
    });
    
    if (isCorrect) {
        state.score++;
    }
    
    // Show feedback - mark selected option
    button.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    // If incorrect, show correct answer
    if (!isCorrect) {
        const options = elements.optionsContainer.querySelectorAll('.option-btn');
        options.forEach(opt => {
            if (opt.querySelector('.option-text').textContent === question.answer) {
                opt.classList.add('correct');
            }
        });
    }
    
    // Disable all options
    elements.optionsContainer.querySelectorAll('.option-btn').forEach(opt => {
        opt.disabled = true;
    });
    
    // Show pop effect for correct answer
    if (isCorrect) {
        showCorrectPopup(button);
        createConfetti();
    }
    
    // Enable next button
    elements.nextBtn.disabled = false;
}

function nextQuestion() {
    // Check if current question was skipped (no answer recorded)
    const hasAnswered = state.answers.some(a => a.questionIndex === state.currentQuestionIndex);
    
    if (!hasAnswered) {
        // Record as skipped
        state.answers.push({
            questionIndex: state.currentQuestionIndex,
            selectedAnswer: null,
            isCorrect: false,
            isSkipped: true
        });
    }
    
    // Stop timer
    stopTimer();
    
    // Move to next question or finish
    if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex++;
        loadQuestion();
    } else {
        finishQuiz();
    }
}

function skipQuestion() {
    stopTimer();
    
    // Record as skipped
    state.answers.push({
        questionIndex: state.currentQuestionIndex,
        selectedAnswer: null,
        isCorrect: false,
        isSkipped: true
    });
    
    // Move to next or finish
    if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex++;
        loadQuestion();
    } else {
        finishQuiz();
    }
}

function quitQuiz() {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
        stopTimer();
        showScreen('home-screen');
    }
}

function finishQuiz() {
    state.quizEndTime = Date.now();
    stopTimer();
    
    // Calculate stats
    const totalQuestions = state.questions.length;
    const correctAnswers = state.answers.filter(a => a.isCorrect).length;
    const incorrectAnswers = state.answers.filter(a => !a.isCorrect && !a.isSkipped).length;
    const skippedAnswers = state.answers.filter(a => a.isSkipped).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Time taken
    const timeTaken = Math.round((state.quizEndTime - state.quizStartTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    
    // Update results UI
    elements.correctCount.textContent = correctAnswers;
    elements.incorrectCount.textContent = incorrectAnswers;
    elements.skippedCount.textContent = skippedAnswers;
    elements.timeTaken.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Animate score
    animateScore(percentage);
    
    // Set trophy and message
    setResultsMessage(percentage);
    
    // Generate review
    generateReview();
    
    // Show results screen
    showScreen('results-screen');
    
    // Celebrate if good score
    if (percentage >= 70) {
        setTimeout(() => createConfetti(50), 500);
    }
}

function animateScore(percentage) {
    const circumference = 339.292; // 2 * PI * 54 (radius)
    const offset = circumference - (percentage / 100) * circumference;
    
    // Reset first
    elements.scoreRingFill.style.strokeDashoffset = circumference;
    elements.scorePercentage.textContent = '0%';
    
    // Animate after a short delay
    setTimeout(() => {
        elements.scoreRingFill.style.strokeDashoffset = offset;
        
        // Animate percentage number
        let current = 0;
        const increment = percentage / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= percentage) {
                current = percentage;
                clearInterval(timer);
            }
            elements.scorePercentage.textContent = `${Math.round(current)}%`;
        }, 30);
    }, 100);
}

function setResultsMessage(percentage) {
    let message, trophyClass;
    
    if (percentage >= 90) {
        message = 'Outstanding! You\'re a quiz master! 🏆';
        trophyClass = 'gold';
    } else if (percentage >= 70) {
        message = 'Great job! Well done! 🌟';
        trophyClass = 'gold';
    } else if (percentage >= 50) {
        message = 'Good effort! Keep practicing! 💪';
        trophyClass = 'silver';
    } else if (percentage >= 30) {
        message = 'Room for improvement. Try again! 📚';
        trophyClass = 'bronze';
    } else {
        message = 'Don\'t give up! Practice makes perfect! 🎯';
        trophyClass = 'bronze';
    }
    
    elements.resultsMessage.textContent = message;
    elements.trophyContainer.className = 'trophy-container ' + trophyClass;
}

function generateReview() {
    elements.reviewList.innerHTML = '';
    
    state.questions.forEach((question, index) => {
        const answer = state.answers.find(a => a.questionIndex === index);
        const isCorrect = answer?.isCorrect || false;
        const isSkipped = answer?.isSkipped || false;
        
        const item = document.createElement('div');
        item.className = `review-item ${isCorrect ? 'correct' : isSkipped ? 'skipped' : 'incorrect'}`;
        
        let statusText = '';
        if (isCorrect) {
            statusText = '<span class="your-answer">✓ Correct</span>';
        } else if (isSkipped) {
            statusText = `<span class="your-answer">⏭ Skipped</span>
                         <span class="correct-answer">Correct: ${escapeHTML(question.answer)}</span>`;
        } else {
            statusText = `<span class="your-answer">✗ Your answer: ${escapeHTML(answer?.selectedAnswer || 'None')}</span>
                         <span class="correct-answer">✓ Correct: ${escapeHTML(question.answer)}</span>`;
        }
        
        item.innerHTML = `
            <p class="review-question">${index + 1}. ${escapeHTML(question.question)}</p>
            <div class="review-answers">${statusText}</div>
        `;
        
        elements.reviewList.appendChild(item);
    });
}

function retryQuiz() {
    // Reset and restart with same questions
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.answers = [];
    state.quizStartTime = Date.now();
    state.quizEndTime = null;
    
    showScreen('quiz-screen');
    loadQuestion();
}

function newQuiz() {
    // Go back to home screen
    state.questions = [];
    state.answers = [];
    elements.jsonInput.value = '';
    elements.fileName.textContent = '';
    elements.startQuizBtn.disabled = true;
    
    showScreen('home-screen');
}

// ==========================================
// Timer Logic
// ==========================================
function startTimer() {
    state.timer.remaining = state.settings.timePerQuestion;
    updateTimerDisplay();
    
    state.timer.interval = setInterval(() => {
        state.timer.remaining--;
        updateTimerDisplay();
        
        // Warning states
        if (state.timer.remaining <= 10 && state.timer.remaining > 5) {
            elements.quizTimer.classList.add('warning');
            elements.quizTimer.classList.remove('danger');
        } else if (state.timer.remaining <= 5) {
            elements.quizTimer.classList.remove('warning');
            elements.quizTimer.classList.add('danger');
        } else {
            elements.quizTimer.classList.remove('warning', 'danger');
        }
        
        if (state.timer.remaining <= 0) {
            timeUp();
        }
    }, 1000);
}

function stopTimer() {
    if (state.timer.interval) {
        clearInterval(state.timer.interval);
        state.timer.interval = null;
    }
    elements.quizTimer.classList.remove('warning', 'danger');
}

function updateTimerDisplay() {
    const minutes = Math.floor(state.timer.remaining / 60);
    const seconds = state.timer.remaining % 60;
    elements.timerDisplay.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function timeUp() {
    stopTimer();
    
    // Auto-skip question
    skipQuestion();
}

// ==========================================
// Visual Effects
// ==========================================
function showCorrectPopup(button) {
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <p>Correct! 🎉</p>
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('hide');
        setTimeout(() => popup.remove(), 300);
    }, 800);
}

function createConfetti(count = 30) {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#10b981', '#ffd700', '#ff6b6b'];
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            // Random shapes
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            } else {
                confetti.style.borderRadius = '2px';
                confetti.style.width = '8px';
                confetti.style.height = '12px';
            }
            
            elements.confettiContainer.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}

// ==========================================
// Utility Functions
// ==========================================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ==========================================
// Event Listeners
// ==========================================
function initEventListeners() {
    // Theme
    elements.themeBtn.addEventListener('click', toggleThemeDropdown);
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.dataset.theme);
            elements.themeDropdown.classList.remove('show');
        });
    });
    
    // Tabs
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // File handling
    elements.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
        // Reset the input so the same file can be selected again
        e.target.value = '';
    });
    elements.dropZone.addEventListener('dragover', handleDragOver);
    elements.dropZone.addEventListener('dragleave', handleDragLeave);
    elements.dropZone.addEventListener('drop', handleDrop);
    elements.dropZone.addEventListener('click', (e) => {
        // Prevent triggering if clicking on the label or input (they handle it natively)
        if (e.target.tagName === 'LABEL' || e.target.tagName === 'INPUT' || e.target.closest('label')) {
            return;
        }
        elements.fileInput.click();
    });
    
    // JSON input
    elements.jsonInput.addEventListener('input', validateJSON);
    
    // Settings
    elements.timerToggle.addEventListener('change', updateSettings);
    elements.timePerQuestion.addEventListener('change', updateSettings);
    elements.showAnswerToggle.addEventListener('change', updateSettings);
    elements.shuffleToggle.addEventListener('change', updateSettings);
    
    // Quiz controls
    elements.startQuizBtn.addEventListener('click', startQuiz);
    elements.nextBtn.addEventListener('click', nextQuestion);
    elements.quitBtn.addEventListener('click', quitQuiz);
    
    // Results controls
    elements.retryBtn.addEventListener('click', retryQuiz);
    elements.newQuizBtn.addEventListener('click', newQuiz);
    
    // Welcome modal controls
    elements.closeWelcome.addEventListener('click', hideWelcomeModal);
    elements.getStartedBtn.addEventListener('click', hideWelcomeModal);
    elements.helpBtn.addEventListener('click', showWelcomeModal);
    elements.copyPromptBtn.addEventListener('click', copyAIPrompt);
    document.getElementById('copy-structure').addEventListener('click', copyJSONStructure);
    elements.welcomeModal.addEventListener('click', (e) => {
        // Close modal when clicking overlay (outside modal content)
        if (e.target === elements.welcomeModal) {
            hideWelcomeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Close modal with Escape key
        if (e.key === 'Escape' && elements.welcomeModal.classList.contains('show')) {
            hideWelcomeModal();
            return;
        }
        
        if (elements.quizScreen.classList.contains('active')) {
            // Number keys for options
            if (e.key >= '1' && e.key <= '8') {
                const optionIndex = parseInt(e.key) - 1;
                const options = elements.optionsContainer.querySelectorAll('.option-btn');
                if (options[optionIndex] && !options[optionIndex].disabled) {
                    options[optionIndex].click();
                }
            }
            
            // Enter for next
            if (e.key === 'Enter' && !elements.nextBtn.disabled) {
                elements.nextBtn.click();
            }
        }
    });
}

// ==========================================
// SVG Gradient Definition
// ==========================================
function addSVGGradient() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML = `
        <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
        </defs>
    `;
    document.body.appendChild(svg);
}

// ==========================================
// Welcome Modal
// ==========================================
function initWelcomeModal() {
    const hasSeenWelcome = localStorage.getItem('quizmo-welcome-seen');
    
    if (!hasSeenWelcome) {
        showWelcomeModal();
    }
}

function showWelcomeModal() {
    elements.welcomeModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideWelcomeModal() {
    elements.welcomeModal.classList.remove('show');
    document.body.style.overflow = '';
    
    if (elements.dontShowAgain.checked) {
        localStorage.setItem('quizmo-welcome-seen', 'true');
    }
}

function copyAIPrompt() {
    const promptText = elements.aiPrompt.textContent;
    
    navigator.clipboard.writeText(promptText).then(() => {
        elements.copyPromptBtn.classList.add('copied');
        elements.copyPromptBtn.querySelector('span').textContent = 'Copied!';
        
        setTimeout(() => {
            elements.copyPromptBtn.classList.remove('copied');
            elements.copyPromptBtn.querySelector('span').textContent = 'Copy Prompt';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = promptText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        elements.copyPromptBtn.classList.add('copied');
        elements.copyPromptBtn.querySelector('span').textContent = 'Copied!';
        
        setTimeout(() => {
            elements.copyPromptBtn.classList.remove('copied');
            elements.copyPromptBtn.querySelector('span').textContent = 'Copy Prompt';
        }, 2000);
    });
}

function copyJSONStructure() {
    // Clean JSON structure without comments
    const cleanJSON = `[
  {
    "question": "What is the capital of France?",
    "options": [
      "London",
      "Berlin",
      "Paris",
      "Madrid"
    ],
    "answer": "Paris"
  },
  {
    "question": "Who wrote Romeo and Juliet?",
    "answer": "William Shakespeare",
    "type": "text-input"
  },
  {
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "answer": "4"
  }
]`;
    
    const button = document.getElementById('copy-structure');
    
    navigator.clipboard.writeText(cleanJSON).then(() => {
        button.classList.add('copied');
        button.querySelector('span').textContent = 'Copied!';
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.querySelector('span').textContent = 'Copy';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = cleanJSON;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        button.classList.add('copied');
        button.querySelector('span').textContent = 'Copied!';
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.querySelector('span').textContent = 'Copy';
        }, 2000);
    });
}

// ==========================================
// Initialization
// ==========================================
function init() {
    initTheme();
    initEventListeners();
    addSVGGradient();
    updateSettings();
    initWelcomeModal();
    
    console.log('🎯 Quizmo initialized successfully!');
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
