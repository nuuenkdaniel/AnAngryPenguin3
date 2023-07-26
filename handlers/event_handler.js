const fs = require('fs');

module.exports = (client) => {
    const load_dir = (dirs) => {
        const eventFiles = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith('.js'));

        for(const file of eventFiles){
            const event = require(`../events/${dirs}/${file}`);
            const eventName = file.split('.')[0];
            if(event.once) {
                client.once(eventName,(obj) => event.execute(client,obj))
            }
            else {
                client.on(eventName, (obj) => event.execute(client,obj));
            }
        }
    }
    ['client','guild'].forEach(each => load_dir(each));
}