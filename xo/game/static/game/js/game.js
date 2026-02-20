/* Tic Tac Toe — client-side game + AI (minimax)
   - Single-page UI served by Django
   - Difficulty: easy / medium / hard (unbeatable)
   - Score persisted in localStorage
*/

const WIN_COMBINATIONS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let board = Array(9).fill(null);
let human = 'X';
let ai = 'O';
let currentPlayer = 'X';
let gameOver = false;
let difficulty = 'medium';

const boardEl = document.getElementById('board');
const statusBar = document.getElementById('statusBar');
const scoreYou = document.getElementById('scoreYou');
const scoreComp = document.getElementById('scoreComp');
const scoreDraw = document.getElementById('scoreDraw');

function tplCell(i){
  return `<button class="cell" data-index="${i}" aria-label="grid cell"><span class="shape"></span></button>`;
}

function renderBoard(){
  boardEl.innerHTML = board.map((v,i)=> tplCell(i)).join('');
  // apply marks
  board.forEach((v,i)=>{
    if(!v) return;
    const cell = boardEl.querySelector(`[data-index="${i}"]`);
    cell.classList.add(v.toLowerCase());
    cell.querySelector('.shape').innerHTML = v === 'X' ? svgX() : svgO();
    cell.disabled = true;
  });
  // attach listeners
  boardEl.querySelectorAll('.cell').forEach(c=>c.addEventListener('click', onCellClick));
}

function svgX(){
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path class="path-anim" d="M20 20 L80 80 M80 20 L20 80" stroke-width="8" stroke-linecap="round" fill="none"/></svg>`;
}
function svgO(){
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle class="path-anim" cx="50" cy="50" r="34" stroke-width="8" stroke-linecap="round" fill="none"/></svg>`;
}

function onCellClick(e){
  if(gameOver) return;
  const idx = Number(e.currentTarget.dataset.index);
  if(board[idx]) return;
  if(currentPlayer !== human) return;
  makeMove(idx, human);
}

function makeMove(idx, player){
  board[idx] = player;
  currentPlayer = (player === 'X') ? 'O' : 'X';
  renderBoard();
  const result = checkResult(board);
  if(result){
    endGame(result);
    return;
  }
  statusBar.textContent = (currentPlayer === human) ? 'Your move' : "Computer's move";
  if(currentPlayer === ai){
    // small delay for realism
    setTimeout(()=> aiPlay(), 420);
  }
}

function aiPlay(){
  if(gameOver) return;
  let idx;
  const empties = availableIndices(board);
  if(difficulty === 'easy'){
    idx = empties[Math.floor(Math.random()*empties.length)];
  } else if(difficulty === 'medium'){
    if(Math.random() < 0.45){
      idx = empties[Math.floor(Math.random()*empties.length)];
    } else {
      idx = bestMove(board, ai).index;
    }
  } else { // hard
    idx = bestMove(board, ai).index;
  }
  makeMove(idx, ai);
}

function availableIndices(b){
  return b.map((v,i)=> v ? null : i).filter(v=> v !== null);
}

function checkResult(b){
  // return {winner: 'X'|'O'|null, combo: [i,i,i]} or 'draw'
  for(const combo of WIN_COMBINATIONS){
    const [a,b1,c] = combo;
    if(b[a] && b[a] === b[b1] && b[a] === b[c]){
      return { winner: b[a], combo };
    }
  }
  if(b.every(Boolean)) return { winner: null, combo: null, draw: true };
  return null;
}

function endGame(result){
  gameOver = true;
  if(result.draw){
    statusBar.textContent = "It's a draw";
    highlightDraw();
    updateScore('draw');
  } else if(result.winner === human){
    statusBar.textContent = 'You win 🎉';
    highlightWin(result.combo);
    updateScore('human');
    confettiBurst();
  } else {
    statusBar.textContent = 'Computer wins';
    highlightWin(result.combo, true);
    updateScore('ai');
  }
}

function highlightWin(combo, isAi=false){
  combo.forEach(i=>{
    const c = boardEl.querySelector(`[data-index="${i}"]`);
    if(c) c.classList.add('win');
  });
}
function highlightDraw(){
  boardEl.querySelectorAll('.cell').forEach(c=> c.classList.add('win'));
}

