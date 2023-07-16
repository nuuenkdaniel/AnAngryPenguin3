const Tile = require('./Tile.js');
const Bishop = require('../pieces/Bishop.js');
const King = require('../pieces/King.js');
const Knight = require('../pieces/Knight.js');
const Pawn = require('../pieces/Pawn.js');
const Queen = require('../pieces/Queen.js');
const Rooke = require('../pieces/Rooke.js');

class ChessBoard{
    constructor(boardLength,boardWidth,tileSize,board = []){
        this.boardLength = boardLength;
        this.boardWidth = boardWidth;
        this.tileSize = tileSize;
        this.board = board;
        this.createBoard();
        this.whiteKing;
        this.blackKing;
    }

    createBoard(){
        let color = "#FFFFFF";
        let otherColor = "#A52A2A";
        let tempColor;
        for(let i = 0; i < this.boardLength; i++){
            this.board[i] = [];
            if(i!=0){
                tempColor = color;
                color = otherColor;
                otherColor = tempColor;
            }
            for(let j = 0; j < this.boardWidth; j++){
                this.board[i][j] = new Tile(i,j,color,this.tileSize);
                tempColor = color;
                color = otherColor;
                otherColor = tempColor;
            }
        }
    }

    getTile(x,y){
        return this.board[x][y];
    }

    defaultBoardSetUp(){
        //black pieces set up
        let color = "black";
        for(let i = 0; i < this.boardLength; i++){
            this.getTile(i,1).plPiece(new Pawn(color, i, 1, this, true));
        }
        this.getTile(0,0).plPiece(new Rooke(color, 0, 0, this));
        this.getTile(1,0).plPiece(new Knight(color, 1, 0, this));
        this.getTile(2,0).plPiece(new Bishop(color, 2, 0, this));
        this.getTile(3,0).plPiece(new Queen(color, 3, 0, this));
        this.getTile(4,0).plPiece(new King(color, 4, 0, this));
        this.getTile(5,0).plPiece(new Bishop(color, 5, 0, this));
        this.getTile(6,0).plPiece(new Knight(color, 6, 0, this));
        this.getTile(7,0).plPiece(new Rooke(color, 7, 0, this));
        this.blackKing = this.getTile(4,0).getPiece();

        //white pieces set up
        color = "white";
        for(let i = 0; i < this.boardLength; i++){
            this.getTile(i,6).plPiece(new Pawn(color, i, 6, this, true));
        }
        this.getTile(0,7).plPiece(new Rooke(color, 0, 7, this));
        this.getTile(1,7).plPiece(new Knight(color, 1, 7, this));
        this.getTile(2,7).plPiece(new Bishop(color, 2, 7, this));
        this.getTile(3,7).plPiece(new Queen(color, 3, 7, this));
        this.getTile(4,7).plPiece(new King(color, 4, 7, this));
        this.getTile(5,7).plPiece(new Bishop(color, 5, 7, this));
        this.getTile(6,7).plPiece(new Knight(color, 6, 7, this));
        this.getTile(7,7).plPiece(new Rooke(color, 7, 7, this));
        this.whiteKing = this.getTile(4,7).getPiece();
    }

    //With the assumption the tile selected has a piece
    movePiece(x1,y1,x2,y2){
        if(this.getTile(x2,y2).isTileOccupied()) {
            this.getTile(x2,y2).rmPiece();
        }
        for(let i = 0; i < 3; i++) {
            let pieces = ["pawn","king","rooke"];
            if(this.getTile(x1,y1).getPiece().getType() === pieces[i]){
                this.getTile(x1,y1).getPiece().setFirstMove(false);
                if(i === 0) {
                    if(Math.abs(y2-y1) === 2) this.getTile(x1,y1).getPiece().justMoved2 = true;
                    this.enPassant(x1,y1,x2,y2);
                }
                break;
            }
        }
        this.getTile(x2,y2).plPiece(this.getTile(x1,y1).getPiece());
        this.getTile(x2,y2).getPiece().giveX(x2);
        this.getTile(x2,y2).getPiece().giveY(y2);
        return this.getTile(x1,y1).rmPiece();
    }

