class Move {
    constructor(schijf, vakOrigin, toVak, moveType, vakNaToVak) {
        this.schijf = schijf;
        this.vakOrigin = vakOrigin;
        this.toVak = toVak;
        this.moveType = moveType;
        this.enemySchijf = null;
        this.vakNaToVak = null;

        if(this.moveType == "Hit") {
            this.enemySchijf = this.toVak.getOccupation();
            this.vakNaToVak = vakNaToVak;
        }
    }

    // Return: De schijf waar de zet mee is gedaan (Schijf)
    getSchijf() {
        return this.schijf;
    }

    // Return: Het vak waar de schijf oorspronkelijk stond (Vak)
    getVakOrigin() {
        return this.vakOrigin;
    }

    // Return: Het vak waar de schijf naartoe is verplaatst (Vak)
    getToVak() {
        return this.toVak;
    }

    // Return: De type van de zet ("Move"/"Hit")
    getMoveType() {
        return this.moveType;
    }

    // Return: Mocht het type een "Hit" zijn dan hier de geslagen schijf (Schijf); anders null (null)
    getEnemySchijf() {
        return this.enemySchijf;
    }

    // Return: Mocht het type "Hit" zijn dan hier het vak die na de geslagen schijf komt (Vak); anders null (null)
    getVakNaToVak() {
        return this.vakNaToVak;
    }
}