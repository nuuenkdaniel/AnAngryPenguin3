class Piece{
    constructor(color, tileX, tileY, board){
        if(constructor == Piece){
            throw new error("Abstract classes can't be instantiated.");
        }
        this.color = color;
        this.tileX = tileX;
        this.tileY = tileY;
        this.board = board;
        this.moveInfo = [];
        this.pieceType = null;
    }
    
    getColor(){
        return this.color;
    }
    giveColor(color){
        this.color = color;
    }
    getMoveInfo(mode){
        throw new error("Method 'getMoveInfo()' must be implemented");
    }
    getType(){
        throw new error("Method 'getType()' must be implemented");
    }
    giveX(xCoord){
        this.tileX = xCoord;
    }
    giveY(yCoord){
        this.tileY = yCoord;
    }
    getX(){
        return this.tileX;
    }
    getY(){
        return this.tileY;
    }
}

module.exports = Piece;
