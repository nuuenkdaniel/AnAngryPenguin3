const fs = require('fs');
const db = require('../../database.js');

module.exports = {
    once: false,
    async execute(client,Discord,args) {
        const guildId = args.guildId;
        const results = await db.promise().query(`SELECT prefix FROM botinfo WHERE guildid='${guildId}'`);
        const prefix = results[0][0].prefix;
        if(!args.content.startsWith(prefix) || args.author.bot) return;

        const message = args.content.slice(prefix.length).split(/ +/);
        const cmd = message.shift().toLowerCase();
        const command = args.client.commands.get(cmd);

        if(command) command.execute(args,message,client,Discord,prefix);
    }
}