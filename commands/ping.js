const db = require('../database.js');

module.exports = {
    name: "ping",
    description: "replies with pong!",
    async execute(args,message,client,Discord,prefix){
        try{
            //const results = await db.promise().query(`SELECT * FROM chess WHERE guildid='${args.guildId}'`);
            //console.log(results[0]);
        }
        catch(err){
            console.log(err);
        }
        args.reply("pong");
    }
}