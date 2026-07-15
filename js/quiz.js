const quizContainer =
document.getElementById("quiz");


let words = [];

let currentIndex = 0;

let selectedMeaning = null;

let selectedArticle = null;

let mistakes = 0;


loadQuiz();



async function loadQuiz(){


    const params =
    new URLSearchParams(
        window.location.search
    );


    const sessionNumber =
    Number(params.get("session"));



    const response =
    await fetch("data/sessions.json");


    const sessions =
    await response.json();



    const session =
    sessions.find(
        s => s.session === sessionNumber
    );



    const wordResponse =
    await fetch(
        "vocabulary/" + session.file
    );


    words =
    await wordResponse.json();



    showQuestion();

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


    <button onclick="checkAnswer()">
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



    while(options.length < 4){

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
        onclick="selectMeaning('${option}', this)">>
        ${option}
        </button>

        `;

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
        onclick="selectArticle('${article}', this)">
        ${article}
        </button>

        `;


    });


}

function selectMeaning(answer, button){


    selectedMeaning = answer;


    document
    .querySelectorAll("#meaning-options button")
    .forEach(btn=>{
        btn.style.fontWeight = "normal";
    });


    button.style.fontWeight = "bold";


}



function selectArticle(answer, button){


    selectedArticle = answer;


    document
    .querySelectorAll("#article-options button")
    .forEach(btn=>{
        btn.style.fontWeight = "normal";
    });


    button.style.fontWeight = "bold";

}

function checkAnswer(){


    const word =
    words[currentIndex];


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



    currentIndex++;



    selectedMeaning = null;

    selectedArticle = null;



    if(currentIndex < words.length){

        showQuestion();

    }

    else{

        showResult();

    }


}

function showResult(){


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


    `;


}