const db = require('../database.js');
const ChessBoard = require('../chess/board/ChessBoard.js');
const { drawBoard,canMove } = require('../chess/playChess.js');

module.exports = {
    name: "movePiece",
    description: "moves selected piece to desired location Ex. (movePiece x1 y1 x2 y2)[work in progress]",
    async execute(message,args,prefix){
        let results = await db.promise().query(`SELECT chesssession,white,black FROM botinfo WHERE guildid='${message.guildId}'`);
        if(results[0][0].chesssession !== "1"){
            message.reply(`There is no chess session right now. Use ${prefix}playChess to create a game`);
            return;
        }
        if(results[0][0].white !== message.author.id && results[0][0].black !== message.author.id){
            message.reply(`You are not in a chess game right now. Use ${prefix}joinChess to join the game`);
            return;
        }
        const chessBoard = new ChessBoard(8,8,25);
        await chessBoard.dbBoard(message.guildId);
        const piece = chessBoard.getTile(args[0],args[1]).getPiece();
        if(piece === null){
            message.reply(`There is no piece at ${args[0]},${args[1]}`);
            return;
        }
        if(canMove(chessBoard,piece,args[2],args[3])) {
            chessBoard.movePiece(Number(args[0]),Number(args[1]),Number(args[2]),Number(args[3]));
            chessBoard.logBoard(message.guildId);
        }
        else message.reply(`Cannot move ${piece.getType()} to ${args[2]},${args[3]}`);
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