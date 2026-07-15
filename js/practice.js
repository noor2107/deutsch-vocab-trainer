const practiceContainer = document.getElementById("practice");


loadPractice();



async function loadPractice(){

    try{

        const sessions = await fetchSessions();

        displayPractice(sessions);

    }

    catch(error){

        practiceContainer.innerHTML =
        "<p>Error loading sessions.</p>";

        console.error(error);

    }

}





function displayPractice(sessions){


    practiceContainer.innerHTML = "";


    const completed =
    getCompletedSessions();


    // Find first incomplete session

    const nextSession =
    sessions.find(
        session => !completed.includes(session.session)
    );



    if(nextSession){


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


        const status =
        completed.includes(session.session)
        ?
        "✅ Completed"
        :
        "❌ Not completed";



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