var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;
var myRestart;

//call function 
function startGame() {
    myGamePiece = new component(60, 60, './image/pig_default.png', 10, 120, "image");
    // myObstacles = new component(15, 320, 'green', 300, 120);
    myScore = new component("30px", "Consolas", "black", 880, 40, "text");
    myBackground = new component(1240, 440, './image/background.jpg', 0, 0, "background");
    // myRestart = new component(15, 32, 'green', 300, 120);
    myGameArea.start();
}

//area container
var myGameArea = {
    canvas: document.createElement('canvas'),
    start: function () {
        this.canvas.width = 1240;
        this.canvas.height = 440;
        // this.canvas.style.cursor = "none";
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        //counting frame
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 10);
    },
    //clear area game at every update
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

//component constructor
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    //speed indicators
    this.speedX = 0;
    this.speedY = 0;
    //gravity
    this.gravity = 0.01;
    this.gravitySpeed = 0;
    //update position
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == 'text') {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            }
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

    };
    this.newPos = function () {
        if (type == "image") {
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;
            this.hitBottom();
        }
        else {
            //uses the speedX and speedY to change component's position
            this.x += this.speedX;
            this.y += this.speedY;
        }
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
    };
    //stop the falling when it hits the bottom
    this.hitBottom = function () {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
        }
    };
    //check component crashes another component 
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

//function update
function updateGameArea() {
    var x, y;
    // piece crash with obstacles => stop
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(200)) {
        x = myGameArea.canvas.width;
        minHeight = 40;
        maxHeight = 300;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 150;
        maxGap = 300;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new component(20, height, 'green', x, 0));
        myObstacles.push(new component(20, x - height - gap, 'green', x, height + gap));
    }
    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].newPos();
        myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
    myRestart.update();
    // }
}

//current frame number corresponds with the given interval.
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

//fly up in the air
function accelerate(n, src) {
    myGamePiece.image.src = src;
    myGamePiece.gravity = n;
}
function restartgame(x) {
    myGameArea.stop();
    document.getElementsByName('canvas').innerHTML = "";
    startGame();
}