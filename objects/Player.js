class Player {
    constructor(colour, type) {
        this.colour = colour;
        this.score = 0;
        this.schijven = [];
        this.mustHit = false;
        this.mustHitSchijven = [];
        this.type = type;

        // Creeërt de schijven; op basis van de kleur geeft het de juist coördinaten
        if(colour == "white") {
            for(let y=9; y>5; y--) {
                if(y%2 != 0) {
                    for(let x=0; x<10; x += 2) {
                        this.schijven.push(new Schijf(x, y, this.colour));
                    }
                } else {
                    for(let x=1; x<10; x += 2) {
                        this.schijven.push(new Schijf(x, y, this.colour));
                    }
                }
            }
        } else if(colour == "black") {
            for(let y=0; y<4; y++) {
                if(y%2 == 0) {
                    for(let x=1; x<10; x += 2) {
                        this.schijven.push(new Schijf(x, y, this.colour));
                    }
                } else {
                    for(let x=0; x<10; x += 2) {
                        this.schijven.push(new Schijf(x, y, this.colour));
                    }
                }
            }
        }
        console.log(this.schijven)
    }

    // Return: De kleur van de speler ("white"/"zwart")
    getColour() {
        return this.colour;
    }

    //Return: De score van de speler (int)
    getScore() {
        return this.score;
    }

    // Voeg een getal aan de score toe
    addScore(add) {
        this.score += add;
    }

    // Verander de score naar een getal
    setScore(score) {
        this.score = score;
    }

    // Return: Array met schijven/stenen van de spelers (1d-array <Schijf>)
    getSchijven() {
        return this.schijven;
    }

    // Verwijdert een bepaalde schijf uit de schijf array 
    removeSchijf(schijf) {
        let newSchijven = []
        for(let i in this.schijven) {
            if(schijf.getY() != this.schijven[i].getY() || schijf.getX() != this.schijven[i].getX()) {
                newSchijven.push(this.schijven[i]);
            }
        }

        this.schijven = newSchijven;
    }

    // Voeg een bepaalde schijf/steen aan de array met schijven, mits de array niet de lengte heeft van de begin situatie (20)
    addSchijf(schijf) {
        if(this.schijven.length < 20) {
            this.schijven.push(schijf)
        }
    }

    // Verander of de speler een andere steen moet slaan
    setMustHit(mustHit) {
        this.mustHit = mustHit
    }
    
    // Return: boolean of de speler een andere steen moet slaan (boolean)
    playerMustHit() {
        return this.mustHit;
    }

    // Return: Array met alle schijven/stenen van de speler die een andere steen kunnen raken (1d array <Schijf>)
    getMustHitSchijven() {
        return this.mustHitSchijven
    }

    // Voeg een steen toe aan de schijven/stenen die de speler kan gebruiken om een andere steen te slaan
    addMustHitSchijf(schijf) {
        this.mustHitSchijven.push(schijf);
    }

    // Maak de lijst van schijven/stenen die de speler kan gebruiken om een andere steen te slaan leeg
    resetMustHitSchijven() {
        this.mustHitSchijven = [];
    }

    // Return: De type speler ("speler"/"computer")
    getType() {
        return this.type;
    }
}