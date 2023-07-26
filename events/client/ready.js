const fs = require('fs');

module.exports = {
    once: true,
    execute(client,obj){
        client.user.setActivity('helpPenguin for help', {type: 'WATCHING'})
        console.log("The AngryPenguin is ready!");
    }
}