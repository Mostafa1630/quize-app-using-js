// Select Elements
let countSpan = document.querySelector('.quize-info .count span'),
bulletsSpansContainer = document.querySelector('.bullets .spans'),
bullets = document.querySelector('.bullets'),
quizeArea = document.querySelector('.quize-area'),
answerArea = document.querySelector('.answer-area'),
submitButton = document.querySelector('.submit-button'),
resultsContainer = document.querySelector('.results'),
countdownSpan = document.querySelector('.countdown');



// Set Options
let currentIndex =0;
let rigthAnswer = 0;
let countdownInterval;



function getQuestion(){
  let myRequest = new XMLHttpRequest();
  
  myRequest.onreadystatechange = function () {
    if(this.readyState === 4 && this.status === 200){
      // console.log(this.responseText)
      let questionObject = JSON.parse(this.responseText);
      // console.log(questionObject);

      let questionCount = questionObject.length;
      // To Set Number Of Span
      createBullets(questionCount);

      // Add Qustion Data
      addQuestionData(questionObject[currentIndex],questionCount);

      // Start countdown
      countdown(5,questionCount);

      // Click On Submit
      submitButton.onclick = () => {
        // Git Rigth Answer
        let theRigthAnswer = questionObject[currentIndex].right_answer;

        // Incress Index
        currentIndex++;

        // Check The Answer
        checkAnswer(theRigthAnswer,questionCount);
        quizeArea.innerHTML = '';
        answerArea.innerHTML = '';

        // Add Qustion Data
      addQuestionData(questionObject[currentIndex],questionCount);

      // Handel Bullets Class
      handelBullets();

      // Start countdown
      clearInterval(countdownInterval);
      countdown(5,questionCount);

      // Show Results
      showResult(questionCount);

      };

    }
  };
  myRequest.open("GET","html_question.json",true);
  myRequest.send();
}
getQuestion();





// To Create Count Number Of Span
function createBullets(num){
  countSpan.innerHTML = num;

  // Create Spans in class spans
  for(let i=0;i<num;i++){
    let theBullet = document.createElement('span');
    if(i===0){
      theBullet.className = 'on';
    }
    bulletsSpansContainer.appendChild(theBullet);
  }
}




// To Create Add Qustion Data
function addQuestionData(obj , count){

  if(currentIndex<count){
    // Create H2 Question
    let quetionTitle = document.createElement('h2');
    let quetionText = document.createTextNode(obj['title']);
    quetionTitle.appendChild(quetionText);
    quizeArea.appendChild(quetionTitle);

    // Create Answers TO the Title
    for (let i = 1; i <= 4; i++) {
      // Create Div Answer
      let maindiv = document.createElement('div');
      maindiv.className = 'answer';
      // Create Radio
      let radioInput = document.createElement('input');
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.name = 'question';
      radioInput.dataset.answer = obj[`answer_${i}`];
      if(i===1){
        radioInput.checked = true;
      }
      maindiv.appendChild(radioInput);
      

      // Create Lable
      let theLable = document.createElement('label');
      theLable.setAttribute('for',`answer_${i}`)
      let theLableText = document.createTextNode(obj[`answer_${i}`]);
      theLable.appendChild(theLableText);
      maindiv.appendChild(theLable);

      answerArea.appendChild(maindiv);
    }
  }

}


function checkAnswer(rAnswer,count){
  let answers = document.getElementsByName('question');
  let theChooesAnswer;

  for (let i = 0; i < answers.length; i++) {   
    if(answers[i].checked){
      theChooesAnswer = answers[i].dataset.answer;
    }
  }

  if(rAnswer === theChooesAnswer){
    rigthAnswer++;
  }
}


// function to handel bullets
function handelBullets(){
  let bulletSpan = document.querySelectorAll('.bullets .spans span');
  let arrayOfSpan = [...bulletSpan];
  arrayOfSpan.forEach( (bullet , index) => {
    if(currentIndex === index){
      bullet.classList.add('on');
    }
  });
}


function showResult(count){
  let theResults;
  if(currentIndex === count){
    quizeArea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();

  if(rigthAnswer > (count/2) && rigthAnswer < count){
    theResults = `<span class="good">Good</span>,${rigthAnswer} from ${count} Is Good`;
  }else if(rigthAnswer === count){
    theResults = `<span class="Prefect">Prefect</span> , All Answer Is Good`;
  }else{
    theResults = `<span class="bad">Bad</span>,${rigthAnswer} from ${count} Is Bad`;
  }
  resultsContainer.innerHTML = theResults;
  resultsContainer.style.padding = '10px';
  resultsContainer.style.backgroundColor = 'white';
  resultsContainer.style.marginTop = '10px';
  }
}


function countdown(duration,count){
  if(currentIndex < count){
    let minutes,seconds;
    countdownInterval = setInterval(function (){
      minutes = parseInt(duration/60);
      seconds = parseInt(duration%60);
      minutes = minutes < 10 ?`0${minutes}`  : minutes;
      seconds = seconds < 10 ?`0${seconds}`  : seconds;

      countdownSpan.innerHTML = `${minutes}:${seconds}`;
      if(--duration < 0){
        clearInterval(countdownInterval);
        submitButton.click();
      }
    },1000);
  }
}