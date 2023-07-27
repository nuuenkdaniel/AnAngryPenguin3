const db = require('../database.js');
const ChessBoard = require('../chess/board/ChessBoard.js');
const { drawBoard,canMove } = require('../chess/playChess.js');

module.exports = {
    name: "mvPiece",
    description: "moves selected piece to desired location Ex. (movePiece x1 y1 x2 y2)[work in progress]",
    async execute(message,args,prefix){
        let results = await db.promise().query(`SELECT chesssession,white,black,turn FROM botinfo WHERE guildid='${message.guildId}'`);
        if(results[0][0].chesssession !== "1"){
            message.reply(`There is no chess session right now. Use ${prefix}playChess to create a game`);
            return;
        }
        if(results[0][0].white !== message.author.id && results[0][0].black !== message.author.id){
            message.reply(`You are not in a chess game right now. Use ${prefix}joinChess to join the game`);
            return;
        }
        if((message.author.id === results[0][0].white && results[0][0].turn !== "white") || (message.author.id === results[0][0].black && results[0][0].turn !== "black")) {
            message.reply("It is not your turn");
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
            chessBoard.turn = chessBoard.turn === "white"? "black" : "white";
            await chessBoard.logBoard(message.guildId);
            chessBoard.updateCheckedTiles();
            const king = chessBoard.turn === "white"? chessBoard.whiteKing : chessBoard.blackKing;
            if(king.isChecked()){
                if(chessBoard.checkMate()) {
                    if(chessBoard.turn === "white") message.channel.send("Checkmate! Black wins!");
                    else message.channel.send("Checkmate! White wins!");
                    await db.promise().query(`DELETE FROM chess WHERE guildid='${message.guildId}'`); 
                    await db.promise().query(`UPDATE botinfo SET chessSession='0',white=NULL,black=NULL,turn=NULL WHERE guildid='${message.guildId}'`);
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