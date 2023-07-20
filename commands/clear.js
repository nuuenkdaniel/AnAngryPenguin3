module.exports = {
    name: "clear",
    description: "Clears the specified amount of messages",
    async execute(args,message,client,Discord){
        if(!args.member.permissions.has("ADMINISTRATOR")){
            return message.reply("You do not have the permission to clear messages");
        }
        if(!message[0]){
            return args.reply("Enter the amount of messages you want to clear");
        }
        if(isNaN(message[0])){
            return args.reply("Enter a real number");
        }

        if(message[0] > 50){
            return args.reply("You cannot delete more than 50 messages");
        }
        if(message[0] < 1){
            return args.reply("You must delete more than 1 message");
        }
        try{
            await args.channel.messages.fetch({limit: message[0]}).then(messages =>{
                args.channel.bulkDelete(messages);
            })
        }
        catch(err){
            console.err(err);
        }
    }
}