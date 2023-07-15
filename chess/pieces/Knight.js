const Piece = require('./Piece');

class Knight extends Piece{
    constructor(color, tileX, tileY, board){
        super(color, tileX, tileY, board);
    }

    //Checks if move is a possibleMove is possible and returns it
    getPossibleMoves(moveX,moveY,board,possibleMoves,mode){
        let tMoveX = this.tileX+moveX;
        let tMoveY = this.tileY+moveY;
        //Make sure move is with bounds of the board
        if(((tMoveX < board.boardLength) && (tMoveX > -1)) && ((tMoveY < board.boardWidth) && (tMoveY > -1))){
            //If not mode is not checkedTiles then skip this
            if(mode !== "checkedTiles"){
                // If piece is on move return
                if((board.getTile(tMoveX,tMoveY).isTileOccupied()) && (board.getTile(tMoveX,tMoveY).getPiece().getColor() == this.getColor())){
                    return;
                }
            }
            possibleMoves.push([tMoveX,tMoveY]);
        }
    }

    getMoveInfo(mode){
        let possibleMoves = [];
        this.getPossibleMoves(-1,-2,this.board,possibleMoves,mode);
        this.getPossibleMoves(1,-2,this.board,possibleMoves,mode);
        this.getPossibleMoves(2,-1,this.board,possibleMoves,mode);
        this.getPossibleMoves(2,1,this.board,possibleMoves,mode);
        this.getPossibleMoves(1,2,this.board,possibleMoves,mode);
        this.getPossibleMoves(-1,2,this.board,possibleMoves,mode);
        this.getPossibleMoves(-2,1,this.board,possibleMoves,mode);
        this.getPossibleMoves(-2,-1,this.board,possibleMoves,mode);

        return possibleMoves;
    }
    getType(){
        return "knight";
    }
}

module.exports = Knight;