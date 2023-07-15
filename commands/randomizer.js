module.exports = {
    name: "randomizer",
    description: "Give it a set of items and percents(without the percent sign) for each item Ex. (randomizer TDM: 60 DM: 30 Aaron: 10)",
    execute(args,message){
        let items = [];
        let value = [];
        for(let i = 0; i < message.length/2; i++){
            items[i] = message[i*2].substring(0,message[i*2].length-1);
            value[i] = (i === 0)? (Number(message[i*2+1])/100)*1000 : (Number(message[i*2+1])/100)*1000 + value[i-1];
        }
        const randomValue = Math.random()*1000;
        for(let e = value.length-2; e >= 0; e--){
            if(value[e] < randomValue) {
                args.channel.send(`The randomizer picked: ${items[e+1]}`);
                return;
            }
        }
        args.channel.send(`The randomizer picked: ${items[0]}`);
    }
}