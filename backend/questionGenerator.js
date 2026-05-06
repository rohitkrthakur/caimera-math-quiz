// Random math question generator

export function generateQuestion() {
  // 1. Random numbers
  let a = Math.floor(Math.random() * 20) + 1;
  let b = Math.floor(Math.random() * 20) + 1;

  // 2. Random operator
  const operators = ["+", "-", "*", "/"];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let question = "";
  let answer = 0;

  switch (operator) {
    case "+":
      question = `${a} + ${b}`;
      answer = a + b;
      break;

    case "-":
      question = `${a} - ${b}`;
      answer = a - b;
      break;

    case "*":
      question = `${a} * ${b}`;
      answer = a * b;
      break;

    case "/":
      // ensure integer division
      a = a * b;
      question = `${a} / ${b}`;
      answer = a / b;
      break;
  }

  return {
    question,
    answer,
  };
}