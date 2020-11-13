const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "$"
const version = "1.0"

let pollChannel = false

function pingUser(user) {
    return "<@"+user.id+">"
};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setPresence({
        game: { 
            name: '$help',
            type: 'WATCHING'
        },
        status: 'online'
    });
});

client.on('message', message => {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
        case('poll:create'):
            if (!pollChannel) {
                message.channel.send("Poll Channel Not Set!, use $poll:channel <channel> "+pingUser(message.author));
                break;
            };
            if (args.length != 4) {
                message.channel.send("Invalid poll "+pingUser(message.author));
                break;
            }
            const o1 = args[0];
            const o2 = args[2];
            const e1 = args[1];
            const e2 = args[3];
            const promise = pollChannel.send(o1+" "+e1+" or "+o2+" "+e2+" ?");
            promise.then(function (message) {
                message.react(e1);
                message.react(e2);
            });
            break;
        case('poll:channel'):
            const desiredChannel = message.mentions.channels.first();
            if (!desiredChannel) {
                message.channel.send("Poll Channel Not Set!, please mention a channel "+pingUser(message.author));
                break;
            };
            if (desiredChannel) {
                pollChannel = desiredChannel;
            };
            console.log("Set poll channel to: "+pollChannel.name);
            message.channel.send("Poll channel set to: " + pollChannel + " "+pingUser(message.author));
            break;
        case("help"):
            message.channel.send("**Commands:**");
            message.channel.send(" - "+prefix+"poll:create <option1> <emoji1> <option2> <emoji2>");
            message.channel.send(" - "+prefix+"poll:channel <channel>");
            break;
    }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
