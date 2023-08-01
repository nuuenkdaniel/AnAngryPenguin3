const { createCanvas,loadImage } = require('canvas');
const fs = require('fs');
const { AttachmentBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
    canMove(board,x1,y1,x2,y2){
        function castlePressed(king,x1) {
            if(king.getX()+2 === x1) return "left";
            if(king.getX()-2 === x1) return "right";
        }
        if(board.getTile(x1,y1).getPiece().getType() === "king"){
            board.getTile(x1,y1).setTileOccupied(false);
            board.getTile(x1,y1).getPiece().giveCheckedTiles(board.checkedTiles(board.turn));
            board.getTile(x1,y1).setTileOccupied(true);
        }
        const possibleTiles = board.canMoveFilter(board.getTile(Number(x1),Number(y1)).getPiece().getMoveInfo(),[Number(x1),Number(y1)]);
        for(const tiles of possibleTiles){
            if((tiles[0] === Number(x2)) && (tiles[1] === Number(y2))){
                board.resetPawn(board.turn);
                board.movePiece(x1,y1,x2,y2);
                board.move++;
                board.updateCheckedTiles();
                const king = (board.turn === "white")? board.whiteKing : board.blackKing;
                if(board.getTile(x2,y2).getPiece().getType() === "king" && castlePressed(king,x1) === "left") board.castle(king,"left");
                else if(board.getTile(x2,y2).getPiece().getType() === "king" && castlePressed(king,x1) === "right") board.castle(king,"right");
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
        const gridXOffSet = 40;
        const gridYOffSet = 40;
        const canvas = createCanvas(tileSize*boardLength+gridXOffSet,tileSize*boardWidth+gridYOffSet);
        const ctx = canvas.getContext("2d");
        const chessPieces = await loadImage('./assets/ChessPieces.png');
        
        function drawChessBoard(){
            for(let i = 0; i < boardLength; i++){
                for(let j = 0; j < boardWidth; j++){
                    const tileX = i*tileSize+gridXOffSet;
                    const tileY = j*tileSize;
                    board.getTile(i,j).giveX(tileX);
                    board.getTile(i,j).giveY(tileY);
                    ctx.fillStyle = board.getTile(i,j).getColor();
                    ctx.fillRect(tileX,tileY,tileSize,tileSize);
                    drawPieces(board.getTile(i,j))
                }
            }
            drawLetterCoords();
            drawNumCoords();
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

        function drawLetterCoords(){
            const letterCords = ['a','b','c','d','e','f','g','h'];
            const yPixel = board.getTile(0,boardWidth-1).getY()+tileSize+30;
            for(let i = 0; i < boardLength; i++) {
                const xPixel = board.getTile(i,0).getX()+tileSize/2-6;
                ctx.font = "30px Arial"
                ctx.fillText(letterCords[i],xPixel,yPixel);
            }
        }

        function drawNumCoords(){
            const xPixel = board.getTile(0,0).getX()-30;
            for(let i = boardWidth-1; i >= 0; i--) {
                const yPixel = board.getTile(0,i).getY()+tileSize/2+6;
                ctx.font = "30px Arial";
                ctx.fillText(boardWidth-i,xPixel,yPixel);
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