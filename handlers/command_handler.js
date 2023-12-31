const fs = require('fs');

module.exports = (client) => {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    
    for(const file of commandFiles){
        const command = require(`../commands/${file}`)
        if('name' in command && 'execute' in command){
            client.commands.set(command.name.toLowerCase(),command);
        }
        else{
            console.log(`Error with the file: ${file}`);
        }
    }
}
    
