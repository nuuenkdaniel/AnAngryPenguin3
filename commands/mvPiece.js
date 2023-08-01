const db = require('../database.js');
const ChessBoard = require('../chess/board/ChessBoard.js');
const { drawBoard,canMove } = require('../chess/playChess.js');

module.exports = {
    name: "mvPiece",
    description: "moves selected piece to desired location Ex. ([prefix]movePiece e2 e4)",
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
        if(args.length > 2) {
            message.reply("Invalid input try again");
            return;
        }
        const moves = args.join('').split('');
        for(let i = 0, j = 0; i < 8 && j < 4; i++) {
            const letters = ["a","b","c","d","e","f","g","h"];
            if(moves[j] === letters[i]) {
                moves[j] = i;
                i = -1;
                j++;
            }
            else if(i === 7) {
                i = -1;
                j++;
            } 
        }
        for(let i = 0; i < moves.length; i++) moves[i] = Number(moves[i]);
        moves[1] = 8-moves[1];
        moves[3] = 8-moves[3];
        const chessBoard = new ChessBoard(8,8,25);
        await chessBoard.dbBoard(message.guildId);
        const piece = chessBoard.getTile(moves[0],moves[1]).getPiece();
        if(piece === null){
            message.reply(`There is no piece at ${args[0]}`);
            return;
        }
        if(piece.getColor() !== chessBoard.turn) {
            message.reply("You can only move your pieces");
            return;
        }
        if(canMove(chessBoard,moves[0],moves[1],moves[2],moves[3])) {
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
        else message.reply(`Cannot move ${piece.getType()} to ${args[1]}`);
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