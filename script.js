let apiData;

async function fetchData() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple'); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        apiData = await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function processData() {
    await fetchData();
    if (apiData) {
        let questions = apiData.results;
        let score = 0;
        let lastAns;
        let currentQuestionIndex = 0; // current question index
        let heading_length = 0;
        
        function loadQuestion() {
            if (currentQuestionIndex < questions.length) {
                const question = questions[currentQuestionIndex];
                document.getElementById("question").innerHTML = "Q." + (currentQuestionIndex + 1) + " " + question.question;
                let buttons_array = document.getElementsByClassName("option");
                for(let m = 0; m < buttons_array.length; m++){
                    buttons_array[m].style.setProperty("--btn-bg", "initial");
                }

                const correctIndex = Math.floor(Math.random() * 4) + 1; // Index of correct option
                let k = 1; // Option index
                
                for (let j = 0; k <= 4; k++) { // Options from 1 to 4
                    let option = document.getElementById("option" + k);
                    if (k === correctIndex) {
                        option.innerHTML = question.correct_answer;
                    } else {
                        option.innerHTML = question.incorrect_answers[j];
                        j++;
                    }
                }
                for (let p = 0; p < buttons_array.length; p++) {
                    buttons_array[p].onclick = function() {
                        if (buttons_array[p].innerHTML == question.correct_answer) {
                            score++;
                            lastAns = "Correct Answer!";
                            buttons_array[p].style.setProperty("--btn-bg", "green");                     
                        } else {
                            buttons_array[p].style.setProperty("--btn-bg", "red")
                            lastAns = "Incorrect Answer!";
                        }
                        currentQuestionIndex++;
                        heading_length += 60;
                        const element = document.querySelector(".three");
                        element.style.setProperty("--heading-length", heading_length + "px");
                        setTimeout(loadQuestion, 1000);
                    };
                }
            } else {
                document.write(`
                    <p style="position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%); text-align: center; font-size: 50px; font-family: fantasy; border: 2px 2px 2px solid black; background-color: aquamarine; border-radius: 10px; padding: 10px 10px 10px 10px; ">
                    Quiz completed! Your score: ${score}/${questions.length}<br>
                    Refresh to play again!
                    </p>
                    `);
            }
        }

        loadQuestion(); 
    } else {
        alert('Data not available yet. Please reload.');
    }
}

fetchData();
processData();
