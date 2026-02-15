const translations = {
    ukr: {
        // Settings screen
        title: 'Майстер множення',
        subtitle: 'Тренуйте навички множення з розвагою!',
        selectNumbers: 'Виберіть числа для тренування:',
        timePerExercise: 'Час на вправу (секунди):',
        seconds: 'секунд',
        totalExercises: 'Кількість вправ:',
        exercises: 'вправ',
        startButton: 'ПОЧАТИ ТРЕНУВАННЯ',
        
        // Instructions
        howToPlay: 'Як грати:',
        instruction1: '• Вирішуйте приклади множення перед тим, як закінчиться час',
        instruction2: '• Використовуйте екранну клавіатуру для введення відповіді',
        instruction3: '• Правильні відповіді переводять вас до наступного завдання одразу',
        instruction4: '• Неправильні відповіді дають вам ще один шанс (але поспішайте!)',
        
        // Game screen
        gameTitle: 'Математичний виклик!',
        correct: '✓ Правильно:',
        wrong: '✗ Неправильно:',
        backspaceBtn: '⌫ Видалити',
        okBtn: 'ОК Відповідь',
        
        // Summary screen
        summaryTitle: 'Тренування завершено!',
        correctAnswers: 'Правильні відповіді:',
        wrongAnswers: 'Неправильні відповіді:',
        totalResult: 'Загальний результат:',
        restartButton: 'ТРЕНУВАТИСЯ ЗНОВУ',
        congratsText1: 'Чудова робота з практики таблиці множення!',
        congratsText2: 'Продовжуйте тренуватися, щоб стати Майстром математики!',
        
        // Alerts
        selectAtLeastOne: 'Будь ласка, виберіть хоча б один номер для тренування!',
        
        // Templates
        timeTemplate: '{value} {unit}',
        exercisesTemplate: '{value} {unit}',
    },
    en: {
        // Settings screen
        title: 'Multiplication Master',
        subtitle: 'Practice multiplication skills with fun!',
        selectNumbers: 'Select numbers to practice:',
        timePerExercise: 'Time per exercise (seconds):',
        seconds: 'seconds',
        totalExercises: 'Number of exercises:',
        exercises: 'exercises',
        startButton: 'START TRAINING',
        
        // Instructions
        howToPlay: 'How to play:',
        instruction1: '• Solve multiplication examples before time runs out',
        instruction2: '• Use the on-screen keyboard to enter your answer',
        instruction3: '• Correct answers take you to the next task immediately',
        instruction4: '• Wrong answers give you another chance (but hurry!)',
        
        // Game screen
        gameTitle: 'Math Challenge!',
        correct: '✓ Correct:',
        wrong: '✗ Wrong:',
        backspaceBtn: '⌫ Delete',
        okBtn: 'OK Answer',
        
        // Summary screen
        summaryTitle: 'Training completed!',
        correctAnswers: 'Correct answers:',
        wrongAnswers: 'Wrong answers:',
        totalResult: 'Overall result:',
        restartButton: 'PRACTICE AGAIN',
        congratsText1: 'Great work practicing multiplication!',
        congratsText2: 'Keep practicing to become a Math Master!',
        
        // Alerts
        selectAtLeastOne: 'Please select at least one number to practice!',
        
        // Templates
        timeTemplate: '{value} {unit}',
        exercisesTemplate: '{value} {unit}',
    }
};

let currentLanguage = 'ukr'; // Default language

function getTranslation(key) {
    return translations[currentLanguage][key] || translations.ukr[key];
}

function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);
        updatePageLanguage();
        updateLanguageButtonState();
    }
}

function initializeLanguage() {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'ukr';
    currentLanguage = savedLanguage;
    updatePageLanguage();
    updateLanguageButtonState();
}

function updatePageLanguage() {
    // Settings screen
    document.querySelector('.screen-title').textContent = getTranslation('title');
    document.querySelectorAll('.screen-title')[0].textContent = getTranslation('title');
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = getTranslation(key);
    });
    
    // Update time display with template
    updateTimeDisplay();
    // Update exercises display with template
    updateExercisesDisplay();
}

function updateLanguageButtonState() {
    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) {
        langBtn.textContent = currentLanguage === 'ukr' ? 'EN' : 'UKR';
    }
}

function updateTimeDisplay() {
    const timeDisplay = document.querySelector('.time-display');
    if (timeDisplay) {
        const timeValue = document.getElementById('time-per-exercise').value;
        const template = getTranslation('timeTemplate');
        const unit = getTranslation('seconds');
        timeDisplay.textContent = template.replace('{value}', timeValue).replace('{unit}', unit);
    }
}

function updateExercisesDisplay() {
    const exercisesDisplay = document.getElementById('exercises-display');
    if (exercisesDisplay) {
        const exercisesValue = document.getElementById('total-exercises').value;
        const template = getTranslation('exercisesTemplate');
        const unit = getTranslation('exercises');
        exercisesDisplay.textContent = template.replace('{value}', exercisesValue).replace('{unit}', unit);
    }
}
