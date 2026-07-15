const quizContainer =
document.getElementById("quiz");


let words = [];

let currentIndex = 0;

let selectedMeaning = null;

let selectedArticle = null;

let mistakes = 0;

let sessionNumber = 0;

let settings = {};


loadQuiz();



async function loadQuiz(){


    const params =
    new URLSearchParams(
        window.location.search
    );


    sessionNumber =
    Number(params.get("session"));



    try{

        settings = await fetchSettings();


        const sessions =
        await fetchSessions();



        const session =
        sessions.find(
            s => s.session === sessionNumber
        );



        words =
        await fetchWords(session.file);


        showQuestion();

    }

    catch(error){

        quizContainer.innerHTML =
        "<p>Error loading quiz.</p>";

        console.error(error);

    }

}





function showQuestion(){


    const word =
    words[currentIndex];


    quizContainer.innerHTML = `


    <h2>
    Question ${currentIndex + 1} / ${words.length}
    </h2>


    <h1>
    ${word.word}
    </h1>


    <h3>
    Meaning
    </h3>


    <div id="meaning-options">

    </div>



    ${
    word.article
    ?
    `
    <h3>
    Article
    </h3>

    <div id="article-options">

    </div>
    `
    :
    ""
    }


    <button id="next-btn" onclick="checkAnswer()">
    Next
    </button>


    `;


    createMeaningOptions(word);


    if(word.article){

        createArticleOptions(word);

    }


}

function createMeaningOptions(word){

    const container =
    document.getElementById("meaning-options");


    let options = [];

    options.push(word.meaning);



    while(options.length < settings.meaning_options && options.length < words.length){

        const randomWord =
        words[
            Math.floor(
                Math.random() * words.length
            )
        ];


        if(!options.includes(randomWord.meaning)){

            options.push(randomWord.meaning);

        }

    }



    options.sort(
        () => Math.random() - 0.5
    );


    options.forEach(option=>{

        container.innerHTML += `

        <button 
        class="option"
        data-value="${option}">
        ${option}
        </button>

        `;

    });


    container.querySelectorAll("button").forEach(btn=>{

        btn.addEventListener("click", function(){

            selectMeaning(this.dataset.value, this);

        });

    });

}





function createArticleOptions(word){


    const container =
    document.getElementById("article-options");


    let articles = [
        "der",
        "die",
        "das"
    ];



    articles.sort(
        () => Math.random() - 0.5
    );


    articles.forEach(article=>{


        container.innerHTML += `

        <button 
        class="option"
        data-value="${article}">
        ${article}
        </button>

        `;


    });


    container.querySelectorAll("button").forEach(btn=>{

        btn.addEventListener("click", function(){

            selectArticle(this.dataset.value, this);

        });

    });


}

function selectMeaning(answer, button){


    selectedMeaning = answer;


    document
    .querySelectorAll("#meaning-options button")
    .forEach(btn=>{
        btn.classList.remove("selected");
    });


    button.classList.add("selected");


}


function selectArticle(answer, button){


    selectedArticle = answer;


    document
    .querySelectorAll("#article-options button")
    .forEach(btn=>{
        btn.classList.remove("selected");
    });


    button.classList.add("selected");


}

function checkAnswer(){


    const word =
    words[currentIndex];



    if(!selectedMeaning){

        alert("Please select a meaning!");

        return;

    }


    if(word.article && !selectedArticle){

        alert("Please select an article!");

        return;

    }


    let correct = true;



    if(selectedMeaning !== word.meaning){

        correct = false;

    }


    if(word.article && selectedArticle !== word.article){

        correct = false;

    }


    if(!correct){

        mistakes++;

    }


    showFeedback(correct, word);

}


function showFeedback(correct, word){

    const nextBtn =
    document.getElementById("next-btn");


    nextBtn.style.display = "none";


    const feedback =
    document.createElement("div");


    feedback.className =
    correct ? "feedback-correct" : "feedback-wrong";


    let html = correct
    ? "<p>✓ Correct!</p>"
    : "<p>✗ Wrong!</p>";


    if(!correct){

        html += "<p><strong>Correct answers:</strong></p>";


        html += "<p>Meaning: " + word.meaning + "</p>";


        if(word.article){

            html += "<p>Article: " + word.article + "</p>";

        }

    }


    feedback.innerHTML = html;


    const continueBtn =
    document.createElement("button");


    continueBtn.textContent = "Continue";


    continueBtn.onclick = function(){


        currentIndex++;


        selectedMeaning = null;

        selectedArticle = null;


        if(currentIndex < words.length){

            showQuestion();

        }

        else{

            showResult();

        }

    };


    feedback.appendChild(continueBtn);


    quizContainer.appendChild(feedback);

}

function showResult(){


    if(mistakes === 0){

        saveCompletedSession(sessionNumber);

    }


    quizContainer.innerHTML = `


    <h2>
    Session finished
    </h2>


    <h1>
    ${words.length - mistakes}
    /
    ${words.length}
    </h1>


    ${
    mistakes === 0
    ?
    "<p>🎉 Session completed!</p>"
    :
    "<p>❌ Session not completed. Try again.</p>"
    }


    <div class="quiz-nav">

        <button onclick="retryQuiz()">
        Retry
        </button>


        <button onclick="goToPractice()">
        Back to Practice
        </button>

    </div>


    `;


}


function retryQuiz(){

    currentIndex = 0;

    mistakes = 0;

    selectedMeaning = null;

    selectedArticle = null;


    showQuestion();

}


function goToPractice(){

    window.location.href = "practice.html";

}