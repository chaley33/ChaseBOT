const RPS = require('./RPS');
const players = require('./Players.js');
const Discord = require('discord.js');
const Google = require('google');
const GoogleImages = require('google-images');
const imagesClient = new GoogleImages('007428982546084838130:0kx4gellslj', 'AIzaSyBLxpZP-rRulyggnTDwV4Mrn1y0klbQQqw');
const { prefix, token } = require('./config.json');
const client = new Discord.Client;
let rps;

Google.resultsPerPage = 5;

client.once('ready', () => 
{ 
    rps = new RPS();
    console.log('Ready!'); 
});

client.on('message', message => 
{
    if(!message.author.bot && message.content.startsWith(prefix))
    {
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if(command === `args-info`)
            argsInfoCommand(message, args, command);
        else if(command === `kick`)
            kickCommand(message);
        else if(command === `help`)
            helpCommand(message);
        else if(command === `mock`)
            mockCommand(message);
        else if(command === `google`)
            googleCommand(message);
        else if(command === `image`)
            imageCommand(message);
        else if(command === `rps`)
            rpsCommand(message, args);
        else if(command === 'points')
            pointsCommand(message);
        else if(command === 'setpoints')
            setPointsCommand(message, args);
        else if(command === 'mention')
        {
            message.channel.send(`<@${message.author.id}>`);
        }
        else if(command === 'pm')
        {
            console.log('test');
            message.author.sendMessage(`Hey this is a test.`);
        }
    }
    else if(!message.author.bot)
    {
        if(rps.play)
            rpsResponse(message);
    }
});

client.login(token);

function mock(str)
{
    if(typeof str != "string")
            return str;

        let temp = str;

        for(let i = 0; i < temp.length; i++)
        {
            if(i == 0)
                temp = temp[i].toUpperCase() + temp.slice(i + 1);
            else if(i % 2 == 0)
                temp = temp.slice(0, i) + temp[i].toUpperCase() + temp.slice(i + 1);
            else
                temp = temp.slice(0, i) + temp[i].toLowerCase() + temp.slice(i + 1);
        }

        return temp;
}

function argsInfoCommand(message, args, command)
{
    message.channel.send(`Command name: ${command}\nArguments: ${args}`);
}

function kickCommand(message)
{
    if(message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']))
    {
        let member = message.mentions.members.first();
        member.kick().then((member) => 
        {
            message.channel.send(`:wave: ${member.displayName} has been kicked.`);
        });
    }
}

function helpCommand(message)
{
    message.channel.send(`Commands:\
    \n!help - Shows this message.\
    \n!mock <message> - Sends a message from the BOT in a mocking manner.\
    \n!google <query> - Searches Google for the provided query.\
    \n!image <query> - Search Google for the provided query and posts the first image.\
    \n!rps <points> - Play rock, paper, scissors against another player for points.\
    \n!mention - The bot @mentions you. It's completely useless.`);
}

function mockCommand(message)
{
        console.log(message.author.username + ": " + message.content);
        let member = message.mentions.members.first();
        let temp = mock(message.content.slice(5));
        message.delete().then(message.channel.send(temp));
}

function googleCommand(message)
{
    let search = message.content.slice(7);
    if(search[0] === ' ')
        search = search.slice(1);
    console.log("Searching: " + search);

    Google(search, (err, res) => 
    {
        if(err) console.error(err);
        
        message.channel.send(`Searching: ${res.query} \
        \n ${res.url}`);
    });
}

function imageCommand(message)
{
    let search = message.content.slice(6);
    if(search[0] === ' ')
        search = search.slice(1);
    imagesClient.search(search).then(images => 
    {
        // console.log(images);
        if(images.length === 0)
            message.channel.send("Searching: " + search + "\n" + "No image found.");
        else
            message.channel.send("Searching: " + search + "\n" + images[0].url).catch(e => { console.log(e) });
    }).catch(e => { console.log(e) });
}

function rpsCommand(message, args)
{
    let bet = parseInt(args[0], 10);
    if(rps.bet === undefined || bet < rps.bet)
        rps.bet = bet;
    else
        bet = rps.bet;
    if(isNaN(bet))
    {
        message.channel.send("Invalid command.\nTry !rps <points>");
    }
    else if(players.get(message.author.id) === null)
    {
        players.addPlayer(message.author.id, message.author.tag);
    }
    else if(bet > players.get(message.author.id).points)
        message.channel.send("You do not have enough points!\nYour points: " + players.get(message.author.id).points);
    else if(bet < 0)
        message.channel.send("You must bet at least 0 points.");
    else if(bet <= players.get(message.author.id).points)
    {
        rps.addPlayer(message.author.id, message.channel, message.author.tag);

        if(rps.play)
        {
            message.channel.send(`Enter in your choice now:\
                \n1. Rock\
                \n2. Paper\
                \n3. Scissors\
                \n------------------------------`);
        }
    }
}

function rpsResponse(message)
{
    if(message.content.startsWith(`1`) || message.content.startsWith(`2`) || message.content.startsWith(`3`))
    {
        if(message.author.id === rps.player1.id)
            rps.player1.choice = message.content[0];
        else if(message.author.id === rps.player2.id)
            rps.player2.choice = message.content[0];
        else
            return;

        message.delete();
        
        console.log(`\nPlayer 1's choice: ${rps.player1.choice}\nPlayer 2's choice: ${rps.player2.choice}`);

        let winner;
        if(rps.player1.choice === rps.player2.choice)
            winner = undefined;
        else if(rps.player1.choice === '1')
        {
            if(rps.player2.choice === '2')
            {
                winner = rps.player2.id;
            }
            else if(rps.player2.choice === '3')
            {
                winner = rps.player1.id;
            }
        }
        else if(rps.player1.choice === '2')
        {
            if(rps.player2.choice === '1')
            {
                winner = rps.player1.id;
            }
            else if(rps.player2.choice === '3')
            {
                winner = rps.player2.id;
            }
        }
        else if(rps.player1.choice === '3')
        {
            if(rps.player2.choice === '2')
            {
                winner = rps.player1.id;
            }
            else if(rps.player2.choice === '3')
            {
                winner = rps.player2.id;
            }
        }

        if(rps.player1.choice !== undefined && rps.player2.choice !== undefined)
        {
            if(rps.player1.choice.startsWith('1'))
            {
                rps.player1.choice = "Rock";
            }
            else if(rps.player1.choice.startsWith('2'))
            {
                rps.player1.choice = "Paper";
            }
            else if(rps.player1.choice.startsWith('3'))
            {
                rps.player1.choice = "Scissors";
            }
            
            if(rps.player2.choice.startsWith('1'))
            {
                rps.player2.choice = "Rock";
            }
            else if(rps.player2.choice.startsWith('2'))
            {
                rps.player2.choice = "Paper";
            }
            else if(rps.player2.choice.startsWith('3'))
            {
                rps.player2.choice = "Scissors";
            }

            rps.endGame(message, winner);
            winner = undefined;
        }
    }
}

function pointsCommand(message)
{
    message.channel.send(`<@${message.author.id}>'s points: ${players.get(message.author.id).points}`);
}

function setPointsCommand(message, args)
{
    if(message.member.hasPermission(['BAN_MEMBERS']))
    {
        let points = parseInt(args[0]);
        if(points != NaN)
        {
            message.channel.send("Setting points to " + args[0]);
            players.get(message.author.id).setPoints(args[0]);
        }
    }
}

setInterval(players.savePlayers, 60000);