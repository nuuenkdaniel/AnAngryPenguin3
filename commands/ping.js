module.exports = {
    name: "ping",
    description: "replies with pong!",
    execute(args,message,client,Discord){
        args.reply("pong");
    }
}