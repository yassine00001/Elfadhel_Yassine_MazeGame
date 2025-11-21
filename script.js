let maze = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function randomGenMaze(row, col) {
    maze[row][col] = 0;
    
    let directions = shuffle([[-2, 0], [2, 0], [0, -2], [0, 2]]);
    
    for (let [directionRow, directionCol] of directions) {
        let newRow = row + directionRow;
        let newCol = col + directionCol;
        
        if (newRow > 0 && newRow < maze.length - 1 && newCol > 0 && newCol < maze[0].length - 1 && maze[newRow][newCol] === 1) {
            maze[row + directionRow / 2][col + directionCol / 2] = 0;
            randomGenMaze(newRow, newCol);
        }
    }   
}

const cellSize = 40;

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            let value = maze[row][col];

            if (value === 1) {
                ctx.fillStyle = "black"; // Wall
            } else if (value === 0) {
                ctx.fillStyle = "white"; // Path
            } else if (value === 2) {
                ctx.fillStyle = "blue"; // Exit
            }

            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            ctx.strokeStyle = "gray";
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
};

let player = {
    row: 1,
    col: 1,
    size: cellSize * 0.6
};

function drawPlayer() {
    const x = player.col * cellSize + (cellSize - player.size) / 2;
    const y = player.row * cellSize + (cellSize - player.size) / 2;

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x + player.size / 2, y + player.size / 2, player.size / 2, 0, Math.PI * 2);
    ctx.fill();
};

function render() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    drawMaze();
    drawPlayer();
};

document.addEventListener("keydown", handleMovement);

function handleMovement(event) {
    let newRow = player.row;
    let newCol = player.col;

    if (event.key === "ArrowUp") {
        newRow--;
    } else if (event.key === "ArrowDown") {
        newRow++;
    } else if (event.key === "ArrowLeft") {
        newCol--;
    } else if (event.key === "ArrowRight") {
        newCol++;
    } else {
        return;
    }

    if (maze[newRow][newCol] === 1) {
        return;
    }

    player.row = newRow;
    player.col = newCol;

    render();

    if (maze[newRow][newCol] === 2) {
        mazeSolved();
    }
};

function mazeSolved() {
    clearInterval(timerInterval);

    const finalTime = currentRunTime;

    saveBestTime(finalTime);

    showCompletionMessage(finalTime);
};  

let startTime = null;
let timerInterval = null;
let currentRunTime = 0;

const startRunButton = document.getElementById("startRunButton");
const currentRunTimeP = document.getElementById("currentRunTime");

startRunButton.addEventListener("click", startRun);

function startRun() {
    player.row = 1;
    player.col = 1;

    maze = Array.from({ length: 15 }, () => Array(15).fill(1));
    randomGenMaze(1, 1);
    maze[maze.length - 2][maze[0].length - 2] = 2;
    drawMaze();

    startTime = Date.now();
    currentRunTime = 0;

    document.getElementById("messageAfterCompletingMaze").hidden = true;

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        currentRunTime = (Date.now() - startTime) / 1000;
        currentRunTimeP.textContent = "Your time: " + currentRunTime.toFixed(2) + "s";
    }, 50);

    render();
}

function saveBestTime(time) {
    const best = localStorage.getItem("bestTime");

    if (!best || time < parseFloat(best)) {
        localStorage.setItem("bestTime", time);
    }
};

const fastestRunP = document.getElementById("fastestRun");
localStorage.removeItem("bestTime");

function updateFastestRun() {
    const best = localStorage.getItem("bestTime");

    if (best) {
        fastestRunP.textContent = "Fastest Run: " + parseFloat(best).toFixed(2) + "s";
    } else {
        fastestRunP.textContent = "Fastest Run: N/A";
    }
};

updateFastestRun();

function showCompletionMessage(time) {
    document.getElementById("congrats").textContent = "Dubs";
    document.getElementById("currentRunTime").textContent = "Your finalTime: " + time.toFixed(2) + "s";

    const best = localStorage.getItem("bestTime");
    const bestNum = best ? parseFloat(best) : Infinity;
    document.getElementById("classement").textContent = (time <= bestNum) ? "New record!" : "Try again to beat the record!";

    document.getElementById("messageAfterCompletingMaze").hidden = false;
    updateFastestRun();
};