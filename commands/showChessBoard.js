const db = require('../database.js');
const ChessBoard = require('../chess/board/ChessBoard.js');
const { drawBoard } = require('../chess/chessHandler/drawBoard.js');

module.exports = {
    name: "showChessBoard",
    description: "Draws the current chessboard",
    async execute(message,args,prefix){
        const results = await db.promise().query(`SELECT chesssession FROM botinfo WHERE guildid='${message.guildId}'`);
        if(results[0][0].chesssession !== "1"){
            message.reply(`There is no chess session right now. Use ${prefix}playChess to create a game`);
            return;
        }
        const chessBoard = new ChessBoard(8,8,25);
        await chessBoard.dbBoard(message.guildId);
        try{
            const chessEmbed = await drawBoard(chessBoard);
            message.channel.send( {embeds: [chessEmbed[0]], files: [chessEmbed[1]]} );
        }
        catch(err){
            console.log(err);
        }
    }
}