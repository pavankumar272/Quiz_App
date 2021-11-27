const question = document.getElementById("question");
const choices = Array.from( document.getElementsByClassName('choice-text'));
const questionCounterText =document.getElementById('questionCounter');
const scoreText =document.getElementById('score');

let currentQuestion ={};
let acceptingAnswers =false;
let score =0;
let questionCounter =0;
let availableQuestions =[];

let questions =[];

fetch("https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple").then(res =>{
    console.log(res);
    return res.json();
}).then(loadQuestions =>{
    console.log(loadQuestions.results);
   questions = loadQuestions.results.map(loadQuestions =>{
        const formatQuestion ={
            question:loadQuestions.question

        };
        const answerChoices =[...loadQuestions.incorrect_answers];
        formatQuestion.answer =Math.floor(Math.random()*4)+1;
        answerChoices.splice(formatQuestion.answer -1 ,0 ,
            loadQuestions.correct_answer);
            answerChoices.forEach((choice, index)=>{
                formatQuestion["choice"+(index+1)] = choice;
            });
            return formatQuestion;
    });
   
   startGame();
})
.catch(err =>{
console.error(err);
});

const CORRECT_BONUS =10;
const MAX_QUESTION =3;
startGame =()=>{
    questionCounter =0;
    score =0;
    availableQuestions =[...questions];
    console.log(availableQuestions);
    getNewQuestion();
};
getNewQuestion =()=>{

    if(availableQuestions.length === 0 || questionCounter > MAX_QUESTION){
        localStorage.setItem('mostRecentScore',score);
        return window.location.assign("/end.html");

    }
    questionCounter++;
    questionCounterText.innerText = `${questionCounter}/${MAX_QUESTION}`;
  const questionIndex=  Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText =currentQuestion.question;

  choices.forEach((choice) =>{
      const number =choice.dataset["number"];
      choice.innerText = currentQuestion["choice" + number];
  });
  availableQuestions.splice(questionIndex,1);
  acceptingAnswers =true;
};
choices.forEach(choice=>{
    choice.addEventListener('click',e=>{
        
if(!acceptingAnswers) return;

acceptingAnswers= false;
const selectedChoice =e.target;
const selectedAnswer = selectedChoice.dataset["number"];


const classToApply = selectedAnswer == currentQuestion.answer ? 'currect' :'incurrect';
if(classToApply === 'currect'){
    incrementScore(CORRECT_BONUS);
}

selectedChoice.parentElement.classList.add(classToApply);


setTimeout(() => {
selectedChoice.parentElement.classList.remove(classToApply);
getNewQuestion();
    
}, 1000);


    });
});

incrementScore =num=>{
    score += num;
    scoreText.innerText =score;

}