    resetPawn(color){
        for(let i = 0; i < this.boardLength; i++) {
            for(let j = 0; j < this.boardWidth; j++) {
                if(this.getTile(i,j).isTileOccupied()) {
                    let piece = this.getTile(i,j).getPiece();
                    if(piece.getColor() === color && piece.getType() === "pawn") piece.justMoved2 = false;
                }
            }
        }
    }

    castle(king,direction){
        if(direction === "left") {
            this.movePiece(0,king.getY(),king.getX()+1,king.getY());
        }
        else if(direction === "right"){
            this.movePiece(7,king.getY(),king.getX()-1,king.getY());
        }
    }
    
    /**
     * Promotes pawn to desired piece
     * @param {Tile} tile - the tile the pawn is on
     * @param {Piece} newPiece - the piece the pawn will be promoted to
     */
    promote(tile,piece){
        tile.plPiece(piece);
    }

    enPassant(x1,y1,x2,y2){
        if(Math.abs(x1-x2) === 1 && this.getTile(x2,y1).isTileOccupied()) {
            console.log("got here");
            if(this.getTile(x2,y1).getPiece().getType() === "pawn") {
                if(this.getTile(x2,y1).getPiece().justMoved2 === true) this.getTile(x2,y1).rmPiece();
            }
        }
    }

    /**
    * Filters the list of possible moves, removing any move that will put the king in check
    * @param {Array} possibleTiles - The list of possible moves that will be filtered
    * @param {Array} origin - The coordinates of the piece on the board corresponding to those possible moves
    * @return {Array} - The filtered list of possible moves
    */
    canMoveFilter(possibleTiles,origin){
        let piece = this.getTile(origin[0],origin[1]).getPiece();
        //If the first move does not put the king in check all other possible moves are allowed
        if(this.checkRmMoves(possibleTiles,origin,piece)) return possibleTiles;
        return this.moveAndCheck(possibleTiles,origin,piece);
    }

    /**
     * Checks if the king will be checked if piece is removed from board
     * @param {Array} possibleTiles - the list of possible moves of a certain piece
     * @param {Array} origin - The coordinates of the piece corresponding to the possible moves
     * @param {piece} piece - The piece corresponding to the possible moves
     * @return {Boolean} - True if the king will not be checked; False if king will be checked
     */
    checkRmMoves(possibleTiles,origin,piece) {
        this.getTile(origin[0],origin[1]).rmPiece();
        if(piece.getColor() === "white") {
            this.whiteKing.giveCheckedTiles(this.checkedTiles("white"));
            if(!this.whiteKing.isChecked()) {
                this.getTile(origin[0],origin[1]).plPiece(piece);
                this.whiteKing.giveCheckedTiles(this.checkedTiles("white"));
                return true;
            }
        }
        else{
            this.blackKing.giveCheckedTiles(this.checkedTiles("black"));
            if(!this.blackKing.isChecked()) {
                this.getTile(origin[0],origin[1]).plPiece(piece);
                this.whiteKing.giveCheckedTiles(this.checkedTiles("black"));
                return true;
            }
        }
        return false;
    }

