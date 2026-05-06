import { setQuestion, submitAnswer, getCurrentState } from "./gameManager.js";

// Step 1: question set karoo
setQuestion("10 + 5", 15);

// Step 2: state check
console.log("Initial State:", getCurrentState());

// Step 3: wrong answer
submitAnswer("rohit", 12);

// Step 4: correct answer
const result1 = submitAnswer("rohit", 15);
console.log("Result 1:", result1);

// Step 5: second user tries
const result2 = submitAnswer("amit", 15);
console.log("Result 2:", result2);

// Final state
console.log("Final State:", getCurrentState());