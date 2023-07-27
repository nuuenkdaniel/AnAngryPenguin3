const db = require('../../database.js');

module.exports = {
    once: false,
    async execute(client,message) {
        const results = await db.promise().query(`SELECT prefix FROM botinfo WHERE guildid='${message.guildId}'`);
        const prefix = results[0][0].prefix;
        if(!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const cmd = args.shift().toLowerCase();
        const command = message.client.commands.get(cmd);

        if(command) command.execute(message,args,prefix,client);
    }
}