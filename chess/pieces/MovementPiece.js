const Piece = require('./Piece');

class MovementPiece extends Piece{
    constructor(color, tileX, tileY, board){
        if(constructor == MovementPiece){
            throw new error("Abstract classes can't be instantiated.");
        }
        super(color, tileX, tileY, board);
    }

    getPossibleMoves(moveX,moveY,board,mode){
        let tMoveX = this.tileX+moveX;
        let tMoveY = this.tileY+moveY;
        let possibleMoves = [];
        //Loops and appends possibleMoveCoords if position is within boundaries of the board
        while(((tMoveX < board.boardLength) && (tMoveX > -1)) && ((tMoveY < board.boardWidth) && (tMoveY > -1))){
            //Stop piece before if same color piece is in the way unless mode is checkedTiles and stops on top if different color piece
            if(board.getTile(tMoveX,tMoveY).isTileOccupied()){
                //If piece is the same color and mode is checkedTiles add piece to list and break
                if(mode === "checkedTiles"){
                    possibleMoves.push([tMoveX,tMoveY]);
                    break;
                }
                //If piece is a different color add piece to the list and break
                if(board.getTile(tMoveX,tMoveY).getPiece().getColor() != this.getColor()){
                    possibleMoves.push([tMoveX,tMoveY]);
                }
                break;  
            }
            possibleMoves.push([tMoveX,tMoveY]);
            tMoveX += moveX;
            tMoveY += moveY;
        }
        return possibleMoves;
    }

    getMoveInfo(){
        throw new error("Method 'getMoveInfo()' must be implemented");
    }
}

module.exports = MovementPiece;