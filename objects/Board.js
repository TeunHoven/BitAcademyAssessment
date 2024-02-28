class Board {
    constructor(cellSize) {
        this.vakken = [];
        this.cellSize = cellSize;

        this.createBoard();
    }

    // Zorgt dat de vakjes van het bord in de array komen en de juiste kleur krijgt
    createBoard() {
        for(let i=0; i < 100; i++) {
            let x = i%10;
            let y = Math.floor(i/10);
            let colour = "";


            // Op basis van de coordinaten, verander de kleur van het vakje
            if(y%2 == 0){
                if(x%2 == 0) {
                    colour = "rgb(226, 200, 174)";
                } else {
                    colour = "rgb(154, 83, 26)";
                }
            } else {
                if(x%2 == 0) {
                    colour = "rgb(154, 83, 26)";
                } else {
                    colour = "rgb(226, 200, 174)";
                }
            }
            let vak = new Vak(x*this.cellSize, y*this.cellSize, this.cellSize, colour);

            this.vakken.push(vak);
        }
    }
    
    // Functie om te kijken of de schijf naar een ander vak kan
    // Return: De zet die de schijf naar dat vak kan maken (Move); kan de schijf niet naar het vak dan null (null)
    getValidMove(schijf, toVak) {
        let toVakOccupation = toVak.getOccupation();
        let directionX = toVak.getXNumber() - schijf.getX();
        let directionY = toVak.getYNumber() - schijf.getY();

        // Checkt of het vak leeg is
        if(toVakOccupation == null) {
            let vakOrigin = this.getVakByNumbers(schijf.getX(), schijf.getY());

            if(schijf.getColour() == "white" && schijf.getType() == "single") {
                if(directionY < 0) {
                    return new Move(schijf, vakOrigin, toVak, "Move", null);
                }
            } else if(schijf.getColour() == "black" && schijf.getType() == "single") {
                if(directionY > 0) {
                    return new Move(schijf, vakOrigin, toVak, "Move", null);
                }
            } else if(schijf.getType() == "double") {
                return new Move(schijf, vakOrigin, toVak, "Move", null);                
            }

        // Als het vak niet leeg is, check of de steen geslagen kan worden
        } else {
            if(schijf.getColour() != toVakOccupation.getColour()) {
                let vakNaToVak = null;

                // Welke kant slaat de steen op
                if(directionX < 0) {
                    // Linksboven kijken
                    if(directionY < 0) {
                        let index = Math.round(((toVak.getYNumber() - 1) * 10) + (toVak.getXNumber()-1));
                        if(toVak.getXNumber() != 0 && toVak.getYNumber() != 9) {
                            vakNaToVak = this.vakken[index];
                        }
                    // Linksonder kijken
                    } else {
                        let index = Math.round(((toVak.getYNumber() + 1) * 10) + (toVak.getXNumber()-1));
                        if(toVak.getXNumber() != 0 && toVak.getYNumber() != 0) {
                            vakNaToVak = this.vakken[index];
                        }
                    }
                } else {
                    // Rechtsboven kijken
                    if(directionY < 0) {
                        let index = Math.round(((toVak.getYNumber() - 1) * 10) + (toVak.getXNumber()+1));
                        if(toVak.getXNumber() != 9 && toVak.getYNumber() != 9) {
                            vakNaToVak = this.vakken[index];
                        }
                    // Rechtsonder kijken
                    } else {
                        let index = Math.round(((toVak.getYNumber() + 1) * 10) + (toVak.getXNumber()+1));
                        if(toVak.getXNumber() != 9 && toVak.getYNumber() != 0) {
                            vakNaToVak = this.vakken[index];
                        }
                    }
                }

                // Als het vak na de tegenstanders schijf vrij is, maak een Move
                if(vakNaToVak != null && vakNaToVak.getOccupation() == null) {
                    return new Move(schijf, this.getVakByNumbers(schijf.getX(), schijf.getY()), toVak, "Hit", vakNaToVak);
                }
            }
        }

        return null;
    }

    // Scant alle mogelijke zetten
    // Return: Array met alle mogelijke zetten (1d-array <Move>)
    getMoves(schijf) {
        let schijfX = schijf.getX();
        let schijfY = schijf.getY();

        let validMoves = []

        // Schijf kan nog maar 1 stap per keer zetten
        if(schijf.getType() == "single") {
            // Checkt of het vak linksboven de schijf vrij is of iemand kan slaan
            if(schijfY != 0 && schijfX != 0) {
                let indexLeftTop = Math.round(((schijfY - 1) * 10) + (schijfX - 1));
                let vakLeftTop = this.vakken[indexLeftTop]
                let move = this.getValidMove(schijf, vakLeftTop);
                if(move != null) {
                    validMoves.push(move);
                }
            }

            // Checkt of het vak rechtsboven de schijf vrij is of iemand kan slaan
            if(schijfY != 0 && schijfX != 9) {
                let indexRightTop = Math.round(((schijfY - 1) * 10) + (schijfX + 1));
                let vakRightTop = this.vakken[indexRightTop]
                let move = this.getValidMove(schijf, vakRightTop);
                if(move != null) {
                    validMoves.push(move);
                }
            }

            // Checkt of het vak linksonder de schijf vrij is of iemand kan slaan
            if(schijfY != 9 && schijfX != 0) {
                let indexLeftBottom = Math.round(((schijfY + 1) * 10) + (schijfX - 1));
                let vakLeftBottom = this.vakken[indexLeftBottom]
                let move = this.getValidMove(schijf, vakLeftBottom);
                if(move != null) {
                    validMoves.push(move);
                }
            }

            // Checkt of het vak rechtsonder de schijf vrij is of iemand kan slaan
            if(schijfY != 9 && schijfX != 9) {
                let indexRightBottom = Math.round(((schijfY + 1) * 10) + (schijfX + 1));
                let vakRightBottom = this.vakken[indexRightBottom]
                let move = this.getValidMove(schijf, vakRightBottom);
                if(move != null) {
                    validMoves.push(move);
                }
            }

        // Schijf kan 'oneindig' stappen zetten per keer
        } else if(schijf.getType() == "double") {
            let canStillGoLeftTop = true;
            let canStillGoRightTop = true;
            let canStillGoLeftBottom = true;
            let canStillGoRightBottom = true;

            // Scant alles mogelijke vakjes
            for(let i=1; i<12; i++) {
                // Checkt of het vak linksboven de schijf vrij is of iemand kan slaan
                if(schijfY != 0 && schijfX != 0 && canStillGoLeftTop) {
                    let indexLeftTop = Math.round(((schijfY - i) * 10) + (schijfX - i));

                    if(schijfY - i >= 0 && schijfX - i >= 0) {
                        let vakLeftTop = this.vakken[indexLeftTop]
                        let move = this.getValidMove(schijf, vakLeftTop);
                        if(move != null) {
                            validMoves.push(move);

                            if(move.getMoveType() == "Hit") {
                                canStillGoLeftTop = false;
                            }
                        } else {
                            canStillGoLeftTop = false;
                        }
                    } else {
                        canStillGoLeftTop = false;
                    }
                }

                // Checkt of het vak rechtsboven de schijf vrij is of iemand kan slaan
                if(schijfY != 0 && schijfX != 9 && canStillGoRightTop) {
                    let indexRightTop = Math.round(((schijfY - i) * 10) + (schijfX + i));

                    if(schijfY - i >= 0 && schijfX + i <= 9) {
                        let vakRightTop = this.vakken[indexRightTop]
                        let move = this.getValidMove(schijf, vakRightTop);
                        if(move != null) {
                            validMoves.push(move);

                            if(move.getMoveType() == "Hit") {
                                canStillGoRightTop = false;
                            }
                        } else {
                            canStillGoRightTop = false;
                        }
                    } else {
                        canStillGoRightTop = false;
                    }
                }

                // Checkt of het vak linksonder de schijf vrij is of iemand kan slaan
                if(schijfY != 9 && schijfX != 0 && canStillGoLeftBottom) {
                    let indexLeftBottom = Math.round(((schijfY + i) * 10) + (schijfX - i));

                    if(schijfY + i <= 9 && schijfX - i >= 0) {
                        let vakLeftBottom = this.vakken[indexLeftBottom]
                        let move = this.getValidMove(schijf, vakLeftBottom);
                        if(move != null) {
                            validMoves.push(move);

                            if(move.getMoveType() == "Hit") {
                                canStillGoLeftBottom = false;
                            }
                        } else {
                            canStillGoLeftBottom = false;
                        }
                    } else {
                        canStillGoLeftBottom = false;
                    }
                }

                // Checkt of het vak rechtsonder de schijf vrij is of iemand kan slaan
                if(schijfY != 9 && schijfX != 9 && canStillGoRightBottom) {
                    let indexRightBottom = Math.round(((schijfY + i) * 10) + (schijfX + i));

                    if(schijfY + i <= 9 && schijfX + i <= 9) {
                        let vakRightBottom = this.vakken[indexRightBottom]
                        let move = this.getValidMove(schijf, vakRightBottom);
                        if(move != null) {
                            validMoves.push(move);

                            if(move.getMoveType() == "Hit") {
                                canStillGoRightBottom = false;
                            }
                        } else {
                            canStillGoRightBottom = false;
                        }
                    } else {
                        canStillGoRightBottom = false;                        
                    }
                }
            }
        }

        // Scant of de steen anderen kan slaan, zo ja --> dan zijn de mogelijke zetten alleen de zetten waar de steen iemand kan slaan
        let attackMoves = [];
        console.log("Valid moves");
        console.log(validMoves)

        for(let i in validMoves) {
            let move = validMoves[i];
            let moveType = move.getMoveType();

            if(moveType == "Hit") {
                attackMoves.push(move);
            }                
        }

        if(attackMoves.length != 0) {
            validMoves = attackMoves;
        }
        return validMoves;
    }

    // Return: Alle vakken op het bord (1d-array <Vak>)
    getVakken() {
        return this.vakken;
    }

    // Return: 1 vak op basis van de x- en y-index op het bord (Vak)
    getVakByNumbers(x, y) {
        let index = (y*10) + x;

        return this.vakken[index];
    }

    // Return: 1 vak op basis van de x- en y-coördinaat van het scherm (Vak)
    getVak(x, y) {
        for(let i in this.vakken) {
            let vak = this.vakken[i];

            if(x > vak.getX() && x < (vak.getX() + vak.getSize()) && y > vak.getY() && y < (vak.getY() + vak.getSize())) {
                return vak;
            }
        }
    }
}