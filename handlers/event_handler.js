const fs = require('fs');

module.exports = (client,Discord) => {
    const load_dir = (dirs) => {
        const eventFiles = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith('.js'));

        for(const file of eventFiles){
            const event = require(`../events/${dirs}/${file}`);
            const eventName = file.split('.')[0];
            if(event.once) {
                client.once(eventName,(args) => event.execute(client,Discord,args))
            }
            else {
                client.on(eventName, (args) => event.execute(client,Discord,args));
            }
        }
    }
    ['client','guild'].forEach(each => load_dir(each));
}