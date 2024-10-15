let apiData;
const url = "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";

function decodeHtml(text) {
    const txtArea = document.createElement("textarea");
    txtArea.innerHTML = text;
    return txtArea.value;
}

async function fetchData() {
    try {
        const response = await fetch(url); 
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
            if (currentQuestionIndex > 0){
                let correct_percentage = (score * 100)/currentQuestionIndex;
                let line = document.getElementById("line");
                line.style.setProperty("--pseudo-red", "red");
                line.style.setProperty("--pseudo-green", "green");
                line.style.setProperty("--correct-percentage", correct_percentage + "%");
                
            }

            if (currentQuestionIndex < questions.length) {
                const question = questions[currentQuestionIndex];
                question.correct_answer = decodeHtml(question.correct_answer);
                document.getElementById("question").innerHTML = "Q." + (currentQuestionIndex + 1) + " " + question.question;
                
                let buttons_array = document.getElementsByClassName("option");
                for(let m = 0; m < buttons_array.length; m++){
                    buttons_array[m].style.setProperty("--btn-bg", "initial");
                }

                const correctIndex = Math.floor(Math.random() * 4) + 1; // Index of correct option
                let k = 1; // Option index
                
                for (let j = 0; k <= 4; k++) { // Options from 1 to 4
                    let option = document.getElementById("option" + k);
                    if (k == correctIndex) {
                        option.innerHTML = question.correct_answer;
                    } else {
                        option.innerHTML = question.incorrect_answers[j];
                        j++;
                    }
                }
                
                for (let p = 0; p < buttons_array.length; p++) {
                    buttons_array[p].onclick = function() {
                        if (decodeHtml(buttons_array[p].innerHTML) == question.correct_answer) {
                            score++;
                            lastAns = "Correct Answer!";
                        } 
                        else {
                            lastAns = "Incorrect Answer!";
                        }

                        // console.log("Correct Ans: " + question.correct_answer);
                        // console.log("Your Ans: " + buttons_array[p].innerHTML);
                        // console.log("Your answer was the " + lastAns);


                        let btns = document.getElementsByClassName("option");
                        for (let b = 0; b < btns.length; b++){
                            btns[b].disabled = true;

                            if (decodeHtml(btns[b].innerHTML) == question.correct_answer){
                                btns[b].style.setProperty("--btn-bg", "green");
                            }
                            else{
                                btns[b].style.setProperty("--btn-bg","red");
                            }
                        }

                        setTimeout(function() {
                            for (let b = 0; b < btns.length; b++){
                                btns[b].disabled = false;
                            }                            
                        }, 1000);

                        var max_width = getComputedStyle(document.querySelector(".three")).getPropertyValue("--max-width");
                        var max_width_value = parseInt(max_width.replace(/em/,""));
                        currentQuestionIndex++;
                        heading_length = currentQuestionIndex*max_width_value/10;
                        const element = document.querySelector(".three");
                        element.style.setProperty("--heading-length", heading_length + "em");

                        setTimeout(loadQuestion, 1000);
                    };
                }
            } else {
                document.write(`
                    <link rel="stylesheet" href="style.css">
                        <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div class="card" id="question">
            Quiz completed!<br> Your score: ${score}/${questions.length}<br>
                    Refresh to play again!
        </div>
    </div>
        
                    `);
            }
        }

        loadQuestion(); 
    } else {
        alert('Data not available yet. Please reload.');
    }
}

const $card = document.querySelector('.card');
let bounds;

function rotateToMouse(e) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const leftX = mouseX - bounds.x;
  const topY = mouseY - bounds.y;
  const center = {
    x: leftX - bounds.width / 2,
    y: topY - bounds.height / 2
  }
  const distance = Math.sqrt(center.x**2 + center.y**2);
  
  $card.style.transform = `
    scale3d(1.07, 1.07, 1.07)
    rotate3d(
      ${center.y / 100},
      ${-center.x / 100},
      0,
      ${Math.log(distance)* 2}deg
    )
  `;
  
  $card.querySelector('.glow').style.backgroundImage = `
    radial-gradient(
      circle at
      ${center.x * 2 + bounds.width/2}px
      ${center.y * 2 + bounds.height/2}px,
      #ffffff55,
      #0000000f
    )
  `;
}

$card.addEventListener('mouseenter', () => {
  bounds = $card.getBoundingClientRect();
  document.addEventListener('mousemove', rotateToMouse);
});

$card.addEventListener('mouseleave', () => {
  document.removeEventListener('mousemove', rotateToMouse);
  $card.style.transform = '';
  $card.style.background = '';
});

fetchData();
processData();

