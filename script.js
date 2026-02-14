// DOM Elements
const settingsScreen = document.getElementById('settings-screen');
const gameScreen = document.getElementById('game-screen');
const summaryScreen = document.getElementById('summary-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

// Settings elements
const minNumberInput = document.getElementById('min-number');
const maxNumberInput = document.getElementById('max-number');
const timePerExerciseInput = document.getElementById('time-per-exercise');
const totalExercisesInput = document.getElementById('total-exercises');
const rangeDisplay = document.querySelector('.range-display');
const timeDisplay = document.querySelector('.time-display');

// Game elements
const questionDisplay = document.getElementById('question-display');
const inputDisplay = document.getElementById('input-display');
const timerBar = document.getElementById('timer-bar');
const timerText = document.getElementById('timer-text');
const correctCountDisplay = document.getElementById('correct-count');
const wrongCountDisplay = document.getElementById('wrong-count');
const keyboardButtons = document.querySelectorAll('.key');

// Summary elements
const finalCorrectDisplay = document.getElementById('final-correct');
const finalWrongDisplay = document.getElementById('final-wrong');
const totalScoreDisplay = document.getElementById('total-score');

// Game state variables
let gameState = {
    minNumber: 1,
    maxNumber: 10,
    timePerExercise: 10,
    totalExercises: 10,
    currentExercise: 0,
    correctCount: 0,
    wrongCount: 0,
    currentAnswer: 0,
    currentInput: '',
    timer: null,
    timeLeft: 10,
    isAnswerSubmitted: false
};

// Initialize the game
function init() {
    // Set up event listeners for settings inputs
    minNumberInput.addEventListener('input', updateSettingsDisplay);
    maxNumberInput.addEventListener('input', updateSettingsDisplay);
    timePerExerciseInput.addEventListener('input', updateSettingsDisplay);
    totalExercisesInput.addEventListener('input', updateSettingsDisplay);
    
    // Start button event listener
    startBtn.addEventListener('click', startGame);
    
    // Restart button event listener
    restartBtn.addEventListener('click', restartGame);
    
    // Keyboard button event listeners
    keyboardButtons.forEach(button => {
        button.addEventListener('click', handleKeyPress);
    });
    
    // Initialize settings display
    updateSettingsDisplay();
}

// Update the settings display based on input values
function updateSettingsDisplay() {
    // Validate and adjust min/max numbers
    let min = parseInt(minNumberInput.value) || 1;
    let max = parseInt(maxNumberInput.value) || 10;
    
    if (min < 1) min = 1;
    if (min > 12) min = 12;
    if (max < 1) max = 1;
    if (max > 12) max = 12;
    if (min > max) {
        [min, max] = [max, min]; // Swap values
    }
    
    minNumberInput.value = min;
    maxNumberInput.value = max;
    
    // Update range display
    rangeDisplay.textContent = `${min} до ${max}`;
    
    // Validate time per exercise
    let time = parseInt(timePerExerciseInput.value) || 10;
    if (time < 3) time = 3;
    if (time > 60) time = 60;
    timePerExerciseInput.value = time;
    timeDisplay.textContent = `${time} секунд`;
    
    // Validate total exercises
    let exercises = parseInt(totalExercisesInput.value) || 10;
    if (exercises < 1) exercises = 1;
    if (exercises > 100) exercises = 100;
    totalExercisesInput.value = exercises;
    document.querySelector('.setting-group:last-child .range-display').textContent = 
        `${exercises} вправ`;
}

// Start the game with current settings
function startGame() {
    // Get settings values
    gameState.minNumber = parseInt(minNumberInput.value);
    gameState.maxNumber = parseInt(maxNumberInput.value);
    gameState.timePerExercise = parseInt(timePerExerciseInput.value);
    gameState.totalExercises = parseInt(totalExercisesInput.value);
    
    // Reset game state
    gameState.currentExercise = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.currentInput = '';
    
    // Update UI
    correctCountDisplay.textContent = '0';
    wrongCountDisplay.textContent = '0';
    inputDisplay.textContent = '0';
    inputDisplay.classList.remove('wrong');
    
    // Switch screens
    settingsScreen.style.display = 'none';
    summaryScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    // Generate first question
    generateQuestion();
}

// Generate a new multiplication question
function generateQuestion() {
    // Clear any existing timers
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    // Reset input
    gameState.currentInput = '';
    inputDisplay.textContent = '0';
    inputDisplay.classList.remove('wrong');
    gameState.isAnswerSubmitted = false;
    
    // Generate random numbers within range
    const a = Math.floor(Math.random() * (gameState.maxNumber - gameState.minNumber + 1)) + gameState.minNumber;
    const b = Math.floor(Math.random() * (gameState.maxNumber - gameState.minNumber + 1)) + gameState.minNumber;
    
    // Calculate answer
    gameState.currentAnswer = a * b;
    
    // Display question
    questionDisplay.textContent = `${a} × ${b} = ?`;
    
    // Reset and start timer
    gameState.timeLeft = gameState.timePerExercise;
    timerText.textContent = gameState.timeLeft;
    timerBar.style.width = '100%';
    
    // Start countdown timer
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        timerText.textContent = gameState.timeLeft;
        timerBar.style.width = `${(gameState.timeLeft / gameState.timePerExercise) * 100}%`;
        
        // Time's up
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            
            // Only count as wrong if answer wasn't submitted correctly
            if (!gameState.isAnswerSubmitted) {
                gameState.wrongCount++;
                wrongCountDisplay.textContent = gameState.wrongCount;
                
                // Show correct answer briefly
                questionDisplay.textContent = `${questionDisplay.textContent.split('=')[0]}= ${gameState.currentAnswer}`;
                inputDisplay.textContent = gameState.currentAnswer;
                inputDisplay.classList.add('wrong');
                
                // Move to next question after delay
                setTimeout(() => {
                    gameState.currentExercise++;
                    
                    if (gameState.currentExercise >= gameState.totalExercises) {
                        endGame();
                    } else {
                        generateQuestion();
                    }
                }, 1200);
            }
        }
    }, 1000);
}

