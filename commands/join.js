const db = require('../database.js');

module.exports = {
    name: "join",
    description: "Joins the chess game Ex. ([prefix]join white) to join white",
    async execute(message,args,prefix){
        let results = await db.promise().query(`SELECT chessSession FROM botinfo WHERE guildid='${message.guildId}'`);
        if(results[0][0].chessSession !== 1) {
            message.reply(`No chess game in session. Use ${prefix}playChess to start a game`);
            return;
        }
        if(args[0] === "white" || args[0] === "black"){
            await db.promise().query(`UPDATE botinfo SET ${args[0]}='${message.author.id}' WHERE guildid = ${message.guildId}`);
            message.reply(`Joined ${args[0]}`);
        }
        else{
            message.reply("Join a side (white or black)");
        }
    }
}