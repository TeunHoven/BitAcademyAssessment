class Game {
    constructor(ctx, size, type) {
        this.ctx = ctx;

        // Game variabelen
        this.size = size;
        this.cellSize = this.size/10;
        this.gameType = type;
        this.playerWhite = null;
        this.playerBlack = null;
        this.board = new Board(this.cellSize);
        this.turn = this.playerWhite;
        this.winner = "";
        
        this.selectedVak = null;

        // Variabelen om zetten terug te draaien
        this.moveHistory = [];
        this.moveIndex = null;

        // Initialiseer het bord
        this.resetGame();
        this.draw();
    }

    ///
    ///             TEKEN FUNCTIES
    ///

    // Functie om de game te tekenen op het scherm
    draw() {
        if(this.winner == "") {
            this.ctx.clearRect(0, 0, this.size, this.size);
            this.drawBoard();

            // Als er een steen geselecteerd is, geef de mogelijke zetten weer
            if(this.selectedVak != null) {
                this.drawMoveVak(this.selectedVak.getX(), this.selectedVak.getY(), this.selectedVak.getSize());

                let possibleMoves = this.board.getMoves(this.selectedVak.getOccupation());
                console.log(possibleMoves)

                for(let i in possibleMoves) {
                    let vak = possibleMoves[i].getToVak();
                    let moveType = possibleMoves[i].getMoveType();

                    if(moveType == "Move") {
                        this.drawMoveVak(vak.getX(), vak.getY(), vak.getSize());
                    } else if(moveType == "Hit") {
                        this.drawHitVak(vak.getX(), vak.getY(), vak.getSize());

                        let vakNaEnemySchijf = possibleMoves[i].getVakNaToVak();
                        this.drawMoveVak(vakNaEnemySchijf.getX(), vakNaEnemySchijf.getY(), vakNaEnemySchijf.getSize());
                    }
                }
            }

            // Als de speler een steen van de tegenstander kan raken, dan geef dat weer
            if(this.turn.playerMustHit()) {
                let mustHitSchijven = this.turn.getMustHitSchijven();

                for(let i in mustHitSchijven) {
                    let schijf = mustHitSchijven[i];

                    if(schijf.getColour() == this.turn.getColour()) {
                        let moves = this.board.getMoves(schijf);

                        for(let i in moves) {
                            let move = moves[i];

                            if(move.getMoveType() == "Hit") {
                                this.drawHitVak(move.getToVak().getX(), move.getToVak().getY(), move.getToVak().getSize());
                            }
                        }
                    }
                }
            }

            // Verander de tekst op het scherm elke keer als de game hertekent wordt
            if(this.turn == this.playerWhite) {
                document.getElementById('turn').innerText = "Speler wit is aan zet";
            } else {
                document.getElementById('turn').innerText = "Speler zwart is aan zet";
            }

            document.getElementById('score-white').innerText = "Score wit: " + this.playerWhite.getScore();
            document.getElementById('score-black').innerText = "Score zwart: " + this.playerBlack.getScore();
        }
    }

    // Functie om het bord te tekenen op het scherm
    drawBoard() {
        let vakken = this.board.getVakken();
        for(let i in vakken) {
            let vak = vakken[i];
            this.ctx.fillStyle = vak.getColour();
            this.ctx.fillRect(vak.getX(), vak.getY(), vak.getSize(), vak.getSize());

            // Teken een damsteen op het vakje als het vakje niet vrij is
            if(vak.getOccupation() != null) {
                this.ctx.beginPath();
                this.ctx.fillStyle = vak.getOccupation().getColour();  
                this.ctx.arc(vak.getX()+this.cellSize/2, vak.getY()+this.cellSize/2, this.cellSize/2, 0, 2*Math.PI);

                this.ctx.fill(); 

                // Teken een 2 boven de steen als het een dubbele is
                if(vak.getOccupation().getType() == "double"){
                    this.ctx.beginPath();
                    this.ctx.fillStyle = (vak.getOccupation().getColour() == "white") ? "black" : "white";    
                    ctx.font = "25px Arial";
                    this.ctx.fillText("2", vak.getX()+this.cellSize/3, vak.getY()+this.cellSize/1.5);
                }

                this.ctx.fill();              
            }
        }
    }

    // Teken een rood vakje als je een steen kan slaan
    drawHitVak(x, y, size) {
        this.ctx.beginPath();
        this.ctx.strokeWidth = 2;
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = "rgba(139, 0, 0, 0.35)";
        this.ctx.rect(x, y, size, size);
        this.ctx.fill();
        this.ctx.stroke();
    }

    // Teken een groen vakje als je daarheen kan lopen
    drawMoveVak(x, y, size) {
        this.ctx.beginPath();
        this.ctx.strokeWidth = 2;
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = "rgba(0, 102, 51, 0.25)";
        this.ctx.rect(x, y, size, size);
        this.ctx.fill();
        this.ctx.stroke();
    }

    ///
    ///             GAME LOGICA FUNCTIES
    ///

    // Handelt de zetten van de speler en de computer
    processMove(vakClicked) {
        if(this.moveIndex != null) {
            this.removeHistory();            // Verwijderd de geschiedenis van de moves als er iets terug gedraaid is en ondertussen gespeeld wordt.
        }

        let schijf = this.selectedVak.getOccupation();
        let moves = this.board.getMoves(schijf);
        let move = null;
        let validMove = false;
        
        for(let i in moves) {
            let moveVak = moves[i].getToVak();

            if(moves[i].getMoveType() == "Hit") {
                moveVak = moves[i].getVakNaToVak();
            }

            // Checkt of het geklikte vakje ook een vakje is van een mogelijke zet
            if(vakClicked.getX() == moveVak.getX() && vakClicked.getY() == moveVak.getY()) {
                validMove = true;
                move = moves[i];

                // Checkt of het vakje de andere kant van het bord is zodat er de steen naar een dubbele steen verandert
                if(schijf.getColour() == "white" && moveVak.getYNumber() == 0) {
                    schijf.setType("double");
                } else if(schijf.getColour() == "black" && moveVak.getYNumber() == 9) {
                    schijf.setType("double");
                }
            }
        }

        if(move != null) {
            let moveType = move.getMoveType();

            // Als de zet een 'normale' zet is
            if(validMove && moveType == "Move") {
                let oudVak = this.board.getVakByNumbers(schijf.getX(), schijf.getY());

                schijf.setX(vakClicked.getXNumber());
                schijf.setY(vakClicked.getYNumber());
                
                oudVak.setOccupation(null);
                vakClicked.setOccupation(schijf);

                this.moveHistory.unshift(move);     // Plaats de zet aan het begin van de zetten geschiedenis array

                this.changeTurn();

            // Als de zet een 'sla' zet is
            } else if(validMove && moveType == "Hit") {
                let vakEnemySchijf = move.getToVak();
                let oudVak = this.board.getVakByNumbers(schijf.getX(), schijf.getY());

                schijf.setX(vakClicked.getXNumber());
                schijf.setY(vakClicked.getYNumber());
                
                // Verwijder de damsteen van de lijst van de andere speler
                if(this.turn.getColour() == "white") {
                    this.playerBlack.removeSchijf(vakEnemySchijf.getOccupation());
                } else {
                    this.playerWhite.removeSchijf(vakEnemySchijf.getOccupation());
                }

                oudVak.setOccupation(null);
                vakClicked.setOccupation(schijf);
                vakEnemySchijf.setOccupation(null);
                this.turn.addScore(1);              // Voeg 1 punt toe aan de speler

                this.moveHistory.unshift(move);     // Plaats de zet aan het begin van de zetten geschiedenis array

                this.changeTurn();
            } else {
                this.selectedVak = null;
            }
        }
    }

    // Kijkt naar hoeveel stenen beiden spelers hebben; als 1 van de 2 geen stenen meer heeft dan heeft de andere gewonnen
    checkWinCondition() {
        if(this.playerWhite.getSchijven().length <= 0) {
            this.winner = "black";
            document.getElementById('turn').innerText = "Speler zwart heeft gewonnen!";
        } else if(this.playerBlack.getSchijven().length <= 0) {
            this.winner = "white";
            document.getElementById('turn').innerText = "Speler wit heeft gewonnen!";
        }

        // Knop om de game te resetten gaat aan
        if(this.winner != "") {
            document.getElementById("reset-game").disabled = false;
            document.getElementById("reset-game").style.visibility = "visible";

            document.getElementById("move-buttons").disabled = true;
            document.getElementById("move-buttons").style.visibility = "hidden";
        }
    }

    // Checkts voor de beurt of de speler een andere steen kan raken
    checkCanPlayerHit() {
        let schijven = this.turn.getSchijven();

        document.getElementById("hit").style.visibility = "hidden";

        for(let i in schijven) {
            let schijf = schijven[i];
            let moves = this.board.getMoves(schijf);

            for(let x in moves) {
                let move = moves[x];

                if(move.getMoveType() == "Hit") {
                    this.turn.setMustHit(true);
                    this.turn.addMustHitSchijf(schijf);
                    document.getElementById("hit").style.visibility = "visible";
                }
            }
        }
    }

    // AI logica, heel simpel... Het selecteert random zetten die de computer kan doen :) 
    generateMove() {
        if(this.turn.getType() == "computer") {
            let comp = this.turn;
            let schijven = this.turn.getSchijven();

            let allPossibleMoves = [];

            // Als de computer kan slaan
            if(comp.playerMustHit()) {
                const whichSchijf = Math.floor(Math.random() * comp.getMustHitSchijven().length);

                let moves = this.board.getMoves(comp.getMustHitSchijven()[whichSchijf]);
                const whichMove = Math.floor(Math.random() * moves.length);

                let move = moves[whichMove];

                this.selectedVak = move.getVakOrigin();
                this.processMove(move.getVakNaToVak());

            // Als de computer niet kan slaan
            } else {
                for(let i in schijven) {
                    let schijf = schijven[i];
                    let moves = this.board.getMoves(schijf);

                    for(let x in moves) {
                        let move = moves[x];
                        allPossibleMoves.push(move);
                    }
                }
                const whichMove = Math.floor(Math.random() * allPossibleMoves.length);

                let move = allPossibleMoves[whichMove];

                this.selectedVak = move.getVakOrigin();
                this.processMove(move.getToVak());
            }
        }
    }

    // Geeft de beurt aan de andere speler
    async changeTurn() {
        // Kijkt of er nog geen winnaar is
        if(this.winner == "") {
            if(this.moveHistory.length > 0) {
                document.getElementById("move-buttons").style.visibility = "visible";

                // Kijkt of de gebruiker aan de geschiedenis knop heeft gezeten
                if(this.moveIndex == null) {
                    document.getElementById("move-forward").disabled = true;
                } else {
                    document.getElementById("move-forward").disabled = false;
                }
            }

            this.turn.setMustHit(false);
            this.turn.resetMustHitSchijven();
            this.selectedVak = null;
            
            // Verandert de beurt
            if(this.turn == this.playerWhite) {
                this.turn = this.playerBlack;
            } else {
                this.turn = this.playerWhite;
            }

            this.checkCanPlayerHit();       // Checkt of de nieuwe speler de andere kan raken

            this.draw();                    // Update het scherm

            this.checkWinCondition();       // Controleert of de spelers geen stenen meer hebben

            const delay = ms => new Promise(res => setTimeout(res, ms)); // Help functie om de computer iets langzamer te laten reageren (iets menselijker)

            if(this.turn.getType() == "computer") {
                await delay(1000);          // Wacht 1 seconde voordat de computer een zet genereert
                this.generateMove();
            }   
        }
    }

    ///
    ///                 HELPER FUNCTIES
    ///

    // Ga terug naar de vorige zet
    moveBack() {
        if(this.moveIndex == null) {
            this.moveIndex = 0;
        }

        let move = this.moveHistory[this.moveIndex];
        let schijf = move.getSchijf();
        let vakOrigin = move.getVakOrigin();

        // Zet de schijf van de zet terug naar zijn oude vak
        schijf.setX(vakOrigin.getXNumber());
        schijf.setY(vakOrigin.getYNumber());
        vakOrigin.setOccupation(schijf)
        
        // Controleert wat voor een zet het was
        if(move.getMoveType() == "Move") {
            move.getToVak().setOccupation(null);
        } else if(move.getMoveType() == "Hit") {
            move.getToVak().setOccupation(move.getEnemySchijf());
            move.getVakNaToVak().setOccupation(null);

            // Plaatst de gepakken steen terug waar die stond
            if(schijf.getColour() == "white") {
                this.playerBlack.addSchijf(move.getEnemySchijf());
                this.playerWhite.setScore(this.playerWhite.getScore()-1);
            } else if(schijf.getColour() == "black") {
                this.playerBlack.addSchijf(move.getEnemySchijf());
                this.playerBlack.setScore(this.playerBlack.getScore()-1);
            }
        }

        // Verandert welke zet nu de huidige is
        if(this.moveIndex != this.moveHistory.length) {
            this.moveIndex += 1;
            this.changeTurn();
        } 
    }

    // Ga vooruit naar de volgende zet (mocht die er zijn)
    moveForward() {
        let move = this.moveHistory[this.moveIndex-1];
        let schijf = move.getSchijf();
        let toVak = move.getToVak();

        // Zet de schijf van de move terug naar zijn nieuwe vak
        schijf.setX(toVak.getXNumber());
        schijf.setY(toVak.getYNumber());
        toVak.setOccupation(schijf)
        move.getVakOrigin().setOccupation(null);
        
        // Controleert wat voor een zet het was
        if(move.getMoveType() == "Hit") {
            move.getToVak().setOccupation(null);
            move.getVakNaToVak().setOccupation(schijf);

            // Verwijdert de steen die gepakken is
            if(schijf.getColour() == "white") {
                this.playerBlack.removeSchijf(move.getEnemySchijf());
                this.playerWhite.setScore(this.playerWhite.getScore()+1);
            } else if(schijf.getColour() == "black") {
                this.playerBlack.removeSchijf(move.getEnemySchijf());
                this.playerBlack.setScore(this.playerBlack.getScore()+1);
            }
        }

        // Verandert welke zet nu de huidige is
        this.moveIndex -= 1;
        if(this.moveIndex <= 0) {
            this.moveIndex = null;
        }
        this.changeTurn();
    }

    // Verwijdert de geschiedenis tot aan de huidige zet
    removeHistory() {
        for(let i=0; i<this.moveIndex; i++) {
            this.moveHistory.shift();
        }

        this.moveIndex = null;
    }

    

    // Functie voor wanneer er wordt geklikt op het scherm
    onclick(x, y) {
        if(this.turn.getType() == "speler") {
            console.log("Clicked X: " + x + "; Y: " + y);
            let vakClicked = this.board.getVak(x, y);

            // Als de speler moet slaan
            if(this.turn.playerMustHit()) {
                console.log("Hit schijven");
                console.log(this.turn.mustHitSchijven)

                let schijfOnVak = vakClicked.getOccupation();
                let mustHitSchijven = this.turn.getMustHitSchijven();

                // Gaat door alle schijven die kunnen slaan
                for(let i in mustHitSchijven) {
                    let schijf = mustHitSchijven[i];

                    if(schijfOnVak != null && schijfOnVak.getX() == schijf.getX() && schijfOnVak.getY() == schijf.getY()) {
                        this.selectedVak = vakClicked;
                    } else if(this.selectedVak != null && schijfOnVak == null) { 
                        this.processMove(vakClicked);
                    }
                }

            // Als de speler kan lopen
            } else {
                if(vakClicked.getOccupation() != null) {
                    if(vakClicked.getOccupation().getColour() == this.turn.getColour()) {
                        this.selectedVak = vakClicked;
                    } else {
                        this.selectedVak = null;
                    }
                } else if(this.selectedVak != null && vakClicked.getOccupation() == null) {
                    this.processMove(vakClicked)
                } else {
                    this.selectedVak = null;
                }
            }

            this.draw();
        }
    }
    
    ///
    ///         INITIALIZATIE FUNCTIES
    ///

    // Resets de game naar de begin fase
    resetGame() {
        this.winner = "";
        this.moveHistory = [];
        this.cellSize = this.size/10;
        this.board = new Board(this.cellSize);
        this.selectedVak = null;

        if(this.gameType == 1) {
            this.playerWhite = new Player("white", "speler"); // Change to computer
            this.playerBlack = new Player("black", "computer");
        } else {
            this.playerWhite = new Player("white", "speler");
            this.playerBlack = new Player("black", "speler");
        }
        this.turn = this.playerWhite;

        this.fillBoard();
        this.draw();
    }

    // Zorgt ervoor dat alle stenen aan een vak gekoppeld zijn zodat ze getekent kunnen worden
    fillBoard() {
        let schijvenWhite = this.playerWhite.getSchijven();
        let schijvenBlack = this.playerBlack.getSchijven();
        let vakken = this.board.getVakken();

        for(let i in schijvenWhite) {
            let schijf = schijvenWhite[i];
            let index = (schijf.getY()*10) + schijf.getX();

            vakken[index].setOccupation(schijf);
        }

        for(let i in schijvenBlack) {
            let schijf = schijvenBlack[i];
            let index = (schijf.getY()*10) + schijf.getX();

            vakken[index].setOccupation(schijf);
        }
    }
}

