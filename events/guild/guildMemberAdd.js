const { EmbedBuilder } = require('discord.js');

module.exports = {
    once: false,
    async execute(client,member){
        const welcomeEmbed = new EmbedBuilder()
            .setColor([255, 0, 255])
            .setTitle(`Welcome!`)
            .addFields( { name: ' ', value: `Welcome to the server ${member.user.username}!` } )
            .setImage(member.displayAvatarURL({dynamic: true, size: 256}));
            member.guild.channels.cache.find(channel => channel.name === 'welcome').send({embeds: [welcomeEmbed]});
    }
}