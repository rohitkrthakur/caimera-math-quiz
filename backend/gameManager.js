
// Global game state


let currentQuestion = '';
let correctAnswer = null;
let   isSolved = false;
let scores = {};


// here we set new questions

function setQuestion(question,answer){
    currentQuestion = question;
    correctAnswer = answer;
    isSolved = false;
    console.log("New Question:", currentQuestion);

}
// set New Question 


function submitAnswer(username,answer){
    console.log(`${username}submitted: ${answer}`);
    

    if(isSolved){
        console.log("question already solved ");
        return null;
    }
    // check for corrent ans 
    if(Number(answer) === correctAnswer){
        isSolved = true; 
//   this is lock only first submit winner 



  if(!scores[username]){
    scores[username]=0;
  }
  scores[username] +=1;
  console.log(`winner: ${username}`);
  return{
    winner: username,
    scores:scores,
    question: currentQuestion
  
  };
    }
    console.log("wrong ans")
    return null;
}

// get current state of quiz
function getCurrentState(){
    return {
        question: currentQuestion,
        scores: scores
    };
}

export {
    setQuestion,
    submitAnswer,
    getCurrentState
};


// logic 
// setQuestion("10 + 5", 15);

// submitAnswer("rohit", 15); 
// // winner: rohit

// submitAnswer("amit", 15);  
// // ignored (already solved)