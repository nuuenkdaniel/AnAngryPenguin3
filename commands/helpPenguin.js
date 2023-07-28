const fs = require('fs');
const db = require('../database.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "helpPenguin",
    description: "creates an embed explaining all the commands",
    async execute(message) {
        const results = await db.promise().query(`SELECT prefix FROM botinfo WHERE guildid='${message.guildId}'`);
        let prefix = results[0][0].prefix;
        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('The Penguin Help Bar')
            .addFields( { name: "Prefix", value: prefix } )
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for(const file of commandFiles){
            const command = require(`../commands/${file}`);
            helpEmbed.addFields( {name: prefix+''+command.name, value: command.description })
        }
        message.channel.send({ embeds: [helpEmbed] });
    }
}