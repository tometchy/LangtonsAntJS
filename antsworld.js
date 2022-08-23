class AntsWorld {
    constructor(antRectLengthInPixels, numberOfPossibleAntsInRow) {
        this.antRectLengthInPixels = antRectLengthInPixels;
        this.numberOfPossibleAntsInRow = numberOfPossibleAntsInRow;

        this.world = Array.apply(null, new Array(numberOfPossibleAntsInRow)).map(Number.prototype.valueOf, 0);
        for (let i = 0; i < numberOfPossibleAntsInRow; i++) {
            this.world[i] = Array.apply(null, new Array(numberOfPossibleAntsInRow)).map(Number.prototype.valueOf, 0);
        }

        this.ants = [];
        this.mapCanvas = document.getElementById("map").getContext('2d');

        var canvasRectLengthInPixels = this.numberOfPossibleAntsInRow * this.antRectLengthInPixels;
        this.mapCanvas.canvas.width = canvasRectLengthInPixels;
        this.mapCanvas.canvas.height = canvasRectLengthInPixels;

        var borderRectLength = 10;
        this.mapCanvas.fillRect(0, 0, borderRectLength, borderRectLength);
        this.mapCanvas.fillRect(canvasRectLengthInPixels - borderRectLength, canvasRectLengthInPixels - borderRectLength, borderRectLength, borderRectLength);
        this.mapCanvas.fillRect(0, canvasRectLengthInPixels - borderRectLength, borderRectLength, borderRectLength);
        this.mapCanvas.fillRect(canvasRectLengthInPixels - borderRectLength, 0, borderRectLength, borderRectLength);
    }

    moveAnt(i) {
        var world = this.world;
        if ((++world[this.ants[i].x][this.ants[i].y]) === 1) {
            this.ants[i].direction--;
            this.mapCanvas.fillStyle = this.ants[i].color;
            this.mapCanvas.fillRect(this.ants[i].x * this.antRectLengthInPixels, this.ants[i].y * this.antRectLengthInPixels, this.antRectLengthInPixels, this.antRectLengthInPixels);
        } else {
            this.ants[i].direction++;
            world[this.ants[i].x][this.ants[i].y] = 0;
            this.mapCanvas.clearRect(this.ants[i].x * this.antRectLengthInPixels, this.ants[i].y * this.antRectLengthInPixels, this.antRectLengthInPixels, this.antRectLengthInPixels);
        }

        if (this.ants[i].direction === -1) {
            this.ants[i].direction = 3;
        }

        if (this.ants[i].direction === 4) {
            this.ants[i].direction = 0;
        }

        if (this.ants[i].direction === 0) {
            this.ants[i].x++;
        } else if (this.ants[i].direction === 1) {
            this.ants[i].y++;
        } else if (this.ants[i].direction === 2) {
            this.ants[i].x--;
        } else if (this.ants[i].direction === 3) {
            this.ants[i].y--;
        }

        if (this.ants[i].x === -1) {
            this.ants[i].direction = 3;
            this.ants[i].x = 0;
        } else if (this.ants[i].y === -1) {
            this.ants[i].direction = 0;
            this.ants[i].y = 0;
        } else if (this.ants[i].x === this.numberOfPossibleAntsInRow) {
            this.ants[i].x = this.numberOfPossibleAntsInRow - 1;
            this.ants[i].direction = 1;
        } else if (this.ants[i].y === this.numberOfPossibleAntsInRow) {
            this.ants[i].y = this.numberOfPossibleAntsInRow - 1;
            this.ants[i].direction = 2;
        }
    }

    addAnt(ant) {
        this.ants.push(ant);
        var antIndex = this.ants.length - 1;
    }

    startAnts(numberOfPreMadeMoves, millisecondsDelay) {
        var self = this;

        for (var i = 0; i < numberOfPreMadeMoves; i++) {
            for (var j = 0; j < self.ants.length; j++)
                self.moveAnt(j);
        }

        setInterval(function () {
            for (var i = 0; i < self.ants.length; i++)
                self.moveAnt(i);
        }, millisecondsDelay); // Note: 10 milliseconds is the smalles possible interval
    }
}