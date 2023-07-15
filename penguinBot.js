const Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const db = require('./database');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,GatewayIntentBits.GuildMembers],
    partials: [Partials.Message,Partials.Channel,Partials.Reaction],
});
client.commands = new Discord.Collection();

let handlers = ['command_handler','event_handler'];
for(const handler of handlers){
    require(`./handlers/${handler}`)(client, Discord);
}



const { token } = require('./config.json');
client.login(token);