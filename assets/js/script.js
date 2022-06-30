var quizHeaderEl = document.querySelector(".quiz-header");
var quizContentEl = document.querySelector(".quiz-content");
var quizFooterEl = document.querySelector("footer");
var highScoreEl = document.querySelector(".high-score");
var timerEl = document.querySelector(".timer");
var headerEl = document.querySelector("header");

var timer = 100;
var currentQuestion = 0;
var timeout;

var questionBankObj = [
    { 
        question: "Who is the President of the United States?",
        answer: 3,
        choice: ["Martha Stewart", "George Bush", "Joe Biden", "Donald Trump"]
    },
    {
        question: "Is Earth round?",
        answer: 2,
        choice: ["No", "yes", "Maybe", "Flat"]
    },
    {
        question: "How many world series wins do that Yankees have?",
        answer: 2,
        choice: ["10", "27", "6", "13"]
    },
    {
        question: "String values must be enclosed within ____ when being assigned to variables",
        answer: 2,
        choice: ["commas", "curly brackets", "quotes", "parenthesis"]
    },
    {
        question: "What is the best original stater Pokemon?",
        answer: 3,
        choice: ["Squirtle", "Bulbasaur", "Charmander", "Piplup"]
    }
];

var countDown = function () {
    if (timer > 0) {
        timer--;
        timerEl.textContent = timer;
        timeout = setTimeout(countDown, 1000);
        
    }
    else {
        console.log("ran out of time");
        clearTimeout(timeout);
    }
};

var quizContentHandler = function (event) {
    console.log(event.target);
    if (event.target.getAttribute("id") === "start") {
        console.log(true);
       
        countDown();
        
        buildQuestion(questionBankObj[currentQuestion]);
        return;
    }
    else if (event.target.getAttribute("id") === "submit") {
        
        var initialInput = document.querySelector("input[name='initials']").value;
        setHighScore(timer, initialInput);
        return;
    }
    else if (event.target.getAttribute("id") === "back") {
        resetGame();
        return;
    }
    else if (event.target.getAttribute("id") === "clear") {
        clearHighScores();
        resetGame();
        return;
    }
    else if (event.target.className === "high-score") {
        buildHighScores();
        return;
    }

    var correct = parseInt(event.target.getAttribute("data-answer-id")) === questionBankObj[currentQuestion].answer
    if (correct) {
        console.log("correct");
        setQuizFooter("Correct!");
    }
    else {
        console.log("wrong!");
        setQuizFooter("Incorrect!");
        if (timer - 10 > 0) {
            timer -= 10;
        }
        else {
            timer = 0;
        }
        
    }

    currentQuestion++;
    
    if (currentQuestion >= questionBankObj.length) {
        console.log("out questions!");
        clearTimeout(timeout);
        timerEl.textContent = timer;
        
        setTimeout(setQuizFooter, 1500,"clear");
        buildScoreSubmit();
        
    }
    else {
        
        buildQuestion(questionBankObj[currentQuestion]);
        return
    }
    
};

var setQuizHeader = function (content) {
    console.log(content);
    quizHeaderEl.innerHTML = content;
};

var setQuizFooter = function (content) {
    if (content === "clear") {
        quizFooterEl.remove();
        return;
    }
    var footerContentEl = document.createElement("h2");
    footerContentEl.className = "quiz-footer"
    footerContentEl.textContent = content;
    quizFooterEl.replaceChildren(footerContentEl);
    
};

var setQuizContent = function (element) {
    quizContentEl.replaceChildren(element);
};

