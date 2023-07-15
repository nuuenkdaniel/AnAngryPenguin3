const MovementPiece = require('./MovementPiece');

class Bishop extends MovementPiece{
    constructor(color, tileX, tileY, board){
        super(color, tileX, tileY, board);
    }

    //Returns an array of all possible moves of this bishop
    getMoveInfo(mode){
        let topLeftMoves = this.getPossibleMoves(-1,-1,this.board,mode);
        let topRightMoves = this.getPossibleMoves(1,-1,this.board,mode);
        let botRightMoves = this.getPossibleMoves(1,1,this.board,mode);
        let botLeftMoves = this.getPossibleMoves(-1,1,this.board,mode);

        return topLeftMoves.concat(topRightMoves).concat(botRightMoves).concat(botLeftMoves);
    }
    getType(){
        return "bishop";
    }
}

module.exports = Bishop;