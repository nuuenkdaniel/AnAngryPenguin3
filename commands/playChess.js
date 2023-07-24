const db = require('../database.js');
const ChessBoard = require('../chess/board/ChessBoard.js');
const { drawBoard } = require('../chess/playChess.js');

module.exports = {
    name: "playChess",
    description: "creates a chessBoard",
    async execute(message){
        let chessBoard;
        try{
            chessBoard = new ChessBoard(8,8,25);
            chessBoard.createBoard();
            chessBoard.defaultBoardSetUp();
            message.channel.send("ChessBoard Created");
            await chessBoard.logBoard(message.guildId);
        }
        catch(err){
            console.log(err);
            message.channel.send("Error making ChessBoard");
            return;
        }
        try{
            const chessEmbed = await drawBoard(chessBoard);
            message.channel.send( {embeds: [chessEmbed[0]], files: [chessEmbed[1]]} );
        }
        catch(err){
            console.log(err);
            message.channel.send("Error displaying ChessBoard");
        }        
    }
}