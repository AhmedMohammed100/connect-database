$(document).ready(function () {
    $(".menu-links li a").click(function (e) {
      $(".menu-links li.active").removeClass("active");
      var $parent = $(this).parent();
      $parent.addClass("active");
    });
    $(".hamburger-icon").click(function () {
      $(".menu-links").toggleClass("left");
    });
    $(".hamburger-icon").click(function () {
      $(this).toggleClass("ham-style");
    });
    const themeSwitch = document.querySelector("#checkbox");
    themeSwitch.addEventListener("change", () => {
      document.body.classList.toggle("dark-theme");
    });
    const questions = [
        {
            question: "What is the name of the first cryptocurrency ever created?",
            answers: [
                { text: "Bitcoin", correct: true },
                { text: "Ethereum", correct: false },
                { text: "Litecoin", correct: false },
                { text: "Ripple", correct: false }
            ]
        },
        {
            question: "What technology underpins cryptocurrencies like Bitcoin?",
            answers: [
                { text: "Blockchain", correct: true },
                { text: "Quantum Computing", correct: false },
                { text: "AI Networks", correct: false },
                { text: "Cloud Storage", correct: false }
            ]
        },
        {
            question: "Which of these is the primary function of Ethereum?",
            answers: [
                { text: "Smart Contracts", correct: true },
                { text: "Cross-border payments", correct: false },
                { text: "Decentralized Storage", correct: false },
                { text: "Cryptographic Proofs", correct: false }
            ]
        },
        {
            question: "What is the smallest unit of Bitcoin called?",
            answers: [
                { text: "Satoshi", correct: true },
                { text: "Ether", correct: false },
                { text: "Lite", correct: false },
                { text: "Shatoshi", correct: false }
            ]
        },
        {
            question: "What is a private key used for in cryptocurrency?",
            answers: [
                { text: "To sign transactions and prove ownership", correct: true },
                { text: "To mine new coins", correct: false },
                { text: "To create smart contracts", correct: false },
                { text: "To generate new tokens", correct: false }
            ]
        }
    ];
    
    let currentQuestionIndex = 0;
    let score = 0;
    let timeRemaining = 30; // 30 seconds per question
    let timer; // Variable for the timer interval
    let hasAnswered = false; // Track if an answer has been picked
    let firstQuestionAnswered = false; // Track when the first question is answered
    const dailyLoginPoints = 5; // Points awarded for daily login
    
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const scoreElement = document.getElementById('score');
    const timerElement = document.createElement('p'); // Timer display
    timerElement.setAttribute('id', 'timer');
    timerElement.style.display = 'none'; // Hide timer initially
    
    document.body.appendChild(timerElement); // Append the timer at the bottom of the page
    
    // Retrieve saved score from localStorage or initialize to 0
    function loadScore() {
        const savedScore = localStorage.getItem('cryptoQuizScore');
        return savedScore ? parseInt(savedScore) : 0;
    }
    
    function saveScore() {
        localStorage.setItem('cryptoQuizScore', score);
    }
    
    // Save today's date as the completion date
    function saveCompletionDate() {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        localStorage.setItem('quizCompletionDate', today);
    }
    
    // Check if the quiz was already completed today
    function quizCompletedToday() {
        const today = new Date().toISOString().split('T')[0]; // Get today's date
        const savedDate = localStorage.getItem('quizCompletionDate');
        return savedDate === today; // Returns true if the quiz was completed today
    }
    
    // Check if the user logged in today and award points if they haven't
    function checkDailyLogin() {
        const today = new Date().toISOString().split('T')[0]; // Get today's date
        const lastLoginDate = localStorage.getItem('lastLoginDate');
    
        if (lastLoginDate !== today) {
            score += dailyLoginPoints; // Award daily login points
            saveScore(); // Save the updated score
            localStorage.setItem('lastLoginDate', today); // Update last login date
        }
    }
    
    function startTimer() {
        clearInterval(timer); // Clear any existing timer
        timeRemaining = 30; // Reset the time for each question (set to 30 seconds)
        timerElement.style.display = 'block'; // Show timer after the first question is answered
        timer = setInterval(() => {
            if (timeRemaining <= 0) {
                clearInterval(timer);
                hasAnswered = true; // Allow transition to the next question
                moveToNextQuestion(); // Move to the next question
            } else {
                updateTimerDisplay();
                timeRemaining--;
            }
        }, 1000);
    }
    
    function updateTimerDisplay() {
        // Format the time as MM:SS
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerElement.innerText = `Time left for this question: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function startGame() {
        if (quizCompletedToday()) {
            // If the quiz has already been completed today, prevent restarting
            questionElement.innerText = "You have already completed the quiz today. Come back tomorrow!";
            answerButtonsElement.innerHTML = ""; // Clear any answer buttons
            return;
        }
        
        currentQuestionIndex = 0;
        score = loadScore(); // Load score from localStorage
        scoreElement.innerText = 'Score: ' + score;
        
        checkDailyLogin(); // Check daily login points
        hasAnswered = false;
        showQuestion();
    }
    
    function showQuestion() {
        resetState();
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.innerText = currentQuestion.question;
        
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('answer-btn');
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }
    
    function resetState() {
        clearInterval(timer); // Stop the previous timer
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }
    
    function selectAnswer(e) {
        if (hasAnswered) return; // Prevent multiple answers
        
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct === 'true';
        
        if (correct) {
            score += 10;
            scoreElement.innerText = 'Score: ' + score;
            saveScore(); // Save the updated score in localStorage
        }
    
        Array.from(answerButtonsElement.children).forEach(button => {
            setStatusClass(button, button.dataset.correct);
            button.disabled = true; // Disable all buttons after an answer is selected
        });
        
        hasAnswered = true; // Mark that the question has been answered
    
        // Start the timer after the first question is answered
        if (!firstQuestionAnswered) {
            firstQuestionAnswered = true;
            startTimer(); // Start the timer after the first question
        }
    
        // Delay to show if answer is correct or wrong
        setTimeout(() => {
            if (currentQuestionIndex >= questions.length - 1) {
                endGame(); 
            } else {
                moveToNextQuestion();
            }
        }, 1000); // Wait for 1 second before showing the next question
    }
    
    function moveToNextQuestion() {
        // Proceed to the next question
        currentQuestionIndex++;
        showQuestion();
        hasAnswered = false; // Reset answer flag for the next question
        startTimer(); // Restart the timer for the next question
    }
    
    function setStatusClass(element, correct) {
        element.classList.remove('correct');
        element.classList.remove('wrong');
        if (correct) {
            element.classList.add('correct');
        } else {
            element.classList.add('wrong');
        }
    }
    
    function endGame() {
        clearInterval(timer); // Clear the timer when the game ends
        questionElement.innerText = "Quiz finished! Your final score is: " + score;
        saveCompletionDate(); // Save today's date as the completion date
        resetState();
        
        // Start the countdown to the next day
        startNextDayCountdown();
    }
    
    function startNextDayCountdown() {
        clearInterval(timer); // Clear any previous timer
    
        const now = new Date();
        const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // Midnight of the next day
        const timeToNextDay = nextDay - now;
    
        // Timer to countdown to the next day (midnight)
        timer = setInterval(() => {
            const now = new Date();
            const timeRemaining = nextDay - now;
    
            if (timeRemaining <= 0) {
                clearInterval(timer);
                questionElement.innerText = "A new day has started! You can now retake the quiz.";
            } else {
                updateNextDayTimerDisplay(timeRemaining);
            }
        }, 1000);
    }
    
    function updateNextDayTimerDisplay(timeRemaining) {
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
        timerElement.style.display = 'block'; // Ensure the timer is always visible
        timerElement.innerText = `Time until the next quiz: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Initialize the game and persist score
    function initializeGame() {
        score = loadScore(); // Load score from localStorage
        scoreElement.innerText = 'Score: ' + score;
        startGame(); // Start the quiz
    }
    
    // Start the quiz
    initializeGame();
    

 // main.js (Quiz)

let quizScore = 0; // Default score
const combinedScoreElement = document.getElementById('combined-score'); // Combined score displayed here
const quizScoreElement = document.getElementById('quiz-score'); // Quiz points displayed separately here
const dailyLoginScoreElement = document.getElementById('daily-login-score'); // Daily login points displayed separately here

// Load quiz score from localStorage or initialize to 0
function loadQuizScore() {
    const savedScore = localStorage.getItem('cryptoQuizScore');
    return savedScore ? parseInt(savedScore) : 0;
}

// Save quiz score to localStorage
function saveQuizScore() {
    localStorage.setItem('cryptoQuizScore', quizScore);
}

// Function to get daily login score from localStorage
function getDailyLoginScore() {
    const dailyLoginScore = localStorage.getItem('dailyLoginScore');
    return dailyLoginScore ? parseInt(dailyLoginScore) : 0;
}

// Function to update all scores (daily login, quiz, and combined)
function updateScores() {
    // Get daily login score from localStorage
    const dailyLoginScore = getDailyLoginScore();
    
    // Display the separate scores
    dailyLoginScoreElement.innerText = `Daily Login Points: ${dailyLoginScore}`;
    quizScoreElement.innerText = `Quiz Points: ${quizScore}`;
    
    // Combine quiz and daily login scores
    const combinedScore = quizScore + dailyLoginScore;
    combinedScoreElement.innerText = `Total Score: ${combinedScore}`;
}

// Function to add quiz points and update scores
function addQuizPoints(points) {
    quizScore += points;
    saveQuizScore();
    updateScores(); // Update the combined score
}

// Initialize quiz and display the combined score at the start
function initializeQuiz() {
    quizScore = loadQuizScore(); // Load saved quiz score
    updateScores(); // Update combined score at the start
    startQuiz(); // Function to start the quiz
}

// Call this function to start
initializeQuiz();

})    