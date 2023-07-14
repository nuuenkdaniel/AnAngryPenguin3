const fs = require('fs');

module.exports = {
    once: true,
    execute(client,Discord,args){
        let prefix = fs.readFileSync('./prefix.txt','utf-8');
        client.user.setActivity(prefix + 'helpPenguin for help', {type: 'WATCHING'})
        console.log("The AngryPenguin is ready!");
    }
}