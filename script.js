
const gridContainer = document.getElementById('grid-container');
const statusText = document.getElementById('status');
const shuffleButton = document.getElementById('shuffle-button');
const revealButton = document.getElementById('reveal-button');
const homeButton = document.getElementById('home-button');
const timerText = document.getElementById('timer');

let letters = [];
let solution = [];
let timer;
let elapsedTime = 0;
let draggedElement = null;
let touchStartIndex = null;

const puzzles = {
    easy: { letters: ['A', 'A', 'A', 'A', 'A', 'E', 'E', 'T', 'T', 'R', 'R', 'R', 'R', 'R', 'P', 'T'], solution: ['PART', 'AREA', 'REAR', 'TART'] },
    medium: { letters: ['O', 'O', 'O', 'E', 'E', 'I', 'S', 'S', 'S', 'T', 'T', 'N', 'N', 'M', 'L', 'R'], solution: ['LOST', 'OMEN', 'SERI', 'SNOT'] },
    hard: { letters: ['A', 'A', 'E', 'E', 'E', 'I', 'I', 'C', 'M', 'F', 'L', 'R', 'T', 'S', 'D', 'N'], solution: ['CENT', 'EMAS', 'DIRA', 'ELIF'] },
    expert: { letters: ['A', 'E', 'E', 'E', 'E', 'O', 'O', 'I', 'R', 'R', 'N', 'D', 'P', 'N', 'L', 'M'], solution: ['NEPO', 'EROM', 'NARI', 'EDEL'] }
};

function initializeGame() {
    const params = new URLSearchParams(window.location.search);
    const difficulty = params.get('difficulty') || 'easy';
    const puzzle = puzzles[difficulty];
    letters = [...puzzle.letters];
    solution = [...puzzle.solution];
    shuffleLetters();
    startTimer();
}

function initializeGrid() {
    gridContainer.innerHTML = '';
    letters.forEach((letter, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = letter;
        tile.setAttribute('draggable', 'true');
        tile.setAttribute('data-index', index);
        gridContainer.appendChild(tile);

        tile.addEventListener('dragstart', handleDragStart);
        tile.addEventListener('dragover', handleDragOver);
        tile.addEventListener('drop', handleDrop);

        // Touch support for mobile devices
        tile.addEventListener('touchstart', handleTouchStart);
        tile.addEventListener('touchmove', handleTouchMove);
        tile.addEventListener('touchend', handleTouchEnd);
    });
}

function shuffleLetters() {
    letters = letters.sort(() => Math.random() - 0.5);
    initializeGrid();
}

function startTimer() {
    elapsedTime = 0;
    clearInterval(timer);
    timer = setInterval(() => {
        elapsedTime++;
        timerText.textContent = 'Time: ' + elapsedTime + 's';
    }, 1000);
}

function handleDragStart(event) {
    draggedElement = event.target;
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    const targetElement = event.target;
    const draggedIndex = draggedElement.getAttribute('data-index');
    const targetIndex = targetElement.getAttribute('data-index');

    [letters[draggedIndex], letters[targetIndex]] = [letters[targetIndex], letters[draggedIndex]];
    initializeGrid();
    checkWinCondition();
}

function handleTouchStart(event) {
    const target = event.target;
    touchStartIndex = target.getAttribute('data-index');
}

function handleTouchMove(event) {
    event.preventDefault();
}

function handleTouchEnd(event) {
    const target = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    if (!target || !target.classList.contains('tile')) return;

    const targetIndex = target.getAttribute('data-index');
    if (touchStartIndex !== null && targetIndex !== null) {
        [letters[touchStartIndex], letters[targetIndex]] = [letters[targetIndex], letters[touchStartIndex]];
        initializeGrid();
        checkWinCondition();
        touchStartIndex = null;
    }
}

function checkWinCondition() {
    const rows = [];
    for (let i = 0; i < 4; i++) {
        rows.push(letters.slice(i * 4, i * 4 + 4).join(''));
    }
    if (JSON.stringify(rows) === JSON.stringify(solution)) {
        clearInterval(timer);
        statusText.textContent = 'Congratulations! You solved the puzzle!';
    }
}

revealButton.addEventListener('click', () => {
    clearInterval(timer);
    letters = solution.flat();
    initializeGrid();
});

homeButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

initializeGame();
shuffleButton.addEventListener('click', shuffleLetters);
