const vocabularyContainer =
document.getElementById("vocabulary");

const searchBox =
document.getElementById("search");


let sessions = [];

let allWords = [];



loadSessions();



async function loadSessions(){

    const response =
    await fetch("data/sessions.json");


    sessions =
    await response.json();


    displaySessions();

}



function displaySessions(){

    vocabularyContainer.innerHTML = "";


    sessions.forEach(session => {


        vocabularyContainer.innerHTML += `

        <div class="session-header"
             onclick="openSession(${session.session})">


            ▶ Session ${session.session}

            (${session.word_count} words)


        </div>


        <div id="session-${session.session}">
        </div>


        `;


    });

}




async function openSession(sessionNumber){


    const sessionBox =
    document.getElementById(
        "session-" + sessionNumber
    );


    if(sessionBox.innerHTML !== ""){

        sessionBox.innerHTML = "";

        return;

    }



    const session =
    sessions.find(
        s => s.session === sessionNumber
    );



    const response =
    await fetch(
        "vocabulary/" + session.file
    );


    const words =
    await response.json();



    words.forEach(word=>{

        word.session = sessionNumber;

        allWords.push(word);

    });



    displayWords(
        words,
        sessionBox
    );


}





function displayWords(words,container){


    container.innerHTML = "";


    words.forEach((word,index)=>{


        container.innerHTML += `


        <div class="word-card">


        <h3>

        ${index+1}.

        ${word.article ? word.article+" " : ""}

        ${word.word}

        </h3>


        <p>
        <strong>Meaning:</strong>
        ${word.meaning}
        </p>


        ${
        word.partizip2 ?
        `
        <p>
        <strong>Partizip II:</strong>
        ${word.partizip2}
        </p>
        `
        :
        ""
        }


        <p>
        <strong>Example:</strong>
        ${word.example}
        </p>


        </div>


        `;


    });


}





searchBox.addEventListener(
"input",
function(){


const text =
searchBox.value.toLowerCase();



if(text === ""){

    displaySessions();

    return;

}



searchAllWords(text);



});





async function searchAllWords(text){


if(allWords.length === 0){

    for(const session of sessions){

        const response =
        await fetch(
        "vocabulary/" + session.file
        );


        const words =
        await response.json();


        words.forEach(word=>{

            word.session=session.session;

            allWords.push(word);

        });

    }

}



const results =
allWords.filter(word=>


word.word
.toLowerCase()
.includes(text)

||

word.meaning
.toLowerCase()
.includes(text)



);



vocabularyContainer.innerHTML = "";

displayWords(
    results,
    vocabularyContainer
);


}