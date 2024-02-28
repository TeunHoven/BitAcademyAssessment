class Schijf {
    constructor(x, y, colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.type = "single";
    }

    // Return: de x-index van de schijf op het bord (int)
    getX() {
        return this.x;
    }

    // Verander de x-index van de schijf op het bord
    setX(x) {
        this.x = Math.round(x);
    }

    // Return: de y-index van het vak op het bord (int)
    getY() {
        return this.y;
    }

    // Verander de y-index van de schijf op het bord
    setY(y) {
        this.y = Math.round(y);
    }

    // Return: De kleur van de schijf ("white"/"black")
    getColour() {
        return this.colour;
    }

    // Return: De type van de schijf ("single"/"double")
    getType() {
        return this.type;
    }

    // Verander de type van de schijf
    setType(type) {
        if(type == "single") {
            this.type = type;
        } else if(type == "double") {
            this.type = type;
        }
    }
}