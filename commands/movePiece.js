const db = require('../database.js');
const ChessBoard = require('../chess/board/ChessBoard.js');

module.exports = {
    name: "movePiece",
    description: "moves selected piece to desired location Ex. (movePiece x1 y1 x2 y2)[work in progress]",
    async execute(args,message,client,Discord,prefix){
        let results = await db.promise().query(`SELECT chesssession,white,black FROM botinfo WHERE guildid='${args.guildId}'`);
        if(results[0][0].chesssession !== "1"){
            args.reply(`There is no chess session right now. Use ${prefix}playChess to create a game`);
            return;
        }
        if(results[0][0].white !== args.author.id && results[0][0].black !== args.author.id){
            args.reply(`You are not in a chess game right now. Use ${prefix}joinChess to join the game`)
        }
        const chessBoard = new ChessBoard(8,8,25,board);
        chessBoard.dbBoard(args.guildId);
    }
}