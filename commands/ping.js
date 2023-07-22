const db = require('../database.js');

module.exports = {
    name: "ping",
    description: "replies with pong!",
    async execute(message,args,client,Discord,prefix){
        try{
            //const results = await db.promise().query(`SELECT * FROM chess WHERE guildid='${message.guildId}'`);
            //console.log(results[0]);
        }
        catch(err){
            console.log(err);
        }
        message.reply("pong");
    }
}