const fs = require('fs');

module.exports = {
    name: "changePrefix",
    description: "changes the prefix to the given prefix",
    execute(args,message){
        let newPrefix = message.join(' ');
        console.log(newPrefix);
        try{
            fs.writeFileSync('./prefix.txt', newPrefix);
        }
        catch(err){
            console.log(err);
        }
        args.channel.send("The prefix is now: "+newPrefix);
    }
}