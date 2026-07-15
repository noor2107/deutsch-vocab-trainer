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


async function getCompletedSessions(){

    if(!currentUser) return [];


    const snapshot =
    await db.collection("users")
    .doc(currentUser.uid)
    .collection("completedSessions")
    .get();


    return snapshot.docs.map(
        doc => Number(doc.id)
    );

}



async function saveCompletedSession(sessionNumber){

    if(!currentUser) return;


    await db.collection("users")
    .doc(currentUser.uid)
    .collection("completedSessions")
    .doc(String(sessionNumber))
    .set({

        completed: true,

        timestamp:
        firebase.firestore.FieldValue.serverTimestamp()

    });

}



async function logMistake(
    sessionNumber,
    word,
    userAnswer,
    correctAnswer,
    questionType
){

    if(!currentUser) return;


    await db.collection("users")
    .doc(currentUser.uid)
    .collection("mistakes")
    .add({

        sessionNumber,

        wordId: word.id,

        word: word.word,

        article: word.article || null,

        questionType,

        userAnswer,

        correctAnswer,

        timestamp:
        firebase.firestore.FieldValue.serverTimestamp()

    });

}



async function getMistakes(){

    if(!currentUser) return [];


    const snapshot =
    await db.collection("users")
    .doc(currentUser.uid)
    .collection("mistakes")
    .orderBy("timestamp", "desc")
    .get();


    return snapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() })
    );

}



async function clearSessionMistakes(sessionNumber){

    if(!currentUser) return;


    const snapshot =
    await db.collection("users")
    .doc(currentUser.uid)
    .collection("mistakes")
    .where("sessionNumber", "==", sessionNumber)
    .get();


    const batch = db.batch();

    snapshot.docs.forEach(
        doc => batch.delete(doc.ref)
    );

    await batch.commit();

}
