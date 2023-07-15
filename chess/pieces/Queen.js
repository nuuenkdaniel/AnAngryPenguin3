const MovementPiece = require('./MovementPiece');

class Queen extends MovementPiece{
    constructor(color, tileX, tileY, board){
        super(color, tileX, tileY, board);
    }

    getMoveInfo(mode){
        let up = this.getPossibleMoves(0,-1,this.board,mode);
        let right = this.getPossibleMoves(1,0,this.board,mode);
        let down = this.getPossibleMoves(0,1,this.board,mode);
        let left = this.getPossibleMoves(-1,0,this.board,mode);
        let topLeftMoves = this.getPossibleMoves(-1,-1,this.board,mode);
        let topRightMoves = this.getPossibleMoves(1,-1,this.board,mode);
        let botRightMoves = this.getPossibleMoves(1,1,this.board,mode);
        let botLeftMoves = this.getPossibleMoves(-1,1,this.board,mode);
        
        return up.concat(right).concat(down).concat(left).concat(topLeftMoves).concat(topRightMoves).concat(botRightMoves).concat(botLeftMoves);
    }
    getType(){
        return "queen";
    }
}

module.exports = Queen;
