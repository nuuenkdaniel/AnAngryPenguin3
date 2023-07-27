const db = require('../database.js');

module.exports = {
    name: "changePrefix",
    description: "changes the prefix to the given prefix",
    execute(message,args){
        const newPrefix = args.join(' ');
        try{
            db.query(`UPDATE botinfo SET prefix='${newPrefix}' WHERE guildid='${message.guildId}'`);
        }
        catch(err){
            console.log(err);
        }
        console.log("The new prefix is: "+newPrefix);
        message.channel.send("The prefix is now: "+newPrefix);
    }
}