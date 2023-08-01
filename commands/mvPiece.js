const db = require('../database.js');
const ChessBoard = require('../chess/board/ChessBoard.js');
const { drawBoard,canMove } = require('../chess/playChess.js');

module.exports = {
    name: "mvPiece",
    description: "moves selected piece to desired location Ex. (movePiece x1y1 x2y2)[work in progress]",
    async execute(message,args,prefix){
        let results = await db.promise().query(`SELECT chesssession,white,black,currentmove FROM botinfo WHERE guildid='${message.guildId}'`);
        if(results[0][0].chesssession !== 1){
            message.reply(`There is no chess session right now. Use ${prefix}playChess to create a game`);
            return;
        }
        if(results[0][0].white !== message.author.id && results[0][0].black !== message.author.id){
            message.reply(`You are not in a chess game right now. Use ${prefix}join to join the game`);
            return;
        }
        if((message.author.id !== results[0][0].white && results[0][0].currentmove%2 > 0) || (message.author.id !== results[0][0].black && results[0][0].currentmove%2 === 0)) {
            message.reply("It is not your turn");
            return;
        }
        if(args > 2) {
            message.reply("Invalid input try again");
            return;
        }
        args = args.join('');
        args = args.split('');
        console.log(args);
        const chessBoard = new ChessBoard(8,8,25);
        await chessBoard.dbBoard(message.guildId);
        const piece = chessBoard.getTile(args[0],args[1]).getPiece();
        if(piece === null){
            message.reply(`There is no piece at ${args[0]},${args[1]}`);
            return;
        }
        if(piece.getColor() !== chessBoard.turn) {
            message.reply("You can only move your pieces");
            return;
        }
        if(canMove(chessBoard,Number(args[0]),Number(args[1]),Number(args[2]),Number(args[3]))) {
            await chessBoard.logBoard(message.guildId);
            const king = chessBoard.turn === "white"? chessBoard.whiteKing : chessBoard.blackKing;
            if(king.isChecked()){
                if(chessBoard.checkMate()) {
                    if(chessBoard.turn === "white") message.channel.send("Checkmate! Black wins!");
                    else message.channel.send("Checkmate! White wins!");
                    await db.promise().query(`DELETE FROM chess WHERE guildid='${message.guildId}'`); 
                    await db.promise().query(`UPDATE botinfo SET chessSession=false,white=NULL,black=NULL,turn=NULL WHERE guildid='${message.guildId}'`);
                }   
                else message.channel.send(`${chessBoard.turn} is checked`);
            }
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