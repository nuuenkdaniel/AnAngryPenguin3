const { createCanvas,loadImage } = require('canvas');
const fs = require('fs');
const { AttachmentBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
    canMove(board,x1,y1,x2,y2){
        function castlePressed(king,tile){
            if(king.getX()+2 === x1 && board.getTile(tile[0],tile[1]).getPiece().getType() === "king") return "left";
            if(king.getX()-2 === x1 && board.getTile(tile[0],tile[1]).getPiece().getType() === "king") {
                console.log("Castled right");
                return "right";
            }
        }
        if(board.getTile(x1,y1).getPiece().getType() === "king"){
            board.getTile(x1,y1).setTileOccupied(false);
            board.getTile(x1,y1).getPiece().giveCheckedTiles(board.checkedTiles(board.turn));
            board.getTile(x1,y1).setTileOccupied(true);
        }
        const possibleTiles = board.canMoveFilter(board.getTile(Number(x1),Number(y1)).getPiece().getMoveInfo(),[Number(x1),Number(y1)]);
        for(const tiles of possibleTiles){
            if((tiles[0] === Number(x2)) && (tiles[1] === Number(y2))){
                board.movePiece(x1,y1,x2,y2);
                board.move++;
                board.updateCheckedTiles();
                const king = (board.turn === "white")? board.whiteKing : board.blackKing;
                board.resetPawn(board.turn);
                if(board.getTile(x2,y2).getPiece().getType() === "king" && castlePressed(king,[x2,y2]) === "left") board.castle(king,"left");
                else if(board.getTile(x2,y2).getPiece().getType() === "king" && castlePressed(king,[x2,y2]) === "right") board.castle(king,"right");
                board.turn = board.turn === "white"? "black" : "white";
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