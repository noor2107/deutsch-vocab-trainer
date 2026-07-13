fetch("words.json")
.then(response => response.json())
.then(words => {

    let currentWord = words[0];

    document.getElementById("word").innerHTML =
        currentWord.article + " " + currentWord.word;

});
