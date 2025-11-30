let maze = []; // inisialisation de la matice du labyrinthe

// fonction pour mixer une matrice
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

// fonction DFS pour générer la matrice du maze à l'aléatoire 
function randomGenMaze(row, col) {
    maze[row][col] = 0; // la case initial dans la fonction est affectée la valeur zéro (path)
    
    let directions = shuffle([[-2, 0], [2, 0], [0, -2], [0, 2]]); // randomization de la direction
    
    for (let [directionRow, directionCol] of directions) {
        let newRow = row + directionRow; // indice future colonne
        let newCol = col + directionCol; // indice future ligne
        
        // entre la case future et la courante la case entre eux, si elle n'est pas à l'extreme et est un mur, est sculpté en route (affectée la valeur 0)
        if (newRow > 0 && newRow < maze.length - 1 && newCol > 0 && newCol < maze[0].length - 1 && maze[newRow][newCol] === 1) {
            maze[row + directionRow / 2][col + directionCol / 2] = 0; // affectation de la valeur 0 après validation des conditions
            randomGenMaze(newRow, newCol); // appelle de la fonction à elle même
        }
    }   
}

let cellSize = 50; // initialiser la taille de chaque case en 40 pixels

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            let value = maze[row][col];

            if (value === 1) ctx.fillStyle = "black"; // mur est noir

            else if (value === 0) ctx.fillStyle = "white"; // route est blanche  
            
            else ctx.fillStyle = "green"; // exit en vert (j'ai affecté a cette case 2 mais oublié où et il est temps de dodo)

            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize); // remplissage des cases avec leurs couleurs adéquates
            ctx.strokeStyle = "gray"; // les lignes de seperation des case est gris 
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize); // dessin des lignes de separation
        }
    }
};

// initialisation du player et sa position 
let player = {
    row: 1,
    col: 1,
    size: cellSize * 0.6
};

// fonction pour dessiner le player dans la forme d'un cercle rouge
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

document.addEventListener("keydown", handleMovement); // pour que le player réponds à l'appui des flèches du device

let gameFrozen = false; // initialisation de gameFrozen false pour pouvoir jouer la première partie

function handleMovement(event) {
    if (gameFrozen) return; // prevenir le player de mouvoir dans le background du pop up

    // initialisation des prochaines coordonnées du player
    let newRow = player.row;
    let newCol = player.col;

    // incrémentation de la coordonnées prochaines du player suivant la flèches appuite
    if (event.key === "ArrowUp") newRow--; // haut

    else if (event.key === "ArrowDown") newRow++; // bas

    else if (event.key === "ArrowLeft") newCol--; // gauche

    else if (event.key === "ArrowRight") newCol++; // droite

    else return; // sinon rien

    // collision (les coordonnées prochaines sont ignorée si le player va entrer dans un mur)
    if (maze[newRow][newCol] === 1) {
        return;
    }
    // sinon les coordonnées sont affectées et sa position est changée
    player.row = newRow;
    player.col = newCol;

    render();

    // si l'exit est atteinte lancement de la fonction mazeSolved
    if (maze[newRow][newCol] === 2) {
        mazeSolved();
    }
}; 
 
// initialisation des variables nécessaires du chrono 
let startTime = null;
let timerInterval = null;
let currentRunTime = 0;

// initialisation du nombre de case de la matrice du maze
let rows = 15;
let cols = 15;

// attribution des valeurs (qui seront le nombres de cases de la matrice du labyrinthe) à chaque difficulté
const difficulties = { 
    easy: 15,
    medium: 25,
    hard: 35
};

const startRunButton = document.getElementById("startRunButton");
const currentRunTimeP = document.getElementById("currentRunTime");

startRunButton.addEventListener("click", startRun); // à l'appui de start la partie se lance

function startRun() {
    if (gameFrozen) return; // sinon en clickant sur start avant nice, le timer peut se lancer dans le popup sans pouvoir mouvoir le player

    const difficulty = document.getElementById("difficultySelect").value; // obtention de la taille du labyrinthe à partir de la difficulté selectionnée

    rows = difficulties[difficulty]; // la taille du labyrinthe dependra de la difficulté selectionnée
    cols = difficulties[difficulty];

    cellSize = canvas.width / cols; // pour que le labyrinthe reste contenu dans le canvas

    const startingPoint = [1, rows - 2, cols - 2]; // les coordonnées qui peuvent être celles de la ligne où colonnes du player 
                                                   // avec toute combinaison 2 à 2 permet que le player debute à l'un des quatre extrême 

    player.row = startingPoint[Math.floor(Math.random() * 3)]; // la ligne où le player debutera générée à l'aléatoire
    player.col = startingPoint[Math.floor(Math.random() * 3)]; // la colonne où le player debutera générée à l'aléatoire
    player.size = cellSize * 0.6;

    const endPointRow = rows - (player.row + 1); // les coordonnées du exit sont symetriques par rapport au centre du labyrinthe
    const endPointCol = cols - (player.col + 1); // par exemple quand le player sera à l'extreme haut-gauche l'exit sera bas-droite

    maze = Array.from({ length: rows }, () => Array(cols).fill(1)); // au début le labyrinthe est initialisé sans route (la matrice n'est que des 1)  
    randomGenMaze(player.row, player.col); // à l'aide d'un algorithme DFS les routes seront "sculptés" dans le labyrinthe 
    maze[endPointRow][endPointCol] = 2; // l'exit est à l'extreme opposé de celui du player 
    

    startTime = Date.now(); 
    currentRunTime = 0;

    document.getElementById("messageAfterCompletingMaze").hidden = false;
    // le chrono de la partie précédente est arrêté si cette dernière est interrompue par l'appui du bouton start avant d'atteindre l'exit
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    // le chrono de cette partie se lance
    timerInterval = setInterval(() => { 
        currentRunTime = (Date.now() - startTime) / 1000;
        currentRunTimeP.textContent = "Your time: " + currentRunTime.toFixed(2) + "s";
    }, 50);

    updateFastestRun(); // affichage du meilleur temps de la difficulté selectionnée
    drawMaze(); // le labyrinthe est generé à partir de la matrice
    render(); 
    resizeCanvas();
}

