const fs = require('fs');
const db = require('../database.js');

module.exports = {
    name: "changePrefix",
    description: "changes the prefix to the given prefix",
    execute(args,message){
        const newPrefix = message.join(' ');
        const guildId = args.guildId;
        try{
            db.query(`UPDATE botinfo SET prefix='${newPrefix}' WHERE guildid='${guildId}'`);
        }
        catch(err){
            console.log(err);
        }
        console.log("The new prefix is: "+newPrefix);
        args.channel.send("The prefix is now: "+newPrefix);
    }
}