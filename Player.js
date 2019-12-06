class Player
{
    constructor(id, tag)
    {
        this.id = id;
        this.tag = tag;
        this.points = 100;
        this.choice;
    }

    setTag(tag)
    {
        this.tag = tag;
    }

    addPoints(points)
    {
        this.points += points;
    }

    setPoints(points)
    {
        this.points = points;
    }
}

module.exports = Player;