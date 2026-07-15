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


    const user = await waitForAuth();

    if(!user){

        sessionContainer.innerHTML = `

        <div class="login-prompt">

            <h2>
            Login Required
            </h2>

            <p>
            Please login to start a session.
            </p>

            <button onclick="login()">
            Login with Google
            </button>

        </div>

        `;

        return;

    }


    try{

        const sessions =
        await fetchSessions();



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

    catch(error){

        sessionContainer.innerHTML =
        "<p>Error loading session.</p>";

        console.error(error);

    }

}

function startQuiz(sessionNumber){

    window.location.href =
    "quiz.html?session=" + sessionNumber;

}
