let grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
let scoreDisplay = document.querySelector('#score');
let startBtn = document.querySelector('#start-button');
const width = 10;
let timer = null;
let score = 0;
const tetrisHead = document.querySelectorAll('.tetris span');

// color tetris heading
// const tcolor = ["rgb(80, 220, 255)", "greenyellow", "rgb(255, 148, 166)", "aquamarine", "rgb(248, 95, 248)"];
// let i = 0;
// tetrisHead.forEach(letter => {
//     letter.style.color = tcolor[i];
//     letter.textStroke = "1px white";
//     i = (i + 1) % 5;
// })

const lTetromino = [
    [1, width + 1, 2 * width + 1, 2],
    [width, width + 1, width + 2, 2 * width + 2],
    [1, width + 1, 2 * width + 1, 2 * width],
    [width, 2 * width, 2 * width + 1, 2 * width + 2]
]
const zTetromino = [
    [0, width, width + 1, 2 * width + 1],
    [width + 1, width + 2, 2 * width, 2 * width + 1],
    [0, width, width + 1, 2 * width + 1],
    [width + 1, width + 2, 2 * width, 2 * width + 1]

]
const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, 2 * width + 1],
    [1, width, width + 1, 2 * width + 1]
]
const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]

]
const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let rand = Math.floor(Math.random() * theTetrominoes.length);
let rand_rotation = 0;
let nextRandom = Math.floor(Math.random() * 5);
let curr_position = 4;
let current_tetri = theTetrominoes[rand][rand_rotation];
let colorClass = ["ltetromino", "ztetromino", "ttetromino", "otetromino", "itetromino"];
function draw() {
    current_tetri.forEach(x => {
        squares[curr_position + x].classList.add(colorClass[rand]);
    })

}

// assign function to keycodes
function control(e) {
    if (e.keyCode === 37) {
        moveLeft();
    }
    else if (e.keyCode === 39) {
        moveRight();
    }
    else if (e.keyCode === 38) {
        rotate();
    }
    else if (e.keyCode === 40) {
        moveDown();
    }
}

window.addEventListener('keyup', control);

function undraw() {
    current_tetri.forEach(x => {
        squares[curr_position + x].classList.remove(colorClass[rand]);
    })
}



function moveDown() {
    undraw();
    curr_position += width;
    draw();
    freeze();
}
function freeze() {
    if (current_tetri.some(x => squares[curr_position + x + width].classList.contains('taken'))) {
        current_tetri.forEach(x => { squares[curr_position + x].classList.add('taken'); });
        curr_position = 4;
        rand = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        rand_rotation = 0;
        current_tetri = theTetrominoes[rand][rand_rotation];
        displayShape();
        addScore();
        draw();
        gameOver();
    }
}

// move left the current tetromino
function moveLeft() {
    undraw();
    const isAtLeftEdge = current_tetri.some(index => ((curr_position + index) % width === 0));
    if (!isAtLeftEdge) curr_position--;
    if (current_tetri.some(index => squares[curr_position + index].classList.contains('taken'))) curr_position++;
    draw();
    freeze();
}

// move right the current tetromino
function moveRight() {
    undraw();
    const isAtRightEdge = current_tetri.some(index => ((curr_position + index) % width === width - 1));
    if (!isAtRightEdge) curr_position++;
    if (current_tetri.some(index => squares[curr_position + index].classList.contains('taken'))) curr_position--;
    draw();
    freeze();
}

// rotate the tetromino to another rotation
function rotate() {
    undraw();
    rand_rotation = (rand_rotation + 1) % 4;
    current_tetri = theTetrominoes[rand][rand_rotation];
    draw();
}


// next up tetromino display

const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let disIdx = 0;

const upNextTetrominoes = [
    [1, displayWidth + 1, 2 * displayWidth + 1, 2],
    [0, displayWidth, displayWidth + 1, 2 * displayWidth + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
];

// display the next tetromino in the mini grid
function displayShape() {
    displaySquares.forEach(idx => {
        idx.removeAttribute('class');
    })

    upNextTetrominoes[nextRandom].forEach(idx => {
        displaySquares[idx + disIdx].classList.add(colorClass[nextRandom]);
    })
}

startBtn.addEventListener('click', () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    else {
        draw();
        timer = setInterval(moveDown, 300);
        nextRandom = Math.floor(Math.random() * 5);
        displayShape();
    }
})

// add score
function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerText = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].removeAttribute('class');
            })
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

// game over
function gameOver() {
    if (current_tetri.some(index => squares[index + curr_position].classList.contains('taken'))) {
        scoreDisplay.innerText = "Game Over";
        clearInterval(timer);
    }
}

