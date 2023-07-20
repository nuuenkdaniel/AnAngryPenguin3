const db = require('../database.js');
const ChessBoard = require('../chess/board/ChessBoard.js');
const { drawBoard } = require('../chess/chessHandler/drawBoard.js');

module.exports = {
    name: "playChess",
    description: "creates a chessBoard",
    async execute(args,message,client,Discord){
        let chessBoard;
        try{
            chessBoard = new ChessBoard(8,8,25);
            chessBoard.createBoard();
            chessBoard.defaultBoardSetUp();
            args.channel.send("ChessBoard Created");
        }
        catch(err){
            console.log(err);
            args.channel.send("Error making ChessBoard");
            return;
        }
        try{
            await db.promise().query(`DELETE FROM chess WHERE guildid='${args.guildId}'`);
            for(let i = 0; i < chessBoard.boardLength; i++){
                for(let j = 0; j < chessBoard.boardWidth; j++){
                    const piece = chessBoard.getTile(i,j).getPiece();
                    if(piece !== null){
                        const firstMove = (piece.getType() === "pawn" || piece.getType() === "rooke" || piece.getType() === "king")? piece.isFirstMove().toString() : null;
                        const justMoved2 = (piece.getType() === "pawn")? piece.justMoved2.toString() : null;
                        await db.promise().query(`INSERT INTO chess VALUES(
                            '${args.guildId}',
                            '${piece.getType()}',
                            ${firstMove},
                            '${piece.getColor()}',
                            '${piece.getX()}',
                            '${piece.getY()}',
                            ${justMoved2}
                        )
                        `);
                        await db.promise().query(`UPDATE botinfo SET chessSession=1 WHERE guildid='${args.guildId}'`);
                    }
                }
            }
        }
        catch(err){
            console.log(err);
        }
        try{
            drawBoard(chessBoard);
        }
        catch(err){
            console.log(err);
        }
    }
}