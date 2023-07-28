const db = require('../database.js');
const ChessBoard = require('../chess/board/ChessBoard.js');
const { drawBoard } = require('../chess/playChess.js');

module.exports = {
    name: "undo",
    description: "undoes the last chess move[work in progress]",
    async execute(message,args,prefix){
        try{
            let results = await db.promise().query(`SELECT chessSession,currentMove FROM botinfo WHERE guildid='${message.guildId}'`);
            if(results[0][0].chessSession !== 1) {
                message.reply(`There is no chess session right now. Use ${prefix}playChess to create a game`);
                return;
            }
            if(results[0][0].currentMove <= 1) {
                message.reply("You have not made a move to undo");
                return;
            }
            await db.promise().query(`DELETE FROM chess WHERE guildid='${message.guildId}' AND move=${results[0][0].currentMove}`);
            await db.promise().query(`UPDATE botinfo SET currentMove=${results[0][0].currentMove-1} WHERE guildid=${message.guildId}`);
        }
        catch(err){
            console.log(err);
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