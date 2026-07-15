const mistakesContainer =
document.getElementById("mistakes");


loadMistakes();



async function loadMistakes(){

    const user = await waitForAuth();

    if(!user){

        mistakesContainer.innerHTML = `

        <div class="login-prompt">

            <h2>
            Login Required
            </h2>

            <p>
            Please login to view your mistakes.
            </p>

            <button onclick="login()">
            Login with Google
            </button>

        </div>

        `;

        return;

    }


    try{

        const allMistakes = await getMistakes();

        const sessions = await fetchSessions();

        const completed = await getCompletedSessions();


        displayMistakes(allMistakes, sessions, completed);

    }

    catch(error){

        mistakesContainer.innerHTML =
        "<p>Error loading mistakes.</p>";

        console.error(error);

    }

}




function displayMistakes(allMistakes, sessions, completed){


    mistakesContainer.innerHTML = "";



    if(allMistakes.length === 0){

        mistakesContainer.innerHTML = `

        <div class="empty-state">

            <h2>
            No Mistakes Yet
            </h2>

            <p>
            Start practicing to track your progress!
            </p>

            <a href="practice.html"
               class="start-practicing">
            Start Practicing
            </a>

        </div>

        `;

        return;

    }



    // Group mistakes by session
    const grouped = {};
    allMistakes.forEach(function(m){
        if(!grouped[m.sessionNumber]){
            grouped[m.sessionNumber] = [];
        }
        grouped[m.sessionNumber].push(m);
    });


    // Render each session group
    Object.keys(grouped)
    .sort(function(a, b){
        return Number(a) - Number(b);
    })
    .forEach(function(sessionNum){

        const mistakes = grouped[sessionNum];
        const isCompleted =
        completed.includes(Number(sessionNum));


        mistakesContainer.innerHTML += `

        <div class="mistake-session">

            <div class="session-header"
                 onclick="toggleMistakes(${sessionNum})">

                ▶ Session ${sessionNum}
                — ${mistakes.length} mistake${mistakes.length > 1 ? 's' : ''}
                — ${isCompleted ? '✅ Completed' : '❌ Incomplete'}

            </div>

            <div id="mistakes-session-${sessionNum}"
                 class="mistakes-list">

            </div>

        </div>

        `;


        const list =
        document.getElementById(
            "mistakes-session-" + sessionNum
        );


        mistakes.forEach(function(m){


            const articleText =
            m.article
            ? `<span class="mistake-article">${m.article}</span> `
            : "";


            const questionLabel =
            m.questionType === "meaning"
            ? "Meaning"
            : "Article";


            list.innerHTML += `

            <div class="mistake-card">

                <div class="mistake-word">
                ${articleText}${m.word}
                </div>

                <div class="mistake-detail">
                <strong>${questionLabel}:</strong>
                <span class="wrong-answer">${m.userAnswer}</span>
                →
                <span class="correct-answer">${m.correctAnswer}</span>
                </div>

            </div>

            `;


        });


        // Add clear button
        list.innerHTML += `

        <button onclick="clearMistakes(${sessionNum})"
                class="clear-mistakes-btn">
        Clear Mistakes for Session ${sessionNum}
        </button>

        `;

    });


}



function toggleMistakes(sessionNum){

    const list =
    document.getElementById(
        "mistakes-session-" + sessionNum
    );


    if(list.style.display === "none"){

        list.style.display = "block";

    }

    else{

        list.style.display = "none";

    }

}



async function clearMistakes(sessionNum){

    if(!confirm(
        "Clear all mistakes for Session " + sessionNum + "?"
    )){

        return;

    }


    try{

        await clearSessionMistakes(sessionNum);

        loadMistakes();

    }

    catch(error){

        console.error(error);

        alert("Failed to clear mistakes.");

    }

}