    /**
     * Removes all moves that put king in check
     * @param {Array} possibleTiles - The list of possible moves
     * @param {Array} origin - The coordinates of the piece on the board corresponding to the possible moves
     * @param {piece} piece - The piece corresponding to the possible moves
     * @return {Array} - The modified list
     */
    moveAndCheck(possibleTiles,origin,piece){
        //Special case need to keep pawns, kings, or rookes initial state
        let pieces = ["pawn","king","rooke"];
        let firstMove;
        for(let i = 0; i < 3; i++) {
            if(piece.getType() === pieces[i]){
                firstMove = piece.isFirstMove();
                break;
            }
        }
        this.getTile(origin[0],origin[1]).plPiece(piece);
        for(let j = possibleTiles.length-1; j >= 0; j--) {
            //If another piece exists on the possible move, store info about that piece and place it back after the check
            if(this.getTile(possibleTiles[j][0],possibleTiles[j][1]).isTileOccupied()) {
                if(this.getTile(possibleTiles[j][0],possibleTiles[j][1]).getPiece().getColor() !== piece.getColor()){
                    let piece2 = this.getTile(possibleTiles[j][0],possibleTiles[j][1]).getPiece();
                    let tempPos = [possibleTiles[j][0],possibleTiles[j][1]];
                    possibleTiles = this.canMoveChecks(possibleTiles,origin,piece,j);
                    this.getTile(tempPos[0],tempPos[1]).plPiece(piece2);
                }
            }
            else {
                possibleTiles = this.canMoveChecks(possibleTiles,origin,piece,j);
            }
        }
        //reverts pawn,king,rooke back to initial state
        for(let k = 0; k < 3; k++) {
            if(piece.getType() === pieces[k]){
                piece.setFirstMove(firstMove);
                break;
            }
        }
        return possibleTiles;
    }

    /**
     * Checks the the list of possible move at the given index to see if it will put king in check and removes it if it does
     * @param {Array} possibleTiles - The list of possible moves
     * @param {Array} origin - The coordinates of the piece corresponding to the possible moves
     * @param {piece} piece - The piece corresponding to the possible moves
     * @param {Number} index - The index of the list being checked
     * @return {Array}- The modified list of possible moves
     */
    canMoveChecks(possibleTiles,origin,piece,index) {
        this.movePiece(origin[0],origin[1],possibleTiles[index][0],possibleTiles[index][1]);
        if(piece.getColor() === "white"){
            this.whiteKing.giveCheckedTiles(this.checkedTiles("white"));
            if(this.whiteKing.isChecked()) {
                this.movePiece(possibleTiles[index][0],possibleTiles[index][1],origin[0],origin[1]);
                possibleTiles.splice(index,1);
            }
            else{
                this.movePiece(possibleTiles[index][0],possibleTiles[index][1],origin[0],origin[1]);
            }
        }
        else{
            this.blackKing.giveCheckedTiles(this.checkedTiles("black"));
            if(this.blackKing.isChecked()) {
                this.movePiece(possibleTiles[index][0],possibleTiles[index][1],origin[0],origin[1]);
                possibleTiles.splice(index,1);
            }
            else{
                this.movePiece(possibleTiles[index][0],possibleTiles[index][1],origin[0],origin[1]);
            }
        }
        return possibleTiles;
    }

    /**
     * Combines all the possible moves of each piece
     * @param {string} color - the color opposite to the pieces you want to find the possible moves of
     * @return {Array} - Combination of the possible moves of each piece
     */
    checkedTiles(color){
        let possibleMoves = [];
        for(let i = 0; i < this.boardLength; i++){
            for(let e = 0; e < this.boardWidth; e++){
                if(this.getTile(i,e).getPiece() !== null){
                    if(this.getTile(i,e).getPiece().getColor() !== color){
                        possibleMoves = possibleMoves.concat(board.getTile(i,e).getPiece().getMoveInfo("checkedTiles"));
                    }
                }
            }
        }
        return possibleMoves;
    }

    /**
     * Checks if the king is in check and if any pieces can move if so the king is in checkmate
     * @param {King} king 
     * @return {Boolean} - true if king is checkmated; false if king is not checkmated
     */
    checkMate(king){
        let possibleMoves = [];
        for(let i = 0; i < this.boardLength; i++){
            for(let e = 0; e < this.boardWidth; e++){
                if(this.getTile(i,e).isTileOccupied()){
                    if(this.getTile(i,e).getPiece().getColor() === king.getColor()){
                        possibleMoves = possibleMoves.concat(this.canMoveFilter(board.getTile(i,e).getPiece().getMoveInfo(),[i,e]));
                    }
                }
            }
        }
        return (possibleMoves.length < 1 && king.isChecked())
    }

    clone(){
        newChessBoard = new ChessBoard(this.boardLength,this.boardWidth,this.tileSize);
        newChessBoard.getTile()
    }
}

module.exports = ChessBoard;
