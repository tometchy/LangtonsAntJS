class AntsWorld {
    constructor(antRectLengthInPixels, numberOfPossibleAntsInRow) {
        this.antRectLengthInPixels = antRectLengthInPixels;
        this.numberOfPossibleAntsInRow = numberOfPossibleAntsInRow;

        this.world = Array.apply(null, new Array(numberOfPossibleAntsInRow)).map(Number.prototype.valueOf, 0);
        for (let i = 0; i < numberOfPossibleAntsInRow; i++) {
            this.world[i] = Array.apply(null, new Array(numberOfPossibleAntsInRow)).map(Number.prototype.valueOf, 0);
        }

        this.ants = [];
        var mapCanvas = document.getElementById("map");
        mapCanvas.insertAdjacentHTML('beforebegin', '<div style="font-size: 200%"> <label for="phase">Phase:</label> <input type="number" id="phase" value="0" readonly> <label for="interval">Interval (millis):</label> <input type="number" id="interval" required min="10" value="10"> <button id="playOrPause">&#9654;/&#9208;</button> <button id="oneStep">One step</button> </div>');
        this.mapCanvasContext = mapCanvas.getContext('2d');

        var canvasRectLengthInPixels = this.numberOfPossibleAntsInRow * this.antRectLengthInPixels;
        this.mapCanvasContext.canvas.width = canvasRectLengthInPixels;
        this.mapCanvasContext.canvas.height = canvasRectLengthInPixels;

        var borderRectLength = 10;
        this.mapCanvasContext.fillRect(0, 0, borderRectLength, borderRectLength);
        this.mapCanvasContext.fillRect(canvasRectLengthInPixels - borderRectLength, canvasRectLengthInPixels - borderRectLength, borderRectLength, borderRectLength);
        this.mapCanvasContext.fillRect(0, canvasRectLengthInPixels - borderRectLength, borderRectLength, borderRectLength);
        this.mapCanvasContext.fillRect(canvasRectLengthInPixels - borderRectLength, 0, borderRectLength, borderRectLength);

        var self = this;
        document.getElementById("oneStep").onclick = function () { self.makeOneStep(); };
        document.getElementById("playOrPause").onclick = function () { self.startOrStop(); };
    }

    #moveAnt(i) {
        var world = this.world;
        if ((++world[this.ants[i].x][this.ants[i].y]) === 1) {
            this.ants[i].direction--;
            this.mapCanvasContext.fillStyle = this.ants[i].color;
            this.mapCanvasContext.fillRect(this.ants[i].x * this.antRectLengthInPixels, this.ants[i].y * this.antRectLengthInPixels, this.antRectLengthInPixels, this.antRectLengthInPixels);
        } else {
            this.ants[i].direction++;
            world[this.ants[i].x][this.ants[i].y] = 0;
            this.mapCanvasContext.clearRect(this.ants[i].x * this.antRectLengthInPixels, this.ants[i].y * this.antRectLengthInPixels, this.antRectLengthInPixels, this.antRectLengthInPixels);
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
    }

    onAntsReady() {
        this.makeOneStep();
    }

    makeOneStep() {
        for (var i = 0; i < this.ants.length; i++)
            this.#moveAnt(i);
        document.getElementById('phase').stepUp();
    }

    jumpMoves(numberOfMovesToJump) {
        for (var i = 0; i < numberOfMovesToJump; i++)
            this.makeOneStep();
    }

    startAnts(millisecondsDelay = null) {
        if (millisecondsDelay == null)
            millisecondsDelay = document.getElementById('interval').value;
        else
            document.getElementById('interval').value = millisecondsDelay;

        var self = this;

        this.intervalId = setInterval(function () {
            self.makeOneStep();
        }, millisecondsDelay); // Note: 10 milliseconds is the smallest possible interval

        document.getElementById('interval').readOnly = true;
    }

    startOrStop() {
        if (this.intervalId == null)
            this.startAnts();
        else
            this.stopAnts();
    }

    stopAnts() {
        clearInterval(this.intervalId);
        document.getElementById('interval').readOnly = false;
        this.intervalId = null;
    }
}