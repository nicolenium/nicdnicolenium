
// Procedural Generation & Large Data Pools to simulate 10,000+ permutations across all categories

const GEOGRAPHY_DATA = [
  { c: "France", cap: "Paris", r: "Seine", m: "Alps" },
  { c: "Japan", cap: "Tokyo", r: "Shinano", m: "Mount Fuji" },
  { c: "Egypt", cap: "Cairo", r: "Nile", m: "Mount Catherine" },
  { c: "Brazil", cap: "Brasilia", r: "Amazon", m: "Pico da Neblina" },
  { c: "Canada", cap: "Ottawa", r: "Mackenzie", m: "Mount Logan" },
  { c: "Australia", cap: "Canberra", r: "Murray", m: "Mount Kosciuszko" },
  { c: "India", cap: "New Delhi", r: "Ganges", m: "Kangchenjunga" },
  { c: "Italy", cap: "Rome", r: "Po", m: "Mont Blanc" }
];

const HISTORY_DATA = [
  { y: "1912", e: "the sinking of the Titanic", p: "Edward Smith" },
  { y: "1969", e: "the first moon landing", p: "Neil Armstrong" },
  { y: "1776", e: "the signing of the Declaration of Independence", p: "Thomas Jefferson" },
  { y: "1945", e: "the end of World War II", p: "Winston Churchill" },
  { y: "1066", e: "the Battle of Hastings", p: "William the Conqueror" },
  { y: "1492", e: "Columbus reaching the Americas", p: "Christopher Columbus" },
  { y: "1989", e: "the fall of the Berlin Wall", p: "Mikhail Gorbachev" }
];

const SCIENCE_DATA = [
  { q: "What is the chemical symbol for Gold?", a: "Au", w: ["Ag", "Gd", "Go"] },
  { q: "What planet is known as the Red Planet?", a: "Mars", w: ["Venus", "Jupiter", "Saturn"] },
  { q: "What is the powerhouse of the cell?", a: "Mitochondria", w: ["Nucleus", "Ribosome", "Endoplasmic Reticulum"] },
  { q: "What is the hardest natural substance on Earth?", a: "Diamond", w: ["Graphene", "Quartz", "Topaz"] }
];

const CODING_DATA = [
  { q: "Which data structure uses LIFO?", a: "Stack", w: ["Queue", "Tree", "Graph"] },
  { q: "What is the time complexity of binary search?", a: "O(log n)", w: ["O(n)", "O(n^2)", "O(1)"] },
  { q: "Which design pattern ensures a class has only one instance?", a: "Singleton", w: ["Factory", "Observer", "Decorator"] },
  { q: "What does SOLID stand for in object-oriented design?", a: "Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion", w: ["Simple, Object, Logic, Interface, Data", "Static, Open, Linear, Internal, Dynamic", "System, Operation, Language, Integration, Deployment"] }
];

const generateMathPuzzle = (difficulty) => {
  const mult = difficulty === 'hard' ? 100 : difficulty === 'medium' ? 50 : 20;
  const a = Math.floor(Math.random() * mult) + 1;
  const b = Math.floor(Math.random() * mult) + 1;
  const ops = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random() * (difficulty === 'easy' ? 2 : 3))];
  
  let ans;
  if (op === '+') ans = a + b;
  else if (op === '-') ans = a - b;
  else ans = a * b;

  return {
    question: `What is ${a} ${op} ${b}?`,
    options: [ans.toString(), (ans + a).toString(), (ans - b).toString(), (ans + 10).toString()],
    correctAnswer: ans.toString(),
    explanation: `The correct calculation is ${a} ${op} ${b} = ${ans}.`
  };
};

const generateGeoQuestion = () => {
  const d = GEOGRAPHY_DATA[Math.floor(Math.random() * GEOGRAPHY_DATA.length)];
  const type = Math.floor(Math.random() * 3);
  const q = type === 0 ? `What is the capital of ${d.c}?` : type === 1 ? `Which major river flows through ${d.c}?` : `Name a prominent mountain/peak in ${d.c}.`;
  const a = type === 0 ? d.cap : type === 1 ? d.r : d.m;
  const wrongs = GEOGRAPHY_DATA.filter(x => x.c !== d.c).map(x => type === 0 ? x.cap : type === 1 ? x.r : x.m).slice(0, 3);
  return { 
    question: q, 
    options: [a, ...wrongs], 
    correctAnswer: a,
    explanation: `${a} is the correct answer for ${d.c}.`
  };
};

const generateHistoryQuestion = () => {
  const d = HISTORY_DATA[Math.floor(Math.random() * HISTORY_DATA.length)];
  const q = `In what year did ${d.e} occur?`;
  const ans = d.y;
  const wrongs = [(parseInt(ans)+10).toString(), (parseInt(ans)-5).toString(), (parseInt(ans)+1).toString()];
  return { 
    question: q, 
    options: [ans, ...wrongs], 
    correctAnswer: ans,
    explanation: `${d.e} occurred in the year ${ans}.`
  };
};

const generateScienceQuestion = () => {
  const d = SCIENCE_DATA[Math.floor(Math.random() * SCIENCE_DATA.length)];
  return {
    question: d.q,
    options: [d.a, ...d.w],
    correctAnswer: d.a,
    explanation: `${d.a} is the scientifically accepted answer.`
  };
};

const generateCodingQuestion = () => {
  const d = CODING_DATA[Math.floor(Math.random() * CODING_DATA.length)];
  return {
    question: d.q,
    options: [d.a, ...d.w],
    correctAnswer: d.a,
    explanation: `In computer science, ${d.a} is the correct concept.`
  };
};

export const shuffleAnswers = (options, correctAns) => {
  const shuffled = [...options].sort(() => Math.random() - 0.5);
  return { shuffled, correctIndex: shuffled.indexOf(correctAns) };
};

export const getRandomQuestion = (gameType, difficulty = 'medium') => {
  let qData;
  if (gameType === 'math' || gameType === 'math_puzzle' || gameType === 'math_challenge') qData = generateMathPuzzle(difficulty);
  else if (gameType === 'geography' || gameType === 'geography_quiz') qData = generateGeoQuestion();
  else if (gameType === 'history' || gameType === 'history_quiz') qData = generateHistoryQuestion();
  else if (gameType === 'science' || gameType === 'science_quiz') qData = generateScienceQuestion();
  else if (gameType === 'coding' || gameType === 'coding_challenge') qData = generateCodingQuestion();
  else {
    // Generic fallback for trivia, speed quiz, etc.
    const generators = [generateMathPuzzle, generateGeoQuestion, generateHistoryQuestion, generateScienceQuestion];
    qData = generators[Math.floor(Math.random() * generators.length)](difficulty);
  }
  
  const { shuffled, correctIndex } = shuffleAnswers(qData.options, qData.correctAnswer);
  return { 
    question: qData.question, 
    options: shuffled, 
    correctIndex, 
    answer: qData.correctAnswer,
    explanation: qData.explanation || "That is the correct answer."
  };
};

export const getQuestionPool = (gameType, count = 10, difficulty = 'medium') => {
  const pool = [];
  for (let i = 0; i < count; i++) pool.push(getRandomQuestion(gameType, difficulty));
  return pool;
};

export const ensureNoRepeat = (sessionQuestions, newQuestion) => {
  return !sessionQuestions.some(q => q.question === newQuestion.question);
};
