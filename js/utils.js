async function fetchSessions(){

    const response =
    await fetch("data/sessions.json", { cache: "no-cache" });


    if(!response.ok){

        throw new Error("Failed to load sessions");

    }


    return response.json();

}


async function fetchWords(filename){

    const response =
    await fetch("vocabulary/" + filename, { cache: "no-cache" });


    if(!response.ok){

        throw new Error("Failed to load vocabulary");

    }


    return response.json();

}


async function fetchSettings(){

    const response =
    await fetch("data/settings.json", { cache: "no-cache" });


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



async function saveSessionOutcome(sessionNumber, attemptMistakes, completed){

    if(!currentUser) return;

    const userRef = db.collection("users").doc(currentUser.uid);
    const mistakesRef = userRef.collection("mistakes");
    const completedRef = userRef
    .collection("completedSessions")
    .doc(String(sessionNumber));

    const oldMistakes = await mistakesRef
    .where("sessionNumber", "==", sessionNumber)
    .get();

    const batch = db.batch();

    oldMistakes.docs.forEach(doc => batch.delete(doc.ref));

    attemptMistakes.forEach(mistake => {
        batch.set(mistakesRef.doc(), {
            sessionNumber,
            wordId: mistake.word.id,
            word: mistake.word.word,
            article: mistake.word.article || null,
            questionType: mistake.questionType,
            userAnswer: mistake.userAnswer,
            correctAnswer: mistake.correctAnswer,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    });

    if(completed){
        batch.set(completedRef, {
            completed: true,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
    else{
        batch.delete(completedRef);
    }

    await batch.commit();
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


function escapeHtml(value){
    return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function wordExamples(word){
    if(Array.isArray(word.examples)) return word.examples;
    return word.example ? [word.example] : [];
}


function learningDetailsHtml(word, includeMeaning){
    const rows = [];

    if(includeMeaning) rows.push(["Meaning", word.meaning]);
    if(word.type) rows.push(["Word type", word.type]);
    if(word.article) rows.push(["Article", word.article]);
    if(word.plural) rows.push(["Plural", word.plural]);
    if(word.partizip2) rows.push(["Partizip II", word.partizip2]);
    if(word.auxiliary) rows.push(["Perfect auxiliary", word.auxiliary]);
    if(word.comparative) rows.push(["Comparative", word.comparative]);
    if(word.superlative) rows.push(["Superlative", word.superlative]);

    let html = rows.map(row =>
        `<p><strong>${escapeHtml(row[0])}:</strong> ${escapeHtml(row[1])}</p>`
    ).join("");

    if(word.note){
        html += `<p><strong>Note:</strong> ${escapeHtml(word.note)}</p>`;
    }

    const examples = wordExamples(word);
    if(examples.length){
        html += "<div class=\"learning-examples\"><strong>Examples:</strong><ol>";
        html += examples.map(example => `<li>${escapeHtml(example)}</li>`).join("");
        html += "</ol></div>";
    }

    return html;
}
