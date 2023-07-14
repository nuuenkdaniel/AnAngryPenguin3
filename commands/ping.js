module.exports = {
    name: "ping",
    description: "replies with pong!",
    async execute(args,message,client,Discord){
        args.reply("pong");
    }
}