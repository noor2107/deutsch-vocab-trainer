const practiceContainer = document.getElementById("practice");


loadPractice();



async function loadPractice(){

    const user = await waitForAuth();

    if(!user){

        practiceContainer.innerHTML = `

        <div class="login-prompt">

            <h2>
            Login Required
            </h2>

            <p>
            Please login to track your progress.
            </p>

            <button onclick="login()">
            Login with Google
            </button>

        </div>

        `;

        return;

    }


    try{

        const sessions = await fetchSessions();

        const completed = await getCompletedSessions();

        const mistakes = await getMistakes();


        displayPractice(sessions, completed, mistakes);

    }

    catch(error){

        practiceContainer.innerHTML =
        "<p>Error loading sessions.</p>";

        console.error(error);

    }

}





function displayPractice(sessions, completed, mistakes){


    practiceContainer.innerHTML = "";


    // Count mistakes per session
    const mistakesPerSession = {};
    mistakes.forEach(function(m){
        if(!mistakesPerSession[m.sessionNumber]){
            mistakesPerSession[m.sessionNumber] = 0;
        }
        mistakesPerSession[m.sessionNumber]++;
    });


    // Find first incomplete session

    const nextSession =
    sessions.find(
        session => !completed.includes(session.session)
    );



    if(nextSession){


        const mistakeCount =
        mistakesPerSession[nextSession.session] || 0;


        practiceContainer.innerHTML += `

        <section class="continue-box">

            <h2>
            Continue Learning
            </h2>


            <p>
            Session ${nextSession.session}
            </p>


            <p>
            ❌ Not completed
            ${mistakeCount > 0 ? "(" + mistakeCount + " mistakes)" : ""}
            </p>


            <button onclick="openSession(${nextSession.session})">
            Continue Session ${nextSession.session}
            </button>


        </section>

        `;

    }



    practiceContainer.innerHTML += `

    <section>

    <h2>
    All Sessions
    </h2>

    <div id="session-list">

    </div>


    </section>

    `;



    const sessionList =
    document.getElementById("session-list");



    sessions.forEach(session=>{


        const isCompleted =
        completed.includes(session.session);


        const status =
        isCompleted
        ?
        "✅ Completed"
        :
        "❌ Not completed";


        const mistakeCount =
        mistakesPerSession[session.session] || 0;


        sessionList.innerHTML += `


        <div class="practice-session">


            <h3>
            Session ${session.session}
            </h3>


            <p>
            ${session.word_count} words
            </p>


            <p>
            ${status}
            </p>


            ${
            !isCompleted && mistakeCount > 0
            ?
            `<p class="mistake-count">
            ${mistakeCount} mistakes
            </p>`
            :
            ""
            }


            <button onclick="openSession(${session.session})">
            Start Session
            </button>


        </div>


        `;


    });


}

function openSession(sessionNumber){

    window.location.href =
    "session.html?session=" + sessionNumber;

}