function updateScore(who){
  const scores = loadScores();
  if(who === 'human') scores.you += 1;
  else if(who === 'ai') scores.comp += 1;
  else scores.draw += 1;
  saveScores(scores);
  renderScores(scores);
}

function loadScores(){
  try{
    return JSON.parse(localStorage.getItem('xo_scores')) || {you:0,comp:0,draw:0};
  }catch(e){return {you:0,comp:0,draw:0}};
}
function saveScores(s){
  localStorage.setItem('xo_scores', JSON.stringify(s));
}
function renderScores(s){
  scoreYou.textContent = s.you;
  scoreComp.textContent = s.comp;
  scoreDraw.textContent = s.draw;
}

function resetScores(){
  const s = {you:0,comp:0,draw:0};
  saveScores(s);
  renderScores(s);
}

// Minimax algorithm
function bestMove(newBoard, player){
  const avail = availableIndices(newBoard);
  // terminal checks
  const res = checkResult(newBoard);
  if(res){
    if(res.draw) return {score:0};
    return {score: (res.winner === ai) ? 10 : -10 };
  }

  const moves = [];
  for(let i of avail){
    const move = {};
    move.index = i;
    newBoard[i] = player;

    const result = bestMove(newBoard, player === ai ? human : ai);
    move.score = result.score;

    newBoard[i] = null;
    moves.push(move);
  }

  // choose best for current player
  let bestIndex = 0;
  if(player === ai){
    let bestScore = -Infinity;
    moves.forEach((m, idx)=>{ if(m.score > bestScore){ bestScore = m.score; bestIndex = idx; } });
  } else {
    let bestScore = Infinity;
    moves.forEach((m, idx)=>{ if(m.score < bestScore){ bestScore = m.score; bestIndex = idx; } });
  }
  return moves[bestIndex];
}

// UI: settings
const btnX = document.getElementById('chooseX');
const btnO = document.getElementById('chooseO');
const newGameBtn = document.getElementById('newGame');
const resetBtn = document.getElementById('resetScore');
const difficultyEl = document.getElementById('difficulty');

btnX.addEventListener('click', ()=>{ setPlayer('X'); });
btnO.addEventListener('click', ()=>{ setPlayer('O'); });
newGameBtn.addEventListener('click', ()=> startNewGame());
resetBtn.addEventListener('click', ()=> resetScores());
difficultyEl.addEventListener('change', e=> { difficulty = e.target.value; startNewGame(); });

function setPlayer(sym){
  human = sym; ai = (sym === 'X') ? 'O' : 'X';
  btnX.classList.toggle('active', sym === 'X');
  btnO.classList.toggle('active', sym === 'O');
  startNewGame();
}

function startNewGame(){
  board = Array(9).fill(null);
  gameOver = false;
  currentPlayer = 'X';
  statusBar.textContent = (human === 'X') ? 'Your move' : "Computer's move";
  renderBoard();
  renderScores(loadScores());
  // if computer starts
  if(human !== currentPlayer){
    setTimeout(()=> aiPlay(), 300);
  }
}

// tiny confetti
function confettiBurst(){
  const colors = ['#f97316','#fb7185','#34d399','#60a5fa','#a78bfa'];
  for(let i=0;i<18;i++){
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = Math.random()*100 + '%';
    el.style.top = '10%';
    el.style.width = el.style.height = (6 + Math.random()*8) + 'px';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.position = 'fixed';
    el.style.opacity = '0.95';
    document.body.appendChild(el);
    const toY = 60 + Math.random()*40;
    el.animate([{transform: `translateY(0) rotate(${Math.random()*360}deg)`, opacity:1},{transform:`translateY(${toY}vh) rotate(${Math.random()*720}deg)`, opacity:0}],{duration:1200+Math.random()*800, easing:'cubic-bezier(.2,.9,.2,1)'});
    setTimeout(()=> el.remove(), 2200);
  }
}

// init
(function(){
  difficulty = difficultyEl.value;
  renderScores(loadScores());
  startNewGame();
})();
