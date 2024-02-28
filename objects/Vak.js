class Vak {
    constructor(x, y, size, colour) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.colour = colour;
        this.occupation = null;
    }

    // Return: de x-coördinaat van het scherm (float) 
    getX() {
        return this.x;
    }

    // Return: de x-index van het vak op het bord (int)
    getXNumber() {
        return Math.round(this.x/this.size);
    }

    // Return: de y-coördinaat van het scherm (float)
    getY() {
        return this.y;
    }

    // Return: de y-index van het vak op het bord (int)
    getYNumber() {
        return Math.round(this.y/this.size);
    }

    // Return: De grootte van het vak (float)
    getSize() {
        return this.size;
    }

    // Return: De kleur van het vak (String)
    getColour() {
        return this.colour;
    }

    // Return: Schijf die op het vak staat (Schijf)
    getOccupation() {
        return this.occupation;
    }

    // Verander wat er op het vak staat    
    setOccupation(schijf) {
        this.occupation = schijf;
    }
}