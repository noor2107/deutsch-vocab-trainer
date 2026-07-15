async function fetchSessions(){

    const response =
    await fetch("data/sessions.json");


    if(!response.ok){

        throw new Error("Failed to load sessions");

    }


    return response.json();

}


async function fetchWords(filename){

    const response =
    await fetch("vocabulary/" + filename);


    if(!response.ok){

        throw new Error("Failed to load vocabulary");

    }


    return response.json();

}


async function fetchSettings(){

    const response =
    await fetch("data/settings.json");


    if(!response.ok){

        throw new Error("Failed to load settings");

    }


    return response.json();

}


function getCompletedSessions(){

    return JSON.parse(
        localStorage.getItem("completedSessions") || "[]"
    );

}


function saveCompletedSession(sessionNumber){

    const completed = getCompletedSessions();


    if(!completed.includes(sessionNumber)){

        completed.push(sessionNumber);

        localStorage.setItem(
            "completedSessions",
            JSON.stringify(completed)
        );

    }

}
