const { createCanvas,loadImage } = require('canvas');
const fs = require('fs');
const { AttachmentBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
    canMove(board,piece,x2,y2){
        if(piece.getType() === "king"){
            board.getTile(piece.tileX,piece.tileY).setTileOccupied(false);
            board.getTile(piece.tileX,piece.tileY).getPiece().giveCheckedTiles(board.checkedTiles(board.turn));
            board.getTile(piece.tileX,piece.tileY).setTileOccupied(true);
        }
        const possibleTiles = board.canMoveFilter(board.getTile(Number(piece.tileX),Number(piece.tileY)).getPiece().getMoveInfo(),[Number(piece.tileX),Number(piece.tileY)]);
        for(const tiles of possibleTiles){
            if((tiles[0] === Number(x2)) && (tiles[1] === Number(y2))){
                return true;
            }
        }
        return false;
    },
    async drawBoard(board){
        const tileSize = 100;
        const boardWidth = board.boardWidth;
        const boardLength = board.boardLength;
        const canvas = createCanvas(tileSize*boardWidth,tileSize*boardWidth);
        const ctx = canvas.getContext("2d");
        const chessPieces = await loadImage('./assets/ChessPieces.png');
        
        function drawChessBoard(){
            for(let i = 0; i < boardLength; i++){
                for(let j = 0; j < boardWidth; j++){
                    const tileX = i * tileSize;
                    const tileY = j * tileSize;
                    board.getTile(i,j).giveX(tileX);
                    board.getTile(i,j).giveY(tileY);
                    ctx.fillStyle = board.getTile(i,j).getColor();
                    ctx.fillRect(tileX,tileY,tileSize,tileSize);
                    drawPieces(board.getTile(i,j))
                }
            }
            const buffer = canvas.toBuffer("image/png");
            fs.writeFileSync("./assets/ChessBoard.png",buffer);
        }

        function drawPieces(tile){
            const piece = tile.getPiece();
            if(!piece) return;
            const colorYOffSet = piece.getColor() === "white"? 0 : 333;
            switch(piece.getType()){
                case "king":
                    ctx.drawImage(chessPieces, 0, colorYOffSet, 333, 333, tile.getX(), tile.getY(), tileSize, tileSize);
                    break;
                case "queen":
                    ctx.drawImage(chessPieces, 333, colorYOffSet, 333, 333, tile.getX(), tile.getY(), tileSize, tileSize);
                    break;
                case "bishop":
                    ctx.drawImage(chessPieces, 666, colorYOffSet, 333, 333, tile.getX(), tile.getY(), tileSize, tileSize);
                    break;
                case "knight":
                    ctx.drawImage(chessPieces, 999, colorYOffSet, 333, 333, tile.getX(), tile.getY(), tileSize, tileSize);
                    break;
                case "rooke":
                    ctx.drawImage(chessPieces, 1332, colorYOffSet, 333, 333, tile.getX(), tile.getY(), tileSize, tileSize);
                    break;
                case "pawn":
                    ctx.drawImage(chessPieces, 1665, colorYOffSet, 333, 333, tile.getX(), tile.getY(), tileSize, tileSize);
                    break;
            }
        }

        function createEmbed(){
            const file = new AttachmentBuilder('./assets/ChessBoard.png');
            const chessEmbed = new EmbedBuilder()
                .setImage('attachment://ChessBoard.png');
            return [chessEmbed,file];
        }

        drawChessBoard();
        return createEmbed();
    }
}