var buildHighScores = function (hsArray) {

    
    headerEl.setAttribute("style", "display:none");

    if (!hsArray) {
        var score = localStorage.getItem("high-scores");
        hsArray = JSON.parse(score);
    }

    setQuizHeader("High Scores");

    var backButtonEl = document.createElement("button");
    backButtonEl.className = "button";
    backButtonEl.setAttribute("id", "back");
    backButtonEl.textContent = "Go back";

    if (hsArray) {
        var scoreOlEl = document.createElement("ol");
        scoreOlEl.className = "hs-table";
        for (var i = 0; i < hsArray.length; i++) {
            console.log(hsArray[i]);
            var scoreLiEl = document.createElement("li");
            scoreLiEl.className = "hs-entry";
            scoreLiEl.textContent = hsArray[i].initials + " - " + hsArray[i].score;
            scoreOlEl.appendChild(scoreLiEl);
        }
        quizContentEl.replaceChildren(scoreOlEl);
        
        quizContentEl.appendChild(backButtonEl);
    }
    else { 
        quizContentEl.replaceChildren(backButtonEl);
    }
    
    
    
    var clearButtonEl = document.createElement("button");
    clearButtonEl.className = "button";
    clearButtonEl.setAttribute("id", "clear");
    clearButtonEl.textContent = "Clear high scores";
    quizContentEl.appendChild(clearButtonEl);
};

var buildScoreSubmit = function () {
    setQuizHeader("All Done!<p>Your final score is " + timer + ".");
    var formEl = document.createElement("form");
    var divEl = document.createElement("div");
    divEl.className = "score-form";
    
    var inputEl = document.createElement("input");
    inputEl.setAttribute("type", "text");
    inputEl.setAttribute("name", "initials");
    inputEl.setAttribute("placeholder", "Enter Initials");
    inputEl.setAttribute("style", "margin-right:10px;font-size:24px;padding:10px");
    divEl.appendChild(inputEl);
    
    var buttonEl = document.createElement("button");
    buttonEl.className = "button";
    buttonEl.setAttribute("id", "submit");
    buttonEl.textContent = "Submit";
    divEl.appendChild(buttonEl);

    setQuizContent(divEl);
};

var buildQuestion = function (questionObj) {
    console.log(questionObj.question);
    setQuizHeader(questionObj.question);
    buildQuizChoices(questionObj.choice);
};

var buildQuizChoices = function (choiceArray) {
    var listEL = document.createElement("ol");
    
    for (var i = 0; i < choiceArray.length; i++){
        var listItemEl = document.createElement("li");
        listItemEl.className = "button";
        listItemEl.setAttribute("data-answer-id", i);
        listItemEl.textContent = choiceArray[i];
        console.log(listItemEl);
        listEL.appendChild(listItemEl);
    }
    console.log(listEL);
    
    setQuizContent(listEL);
};

var resetGame = function () {
    
    headerEl.removeAttribute("style");
    currentQuestion = 0;
    timer = 75; 
    timerEl.textContent = timer;
    setQuizHeader("Coding Quiz Challenge");
    startButtonEl = document.createElement("button");
    startButtonEl.textContent = "Start Quiz";
    startButtonEl.className = "button";
    startButtonEl.setAttribute("id", "start");
    setQuizContent(startButtonEl);
};

var clearHighScores = function () {
    confirm = window.confirm("Do you want to reset the High Scores")

    if (confirm) {
        localStorage.removeItem("high-scores");
        window.alert("High Scores have been reset!")
    }
};

var setHighScore = function (highScore, initial) {
    var score = localStorage.getItem("high-scores");
    console.log(score);
    if (!score) {
        var scoreObj = [{score:highScore,initials:initial}]
        console.log(scoreObj);
        localStorage.setItem("high-scores", JSON.stringify(scoreObj));
        return buildHighScores(scoreObj);
    }

    var scoreObj = JSON.parse(score);
    console.log(scoreObj);
    for (var i = 0; i < scoreObj.length; i++){
        console.log(scoreObj[i].score);
        if (parseInt(highScore) >= parseInt(scoreObj[i].score)) {
            var Obj = [{ score: highScore, initials: initial }];
            scoreObj.splice(i, 0, Obj[0]);
            break;
        }

        if (i === scoreObj.length - 1) { 
            var Obj = [{ score: highScore, initials: initial }];
            scoreObj.push(Obj[0]);
        }
    }

    if (scoreObj.length > 10) {
        
        console.log("popped array");
        scoreObj.pop();
    }
    console.log(scoreObj);

    localStorage.setItem("high-scores", JSON.stringify(scoreObj)); 
    
    buildHighScores(scoreObj);
};


resetGame();
highScoreEl.addEventListener("click", quizContentHandler);
quizContentEl.addEventListener("click", quizContentHandler);