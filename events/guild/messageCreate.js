const fs = require('fs');

module.exports = {
    once: false,
    execute(client,Discord,args) {
        try{
            var prefix = fs.readFileSync('./prefix.txt', 'utf8');
        }
        catch(err){
            console.log(err);
        }
        if(!args.content.startsWith(prefix) || args.author.bot) return;

        const message = args.content.slice(prefix.length).split(/ +/);
        const cmd = message.shift().toLowerCase();
        const command = args.client.commands.get(cmd);

        if(command) command.execute(args,message,client,Discord);
    }
}