// Handle key press from virtual keyboard
function handleKeyPress(e) {
    const value = e.target.dataset.value;
    const keyType = e.target.classList.contains('backspace') ? 'backspace' : 
                   e.target.classList.contains('enter') ? 'enter' : 'number';
    
    // Handle backspace
    if (keyType === 'backspace') {
        gameState.currentInput = gameState.currentInput.slice(0, -1) || '0';
    } 
    // Handle enter/OK
    else if (keyType === 'enter') {
        submitAnswer();
    } 
    // Handle number input
    else if (keyType === 'number') {
        // Don't allow input longer than the answer could be
        if (gameState.currentInput.length < String(gameState.currentAnswer).length + 1) {
            if (gameState.currentInput === '0') {
                gameState.currentInput = value;
            } else {
                gameState.currentInput += value;
            }
        }
    }
    
    // Update display
    inputDisplay.textContent = gameState.currentInput || '0';
}

// Submit the answer and check if correct
function submitAnswer() {
    // Don't process if no input or already submitted
    if (!gameState.currentInput || gameState.isAnswerSubmitted) return;
    
    const userAnswer = parseInt(gameState.currentInput);
    
    // Check answer
    if (userAnswer === gameState.currentAnswer) {
        // Correct answer
        gameState.isAnswerSubmitted = true;
        clearInterval(gameState.timer);
        
        gameState.correctCount++;
        correctCountDisplay.textContent = gameState.correctCount;
        
        // Visual feedback
        inputDisplay.classList.remove('wrong');
        questionDisplay.textContent = questionDisplay.textContent.replace('?', `= ${gameState.currentAnswer} ✓`);
        
        // Move to next question after delay
        setTimeout(() => {
            gameState.currentExercise++;
            
            if (gameState.currentExercise >= gameState.totalExercises) {
                endGame();
            } else {
                generateQuestion();
            }
        }, 800);
    } else {
        // Wrong answer
        inputDisplay.classList.add('wrong');
        
        // Shake animation
        inputDisplay.offsetWidth; // Trigger reflow
        inputDisplay.classList.add('wrong');
        
        // Allow trying again (don't mark as wrong yet - only when time runs out)
    }
}

// End the game and show summary
function endGame() {
    // Clear any remaining timers
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    // Calculate score percentage
    const total = gameState.correctCount + gameState.wrongCount;
    const scorePercent = total > 0 ? Math.round((gameState.correctCount / total) * 100) : 0;
    
    // Update summary screen
    finalCorrectDisplay.textContent = gameState.correctCount;
    finalWrongDisplay.textContent = gameState.wrongCount;
    totalScoreDisplay.textContent = scorePercent;
    
    // Show confetti effect
    createConfetti();
    
    // Switch screens
    gameScreen.style.display = 'none';
    summaryScreen.style.display = 'block';
}

// Restart the game
function restartGame() {
    summaryScreen.style.display = 'none';
    settingsScreen.style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Create confetti effect for celebration
function createConfetti() {
    const colors = ['#ff5252', '#ff4081', '#e040fb', '#7c4dff', '#536dfe', '#448aff', '#40c4ff', '#18ffff', '#64ffda', '#69f0ae', '#b2ff59', '#eeff41', '#ffff00', '#ffd740', '#ffab40', '#ff6e40'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random position, size, color and animation
        const size = Math.random() * 10 + 5;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const rotation = Math.random() * 360;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.transform = `rotate(${rotation}deg)`;
        confetti.style.left = `${posX}%`;
        confetti.style.top = `${posY}%`;
        confetti.style.opacity = Math.random();
        confetti.style.zIndex = '1000';
        
        // Animation
        const animationDuration = Math.random() * 3 + 2;
        const delay = Math.random() * 1;
        
        confetti.style.animation = `fall ${animationDuration}s ease-in ${delay}s forwards`;
        confetti.style.animationFillMode = 'forwards';
        
        // Add keyframes dynamically
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fall {
                to {
                    transform: translate(${Math.random() * 100 - 50}px, ${window.innerHeight}px) rotate(${rotation + 360}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
            style.remove();
        }, (animationDuration + delay) * 1000);
    }
}

// Initialize the game when page loads
window.addEventListener('DOMContentLoaded', init);