function saveBestTime(time) {
    // un meilleur temps est sauvegardé pour chaque difficulté
    const difficulty = document.getElementById("difficultySelect").value; // récuperation de la difficulté

    const key = "bestTime_" + difficulty;

    const best = localStorage.getItem(key); // récuperation du meilleur temps pour la diffficulté selectionnée
    // comparaison du temps courant avec le meilleur de cette difficulté 
    if (!best || time < parseFloat(best)) {
        localStorage.setItem(key, time); // mise à jour du meilleur temps si le meilleur est battu
    }
};

const fastestRunP = document.getElementById("fastestRun"); // recuperation de la paragraphe où s'affichera le meilleur temps

function updateFastestRun() {
    const difficulty = document.getElementById("difficultySelect").value; // récuperation de la difficulté

    const key = "bestTime_" + difficulty;

    const best = localStorage.getItem(key); // récuperation du meilleur temps pour la diffficulté selectionnée

    if (best) {
        fastestRunP.textContent = "Fastest for the " + difficulty + " Run: " + parseFloat(best).toFixed(2) + "s"; // affichage du meilleur temps s'il existe au localStorage
    } else {
        fastestRunP.textContent = "Fastestfor the " + difficulty  + " Run: N/A"; // affichage de N/A si l'item n'existe pas encore au localStorage
    }
};

document.getElementById("difficultySelect").addEventListener("change", updateFastestRun()); // mise à jour de l'affichage du meilleur temps lors de la selection de difficulté

function mazeSolved() {
    clearInterval(timerInterval); // lorsque l'exit est atteinte le chrono est stoppé

    gameFrozen = true; // arrête le mouvement du player ou le lancement d'une nouvelle partie à l'appuoi de start dans la background du popup du completion message

    const finalTime = currentRunTime;

    saveBestTime(finalTime); // update du meilleur temps s'il est battu
    showCompletionMessage(finalTime); // pop up du message d'achevement de la partie si le meilleur temps est battu ou pas
    updateFastestRun(); // mise à jour de l'affichage du meilleur temps au cas où le meilleur temps est battu
};

function showCompletionMessage(time) {
    document.getElementById("congrats").textContent = "Dubs"; // affichage de dubs
    document.getElementById("currentRunTime").textContent = "Your finalTime: " + time.toFixed(2) + "s"; // affichage du temps faits pour atteindre l'exit

    const difficulty = document.getElementById("difficultySelect").value; // recuperation de la difficulté
    const key = "bestTime_" + difficulty;
    const best = parseFloat(localStorage.getItem(key) || Infinity); // pour initialiser le temps de la première partie dans cette difficulté comme le meilleur en le comparant à l'infini due à l'abscence de meilleur temps de parties précédentes
    document.getElementById("classement").textContent = (best && time <= parseFloat(best)) ? "New record!" : "Try again!"; // si le meilleur temps est battu affichage de "New record" sinon "Try again"

    document.getElementById("messageAfterCompletingMaze").style.display = "block"; // style du pop up
};

document.getElementById("okBtn").addEventListener("click", () => {
    document.getElementById("messageAfterCompletingMaze").style.display = "none";
    gameFrozen = false;
}); // tout est ignoré jusqu'à l'appui du bouton nice pour évité le lancement de partie au background ou autre bug

document.getElementById("difficultySelect").addEventListener("change", updateFastestRun); // change l'affichage du meilleur temps lors de selection de la difficulté pour se préparer à le battre 
                                                                                          // mais attention pas de generation du labyrinthe avant l'appui du start button sinon c'est de la triche

function resizeCanvas() {
    // recuperer la taille visuelle du css
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientWidth; // pour que le canvas reste carré

    // mise à jour de la resolution
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    // recalculer la taille de chaque cellule
    cellSize = canvas.width / cols;
    // recalculer la taille du player
    player.size = cellSize * 0.6;

    // redessiner tous
    render();
}

// adapte la taille du canvas au changement de la taille de la tab
window.addEventListener("resize", resizeCanvas);