const sessionContainer =
document.getElementById("session-info");



loadSession();



async function loadSession(){


    const params =
    new URLSearchParams(
        window.location.search
    );


    const sessionNumber =
    Number(
        params.get("session")
    );



    const response =
    await fetch("data/sessions.json");


    const sessions =
    await response.json();



    const session =
    sessions.find(
        s => s.session === sessionNumber
    );



    if(!session){

        sessionContainer.innerHTML =
        "<h2>Session not found</h2>";

        return;

    }



    sessionContainer.innerHTML = `


    <section class="continue-box">


        <h2>
        Session ${session.session}
        </h2>


        <p>
        Words:
        ${session.word_count}
        </p>


        <h3>
        Question types
        </h3>


        <p>
        ✓ Meaning
        </p>

        <p>
        ✓ Article (nouns)
        </p>

        <p>
        ✓ Partizip II (verbs)
        </p>


        <h3>
        Completion rule
        </h3>


        <p>
        You must answer all questions correctly
        in one attempt.
        </p>


        <button onclick="startQuiz(${session.session})">
        Start Session
        </button>


    </section>


    `;


}

function startQuiz(sessionNumber){

    window.location.href =
    "quiz.html?session=" + sessionNumber;

}