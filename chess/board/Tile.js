class Tile{
    constructor(tileX, tileY, color, tileSize, piece = null){
        this.tileY = tileY;
        this.tileX = tileX;
        this.tileOccupied = (piece === null) ? false : true;
        this.color = color;
        this.tileSize = tileSize;
        this.piece = piece;
        this.x = 0;
        this.y = 0;
    }
    
    getTileX(){
        return this.tileX;
    }
    getTileY(){
        return this.tileY;
    }
    isTileOccupied(){
        return this.tileOccupied;
    }
    setTileOccupied(bool){
        this.tileOccupied = bool;
    }
    getColor(){
        return this.color;
    }
    giveColor(color){
        this.color = color
    }
    getPiece(){
        return this.piece;
    }
    plPiece(piece){
        let oldPiece = this.piece;
        this.piece = piece;
        this.tileOccupied = true;
        return oldPiece;
    }
    rmPiece(){
        let oldPiece = this.piece;
        this.piece = null;
        this.tileOccupied = false;
        return oldPiece;
    }

    giveX(x){
        this.x = x;
    }

    //the x pixel of the top left of the tile
    getX(){
        return this.x;
    }

    giveY(y){
        this.y = y;
    }

    //the y pixel of the top left of the tile
    getY(){
        return this.y;
    }
    
    isClicked(){
        return ((mouseX < this.x+this.tileSize) && (mouseX > this.x) && (mouseY < this.y+this.tileSize) && (mouseY > this.y));
    }
}

module.exports = Tile;
