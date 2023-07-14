const fs = require('fs');

module.exports = {
    name: "helpPenguin",
    description: "creates an embed explaining all the commands",
    execute(args,message,client,Discord){
        let prefix = fs.readFileSync('./prefix.txt', 'utf8');
        const helpEmbed = new Discord.EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('The Penguin Help Bar')
            .addFields( { name: "Prefix", value: prefix } );
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for(const file of commandFiles){
            const command = require(`../commands/${file}`);
            helpEmbed.addFields( {name: prefix+''+command.name, value: command.description })
        }
        
        args.channel.send({ embeds: [helpEmbed] });
    }
}