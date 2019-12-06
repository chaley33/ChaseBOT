const lineReader = require('line-reader');
const fs = require('fs');
const Player = require('./Player.js');
let stream = fs.createWriteStream('./players.txt', {flags: 'a'});
class Players
{
    constructor()
    {
        console.log("Players created.");
        this.allPlayers = this.loadPlayers();
    }

    addPlayer(id, tag)
    {
        this.allPlayers.push(new Player(id, tag));
        this.savePlayers();
    }

    loadPlayers()
    {
        let temp = [];
        let lineCount = 0;
        lineReader.eachLine('./players.txt', line => 
        {
            lineCount++;

            if(lineCount % 3 == 1)
            {
                temp.push(new Player(line));
            }
            else if(lineCount % 3 == 2)
            {
                temp[(lineCount - 2) / 3].setTag(line);
            }
            else if(lineCount % 3 == 0)
            {
                temp[(lineCount - 3) / 3].setPoints(parseInt(line, 10));
            }
        });

        return temp;
    }

    savePlayers()
    {
        console.log("Saving...");
        let data = "";
        for(let player of instance.allPlayers)
        {
            data += player.id + "\n";
            data += player.tag + "\n";
            data += player.points + "\n";
        }


        fs.writeFile('./players.txt', data, err =>
        {
            if(err) throw err;
        });
    }

    get(id)
    {
        for(let player of this.allPlayers)
        {
            if(player.id === id)
                return player;
        }

        return null;
    }
}

const instance = new Players();
Object.freeze(instance);

module.exports = instance;