const db = require('../database.js');
const ChessBoard = require('../chess/board/ChessBoard.js');

module.exports = {
    name: "playChess",
    description: "creates a chessBoard [work in progress]",
    execute(args,message,client,Discord){
        try{
            chessBoard = new ChessBoard(8,8,25).createBoard();
            args.channel.send("ChessBoard Created");
        }
        catch(err){
            console.log(err);
            args.channel.send("Error making ChessBoard");
        }
    }
}