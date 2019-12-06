const Player = require('./Player.js');
const players = require('./Players.js');
const Main = require('./index.js');
class RPS
{
    constructor()
    {
        this.allPlayers = players.allPlayers;
        this.player1, this.player2;
        this.play = false;
        this.bet = undefined;
    }

    addPlayer(id, channel, tag)
    {
        let playerAdded = false;
        this.oChannel = channel;
        
        while(!playerAdded)
        {
            for(let player of this.allPlayers)
            {
                if(id === player.id)
                {
                    playerAdded = true;
                    if(this.player1 === undefined && player !== undefined)
                    {
                        this.player1 = player;
                        channel.send(`Player 1 is <@${id}>`);
                    }
                    else if(this.player2 === undefined && player !== undefined)
                    {
                        this.player2 = player;
                        channel.send(`Player 2 is <@${id}>`);
                        players.savePlayers();
                        this.play = true;
                    }
                    else
                        channel.send(`Two people are already playing.`);
                }
            }

            if(!playerAdded)
            {
                this.allPlayers.push(new Player(id, tag));
                this.allPlayers[this.allPlayers.length - 1].setPoints(100);
            }
        }
    }

    setBet(bet)
    {
        this.bet = bet;
    }

    endGame(message, winner)
    {
        this.play = false;

        if(winner !== undefined)
            message.channel.send(`<@${this.player1.id}>'s choice: ${this.player1.choice}\n<@${this.player2.id}>'s choice: ${this.player2.choice}\
                \n\nThe winner is: <@${winner}>`);
        else
            message.channel.send(`<@${this.player1.id}>'s choice: ${this.player1.choice}\n<@${this.player2.id}>'s choice: ${this.player2.choice}\
                \n\nThe winner is: Nobody! The game was a tie.`);
        
        if(winner === this.player1.id)
        {
            this.player1.addPoints(this.bet);
            this.player2.addPoints(-this.bet);
        }
        else if(winner === this.player2.id)
        {
            this.player1.addPoints(-this.bet);
            this.player2.addPoints(this.bet);
        }

        this.player1.choice = undefined;
        this.player2.choice = undefined;
        this.player1 = undefined;
        this.player2 = undefined;
        this.bet = undefined;

        players.savePlayers();
    }
}

module.exports = RPS;