const MovementPiece = require('./MovementPiece');

class Rooke extends MovementPiece{
    constructor(color, tileX, tileY, board, firstMove = true){
        super(color, tileX, tileY, board);
        this.firstMove = firstMove;
    }

    isFirstMove(){
        return this.firstMove;
    }
    
    setFirstMove(bool){
        this.firstMove = bool;
    }

    getMoveInfo(mode){
        let up = this.getPossibleMoves(0,-1,this.board,mode);
        let right = this.getPossibleMoves(1,0,this.board,mode);
        let down = this.getPossibleMoves(0,1,this.board,mode);
        let left = this.getPossibleMoves(-1,0,this.board,mode);

        return up.concat(right).concat(down).concat(left);
    }
    getType(){
        return "rooke";
    }
}

module.exports = Rooke;