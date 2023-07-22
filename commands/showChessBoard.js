const db = require('../database.js');
const ChessBoard = require('../chess/board/ChessBoard.js');
const { drawBoard } = require('../chess/chessHandler/drawBoard.js');

module.exports = {
    name: "showChessBoard",
    description: "Draws the current chessboard",
    async execute(args,message,client,Discord,prefix){
        let results = await db.promise().query(`SELECT chesssession,white,black FROM botinfo WHERE guildid='${args.guildId}'`);
        if(results[0][0].chesssession !== "1"){
            args.reply(`There is no chess session right now. Use ${prefix}playChess to create a game`);
            return;
        }
        if(results[0][0].white !== args.author.id && results[0][0].black !== args.author.id){
            args.reply(`You are not in a chess game right now. Use ${prefix}joinChess to join the game`)
        }
        const chessBoard = new ChessBoard(8,8,25);
        await chessBoard.dbBoard(args.guildId);
        try{
            drawBoard(chessBoard).then(() => {
                const file = new Discord.AttachmentBuilder('./assets/ChessBoard.png');
                const chessEmbed = new Discord.EmbedBuilder()
                    .setImage('attachment://ChessBoard.png');
                args.channel.send({ embeds: [chessEmbed], files: [file] });
            }).catch(err => {
                console.log(err);
            });
        }
        catch(err){
            console.log(err);
        }
    }
}