const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,GatewayIntentBits.GuildMembers],
    partials: [Partials.Message,Partials.Channel,Partials.Reaction],
});

client.commands = new Collection();

let handlers = ['command_handler','event_handler'];
for(const handler of handlers){
    require(`./handlers/${handler}`)(client);
}

const { token } = require('./config.json');
client.login(token);