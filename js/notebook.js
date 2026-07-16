const vocabularyContainer =
document.getElementById("vocabulary");

const searchBox =
document.getElementById("search");


let sessions = [];

let allWords = [];



loadSessions();



async function loadSessions(){

    try{

        sessions = await fetchSessions();

        displaySessions();

    }

    catch(error){

        vocabularyContainer.innerHTML =
        "<p>Error loading vocabulary.</p>";

        console.error(error);

    }

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


    if(sessionBox.innerHTML.trim() !== ""){

        sessionBox.innerHTML = "";

        return;

    }



    const session =
    sessions.find(
        s => s.session === sessionNumber
    );



    try{

        const words =
        await fetchWords(session.file);


        words.forEach(word=>{

            word.session = sessionNumber;

            allWords.push(word);

        });


        displayWords(
            words,
            sessionBox
        );

    }

    catch(error){

        sessionBox.innerHTML =
        "<p>Error loading words.</p>";

        console.error(error);

    }

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


        ${learningDetailsHtml(word, false)}


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

        try{

            const words =
            await fetchWords(session.file);


            words.forEach(word=>{

                word.session=session.session;

                allWords.push(word);

            });

        }

        catch(error){

            console.error(error);

        }

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
