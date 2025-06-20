class Pedina {
    constructor(oggetto, posizione, color) {
        this.oggetto = oggetto;
        this.posizione = posizione; // { x: 0, y: 0 }
        this.color = color;
    }

    checkMove(newPosition) {
        return false;
    }


    isValidPosition(position) {
        return position.x >= 1 && position.x <= 8 && position.y >= 1 && position.y <= 8;
    }

    hasMoved(newPosition) {
        return this.posizione.x !== newPosition.x || this.posizione.y !== newPosition.y;
    }
}

class PedoneBianco extends Pedina {
    constructor(nome, posizione) {
        super(nome, posizione, 'bianco');
        this.firstMove = true;
    }    checkMove(newPosition) {
        if (!this.isValidPosition(newPosition) || !this.hasMoved(newPosition)) return false;

        const yDiff = newPosition.y - this.posizione.y;
        const xDiff = Math.abs(newPosition.x - this.posizione.x);

        // Cattura in diagonale (solo se c'è un pezzo nemico)
        if (yDiff === 1 && xDiff === 1) {
            let targetPiece = getPieceAtPosition(newPosition);
            return targetPiece != null && targetPiece.color == 'nero';
        }
        
        // Movimento in avanti (solo se la casella è libera)
        if (xDiff === 0) {
            // Controlla che la casella di destinazione sia libera
            if (!checkOccupato(newPosition)) {
                return false;
            }
            
            if (this.firstMove && (yDiff === 1 || yDiff === 2)) {
                // Per il movimento di due caselle, verifica che anche la casella intermedia sia libera
                if (yDiff === 2) {
                    const intermediatePosition = {x: this.posizione.x, y: this.posizione.y + 1};
                    if (!checkOccupato(intermediatePosition)) {
                        return false;
                    }
                }
                return true;
            } else if (!this.firstMove && yDiff === 1) {
                return true;
            }
        }
        
        return false;
    }
    
}

class PedoneNero extends Pedina {
    constructor(nome, posizione) {
        super(nome, posizione, 'nero');
        this.firstMove = true;
    }    checkMove(newPosition) {
        if (!this.isValidPosition(newPosition) || !this.hasMoved(newPosition)) return false;

        const yDiff = newPosition.y - this.posizione.y;
        const xDiff = Math.abs(newPosition.x - this.posizione.x);

        // Cattura in diagonale (solo se c'è un pezzo nemico)
        if (yDiff === -1 && xDiff === 1) {
            let targetPiece = getPieceAtPosition(newPosition);
            return targetPiece != null && targetPiece.color == 'bianco';
        }
        
        // Movimento in avanti (solo se la casella è libera)
        if (xDiff === 0) {
            // Controlla che la casella di destinazione sia libera
            if (!checkOccupato(newPosition)) {
                return false;
            }
            
            if (this.firstMove && (yDiff === -1 || yDiff === -2)) {
                // Per il movimento di due caselle, verifica che anche la casella intermedia sia libera
                if (yDiff === -2) {
                    const intermediatePosition = {x: this.posizione.x, y: this.posizione.y - 1};
                    if (!checkOccupato(intermediatePosition)) {
                        return false;
                    }
                }
                return true;
            } else if (!this.firstMove && yDiff === -1) {
                return true;
            }
        }
        
        return false;
    }

    canCaptureAt(newPosition) {
        const yDiff = newPosition.y - this.posizione.y;
        const xDiff = Math.abs(newPosition.x - this.posizione.x);

        if (yDiff === -1 && xDiff === 1) {
            let targetPiece = getPieceAtPosition(newPosition);
            return targetPiece != null && targetPiece.color == 'bianco';
        }
        return false;
    }
}

class Torre extends Pedina {
    constructor(nome, posizione, color) {
        super(nome, posizione, color);
    }

    checkMove(newPosition) {
        if (!this.isValidPosition(newPosition) || !this.hasMoved(newPosition)) return false;

        const xDiff = newPosition.x - this.posizione.x;
        const yDiff = newPosition.y - this.posizione.y;

        return (xDiff === 0 || yDiff === 0) && isPathClear(this.posizione, newPosition);
    }
}

class Cavallo extends Pedina {
    constructor(nome, posizione, color) {
        super(nome, posizione, color);
    }

    checkMove(newPosition) {
        if (!this.isValidPosition(newPosition) || !this.hasMoved(newPosition)) return false;

        const xDiff = Math.abs(newPosition.x - this.posizione.x);
        const yDiff = Math.abs(newPosition.y - this.posizione.y);

        return (xDiff === 2 && yDiff === 1) || (xDiff === 1 && yDiff === 2);
    }
}

class Alfiere extends Pedina {
    constructor(nome, posizione, color) {
        super(nome, posizione, color);
    }

    checkMove(newPosition) {
        if (!this.isValidPosition(newPosition) || !this.hasMoved(newPosition)) return false;

        const xDiff = Math.abs(newPosition.x - this.posizione.x);
        const yDiff = Math.abs(newPosition.y - this.posizione.y);

        return xDiff === yDiff && isPathClear(this.posizione, newPosition);
    }
}

class Regina extends Pedina {
    constructor(nome, posizione, color) {
        super(nome, posizione, color);
    }

    checkMove(newPosition) {
        if (!this.isValidPosition(newPosition) || !this.hasMoved(newPosition)) return false;

        const xDiff = Math.abs(newPosition.x - this.posizione.x);
        const yDiff = Math.abs(newPosition.y - this.posizione.y);

        return ((xDiff === yDiff) || (xDiff === 0 || yDiff === 0)) && isPathClear(this.posizione, newPosition);
    }
}

class Re extends Pedina {
    constructor(nome, posizione, color) {
        super(nome, posizione, color);
    }

    checkMove(newPosition) {
        if (!this.isValidPosition(newPosition) || !this.hasMoved(newPosition)) return false;

        const xDiff = Math.abs(newPosition.x - this.posizione.x);
        const yDiff = Math.abs(newPosition.y - this.posizione.y);

        return (xDiff <= 1 && yDiff <= 1);
    }
}
