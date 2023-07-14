module.exports = {
    name: "helpPenguin",
    description: "creates an embed explaining all the commands",
    async execute(args,message,client,Discord){
        const helpEmbed = new Discord.EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('help')
            .addFields(
                { name: 'helpPenguin.js', value: 'creates an embed explaining all the commands'},
            );
        args.channel.send({ embed: [helpEmbed] });
    }
}