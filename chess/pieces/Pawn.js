const Piece = require('./Piece');
class Pawn extends Piece{
    constructor(color, tileX, tileY, board, firstMove = true){
        super(color, tileX, tileY, board);
        this.firstMove = firstMove;
        this.justMoved2 = false;
    }

    getMoveInfo(mode){
        //If mode is checkedTiles then return 2 diagnol tiles to the piece
        if(mode === "checkedTiles"  ){
            if(this.getColor() == "black"){
                return this.getAltMvInfoBlackPawn();
            }
            return this.getAltMvInfoWhitePawn();
        }
        //If mode is not checkedTiles return possibleMoves
        if(this.getColor() == "black"){
            return this.getMoveInfoBlackPawn();
        }
        return this.getMoveInfoWhitePawn();
    }

    getAltMvInfoBlackPawn(){
        let possibleMoves = [];
        if((this.tileX-1 > -1) && (this.tileY+1 < this.board.boardWidth)){
            possibleMoves.push([this.tileX-1,this.tileY+1]);
        }
        if((this.tileX+1 < this.board.boardLength) && (this.tileY+1 < this.board.boardWidth)){
            possibleMoves.push([this.tileX+1,this.tileY+1]);
        }
        return possibleMoves;
    }

    getAltMvInfoWhitePawn(){
        let possibleMoves = [];
        if((this.tileX-1 > -1) && (this.tileY-1 > -1)){
            possibleMoves.push([this.tileX-1,this.tileY-1]);
        }
        if((this.tileX+1 < this.board.boardLength) && (this.tileY-1 > -1)){
            possibleMoves.push([this.tileX+1,this.tileY-1]);
        }
        return possibleMoves;
    }

    getMoveInfoBlackPawn(){
        let possibleMoves = [];
        //Is there a white piece to bottom left
        if((this.tileX-1 > -1) && (this.tileY+1 < this.board.boardWidth) && (this.board.getTile(this.tileX-1,this.tileY+1).isTileOccupied())){
            if(this.board.getTile(this.tileX-1,this.tileY+1).getPiece().getColor() === "white"){
                possibleMoves.push([this.tileX-1,this.tileY+1]);
            }
        }
        //Is there a white piece to bottom right
        if((this.tileX+1 < this.board.boardLength) && (this.tileY+1 < this.board.boardWidth) && (this.board.getTile(this.tileX+1,this.tileY+1).isTileOccupied())){
            if(this.board.getTile(this.tileX+1,this.tileY+1).getPiece().getColor() == "white"){
                possibleMoves.push([this.tileX+1,this.tileY+1]);
            }
        }
        //Can move down
        if((this.tileY+1 >= this.board.boardWidth) || (this.board.getTile(this.tileX,this.tileY+1).isTileOccupied())){
            return possibleMoves;
        }
        possibleMoves.push([this.tileX,this.tileY+1]);
        //Can move down 2 spaces if first move
        if(this.firstMove){
            if((this.tileY+2 >= this.board.boardWidth) || (this.board.getTile(this.tileX,this.tileY+2).isTileOccupied())){
                return possibleMoves;
            }
            possibleMoves.push([this.tileX,this.tileY+2]);
        }
        possibleMoves = this.enPassantBlack(possibleMoves);
        return possibleMoves;
    }

    getMoveInfoWhitePawn(){
        let possibleMoves = [];
        //Is there a black piece to top left
        if((this.tileX-1 > -1) && (this.tileY-1 > -1) && (this.board.getTile(this.tileX-1,this.tileY-1).isTileOccupied())){
            if(this.board.getTile(this.tileX-1,this.tileY-1).getPiece().getColor() == "black"){
                possibleMoves.push([this.tileX-1,this.tileY-1]);
            }
        }
        //Is there a black piecce to top right
        if((this.tileX+1 < this.board.boardLength) && (this.tileY-1 > -1) && (this.board.getTile(this.tileX+1,this.tileY-1).isTileOccupied())){
            
            if(this.board.getTile(this.tileX+1,this.tileY-1).getPiece().getColor() == "black"){
                possibleMoves.push([this.tileX+1,this.tileY-1]);
            }
        }
        //Can move up
        if((this.tileY-1 <= -1) || (this.board.getTile(this.tileX,this.tileY-1).isTileOccupied())){
            return possibleMoves;
        }
        possibleMoves.push([this.tileX,this.tileY-1]);
        //Can move down 2 spaces if first move
        if(this.firstMove){
            if((this.tileY-2 <= -1) || (board.getTile(this.tileX,this.tileY-2).isTileOccupied())){
                return possibleMoves;
            }
            possibleMoves.push([this.tileX,this.tileY-2]);
        }
        possibleMoves = this.enPassantWhite(possibleMoves);
        return possibleMoves
    }

    enPassantWhite(possibleMoves) {
        if(this.tileY === 3) {
            if(this.tileX > 0) {
                let tile = this.board.getTile(this.tileX-1,this.tileY);
                if(tile.isTileOccupied()) {
                    if(tile.getPiece().getType() === "pawn" && tile.getPiece().getColor() === "black") {
                        if(tile.getPiece().justMoved2 === true) possibleMoves.push([this.tileX-1,this.tileY-1]);
                    }
                }
            }
            if(this.tileX < this.board.boardLength-1) {
                let tile = this.board.getTile(this.tileX+1,this.tileY);
                if(tile.isTileOccupied()) {
                    if(tile.getPiece().getType() === "pawn" && tile.getPiece().getColor() === "black") {
                        if(tile.getPiece().justMoved2 === true) possibleMoves.push([this.tileX+1,this.tileY-1]);
                    }
                }
            }
        }
        return possibleMoves;
    }

    enPassantBlack(possibleMoves){
        if(this.tileY === 4){
            if(this.tileX > 0){
                let tile = this.board.getTile(this.tileX-1,this.tileY);
                if(tile.isTileOccupied()){
                    if(tile.getPiece().getType() === "pawn" && tile.getPiece().getColor() === "black"){
                        if(tile.getPiece().justMoved2 === true) possibleMoves.push([this.tileX-1,this.tileY+1]);
                    }
                }
            }
            if(this.tileX < this.board.boardLength-1){
                let tile = this.board.getTile(this.tileX+1,this.tileY);
                if(tile.isTileOccupied()){
                    if(tile.getPiece().getType() === "pawn" && tile.getPiece().getColor() === "black"){
                        if(tile.getPiece().justMoved2 === true) possibleMoves.push([this.tileX+1,this.tileY+1]);
                    }
                }
            }
        }
        return possibleMoves;
    }

    isFirstMove(){
        return this.firstMove;
    }

    setFirstMove(bool){
        this.firstMove = bool;
    }

    getType(){
        return "pawn";
    }
}

module.exports = Pawn;
