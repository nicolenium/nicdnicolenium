
// Procedural educational content generation
const VOCAB_POOL = {
  English: [{w: "Apple", p: "/ˈæp.əl/"}, {w: "Book", p: "/bʊk/"}, {w: "Car", p: "/kɑːr/"}],
  Spanish: [{w: "Manzana", p: "/manˈsana/"}, {w: "Libro", p: "/ˈlibɾo/"}, {w: "Coche", p: "/ˈko.tʃe/"}],
  French: [{w: "Pomme", p: "/pɔm/"}, {w: "Livre", p: "/livʁ/"}, {w: "Voiture", p: "/vwa.tyʁ/"}]
};

export const getRandomContent = (gameType, difficulty, language = 'English') => {
  if (gameType === 'math_challenge') {
    const a = Math.floor(Math.random() * 50);
    const b = Math.floor(Math.random() * 50);
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random()*ops.length)];
    const ans = eval(`${a} ${op} ${b}`);
    return { question: `${a} ${op} ${b}`, answer: ans.toString() };
  }
  
  if (gameType === 'languages_learning' || gameType === 'pronunciation_master') {
    const pool = VOCAB_POOL[language] || VOCAB_POOL['English'];
    const item = pool[Math.floor(Math.random() * pool.length)];
    return { 
      word: item.w, 
      translation: VOCAB_POOL['English'].find((_,i) => pool[i]?.w === item.w)?.w || item.w, 
      phonetic: item.p,
      question: `Translate: ${item.w}`,
      answer: VOCAB_POOL['English'].find((_,i) => pool[i]?.w === item.w)?.w || "Unknown"
    };
  }

  return { question: `Gen Content ${Math.random()}`, answer: "A" };
};

export const getContentPool = (gameType, count = 10, difficulty, language) => {
  return Array.from({length: count}).map(() => getRandomContent(gameType, difficulty, language));
};

export const shuffleContent = (contentArr) => [...contentArr].sort(() => Math.random() - 0.5);

export const ensureNoRepeat = (sessionContent, newContent) => {
  return !sessionContent.some(c => c.question === newContent.question);
};
