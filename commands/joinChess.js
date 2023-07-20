const db = require('../database.js');

module.exports = {
    name: "joinChess",
    description: "Joins the chess game Ex. ([prefix]joinChess white) to join white",
    async execute(args,message,client,Discord,prefix){
        let results = await db.promise().query(`SELECT chessSession FROM botinfo WHERE guildid='${args.guildId}'`);
        if(results[0][0].chessSession !== '1') {
            args.reply(`No chess game in session. Use ${prefix}playChess to start a game`);
            return;
        }
        if(message[0] === "white" || message[0] === "black"){
            await db.promise().query(`UPDATE botinfo SET ${message[0]}='${args.author.id}' WHERE guildid = ${args.guildId}`);
            args.reply(`Joined ${message[0]}`);
        }
        else{
            args.reply("Join a side (white or black)");
        }
    }
}