const Discord = require('discord.js');
const { CLient, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const db = require('mysql2');

const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,GatewayIntentBits.GuildMembers] });
client.commands = new Discord.Collection();

let handlers = ['command_handler','event_handler'];
for(const handler of handlers){
    require(`./handlers/${handler}`)(client, Discord);
}

const { token } = require('./config.json');
client.login(token);