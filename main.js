let canvas;
let ctx;
let canvasHTML = `
    <canvas id='canvas'></canvas>
`
let gameSize;
let game;

// Laat de game starten
function start(type) {
    let gameDiv = document.getElementById('game')
    gameDiv.innerHTML = canvasHTML;
    console.log("Started");

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // Kijkt welke groter is en pakt de kleinere voor een mooi gelijk bord
    if(window.innerWidth > window.innerHeight) {
        gameSize = window.innerHeight-10;
    } else {
        gameSize = window.innerWidth-10;
    }

    canvas.width = gameSize;
    canvas.height = gameSize;

    game = new Game(ctx, gameSize, type);

    // Zorgt ervoor dat de juiste x- en y-coördinaten worden doorgegeven aan de game logica
    canvas.addEventListener('click', function(event) {
        let canvasLeft = canvas.offsetLeft + canvas.clientLeft;
        let canvasTop = canvas.offsetTop + canvas.clientTop;

        let x = event.pageX - canvasLeft;
        let y = event.pageY - canvasTop;

        game.onclick(x, y);
    });
}

// Om een zet terug te gaan
function moveBack() {
    game.moveBack();
}

// Om een zet vooruit te gaan als het mogelijk is
function moveForward() {
    game.moveForward();
}

// Resets de game als het potje afgelopen is
function resetGame() {
    game.resetGame();
}