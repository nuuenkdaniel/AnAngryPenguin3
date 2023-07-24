module.exports = {
    name: "clear",
    description: "Clears the specified amount of messages",
    async execute(message,args){
        if(!message.member.permissions.has("ADMINISTRATOR")){
            return message.reply("You do not have the permission to clear messages");
        }
        if(!args[0]){
            return message.reply("Enter the amount of messages you want to clear");
        }
        if(isNaN(args[0])){
            return message.reply("Enter a real number");
        }

        if(args[0] > 50){
            return message.reply("You cannot delete more than 50 messages");
        }
        if(args[0] < 1){
            return message.reply("You must delete more than 1 message");
        }
        try{
            await message.channel.messages.fetch({limit: args[0]}).then(messages =>{
                message.channel.bulkDelete(messages);
            })
        }
        catch(err){
            console.err(err);
        }
    }
}