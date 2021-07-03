var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var ballColor = "#0095DD";
var brickColor = "#0095DD"
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

var bricks = [];
for (var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for (var r=0; r<brickRowCount; r++) {
        brickColor = getRandomColor();
        bricks[c][r] = { x: 0, y: 0, color: brickColor, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchmove", touchMoveHandler, false);

function touchMoveHandler(e){
    for (var i=0; i<e.touches.length; i++){
        var relativeX = e.touches[i].clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width)
            paddleX = relativeX-paddleWidth/2;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX >= paddleWidth/2 && relativeX <= canvas.width-paddleWidth/2) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (var c=0; c<brickColumnCount; c++) {
        for (var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!" + "\n" + "YOU GOT " + score + " SCORE!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function getRandomColor() {
    var r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c=0; c<brickColumnCount; c++) {
        for (var r=0; r<brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        ballColor = getRandomColor();
    }

    // paddleY = canvas.height-paddleHeight;

    if (y + dy < ballRadius) {
        dy = -dy;
    } 
    else if (y + dy > canvas.height-ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    
    if (rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

draw();