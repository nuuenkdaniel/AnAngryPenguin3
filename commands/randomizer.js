module.exports = {
    name: "randomizer",
    description: "Give it a set of items and percents(without the percent sign) for each item Ex. (randomizer TDM: 60 DM: 30 Aaron: 10)",
    execute(message,args){
        let items = [];
        let value = [];
        for(let i = 0; i < args.length/2; i++){
            items[i] = args[i*2].substring(0,args[i*2].length-1);
            value[i] = (i === 0)? (Number(args[i*2+1])/100)*1000 : (Number(args[i*2+1])/100)*1000 + value[i-1];
        }
        const randomValue = Math.random()*1000;
        for(let e = value.length-2; e >= 0; e--){
            if(value[e] < randomValue) {
                message.channel.send(`The randomizer picked: ${items[e+1]}`);
                return;
            }
        }
        message.channel.send(`The randomizer picked: ${items[0]}`);
    }
}