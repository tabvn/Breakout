var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 10;
var dy = -10;
var ballRadius = 10;
var ballColor = "#0095DD";
var brickColor = "#0095DD"
var paddleHeight = 15;
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
var circle = {cx: 0, cy: 0, cr: 0};
var rect = {x: 0, y: 0, w: 0, h: 0};
var fps = 60;
var fpsInterval = 1000 / fps;
var then = Date.now();
var startTime = then;
var delta = 30;
var now;
var deltaX = dx * (delta/100);
var deltaY = dy * (delta/100);

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
        if (relativeX >= paddleWidth/2 && relativeX <= canvas.width-paddleWidth/2)
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

function RectCircleColliding(circle, rect){
    var distX = Math.abs(circle.cx - rect.x-rect.w/2);
    var distY = Math.abs(circle.cy - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.cr)) { return false; }
    if (distY > (rect.h/2 + circle.cr)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dxx = distX - rect.w/2;
    var dyy = distY - rect.h/2;
    
    return (dxx*dxx + dyy*dyy <= (circle.cr*circle.cr));
}

function collisionDetection() {
    circle.cx = x + deltaX;
    circle.cy = y + deltaY;
    circle.cr = ballRadius;

    for (var c=0; c<brickColumnCount; c++) {
        for (var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                rect.x = b.x;
                rect.y = b.y;
                rect.w = brickWidth;
                rect.h = brickHeight
                if (RectCircleColliding(circle, rect)) {
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

    if (x + deltaX > canvas.width-ballRadius || x + deltaX < ballRadius) {
        dx = -dx;
        ballColor = getRandomColor();
    }

    // paddleY = canvas.height-paddleHeight;

    if (y + deltaY < ballRadius) {
        dy = -dy;
    } 

    // if (x - ballRadius < paddleX + paddleWidth &&
    //     x - ballRadius + 2 * ballRadius > paddleX &&
    //     y - ballRadius < canvas.height &&
    //     y - ballRadius + 2 * ballRadius > canvas.height - paddleHeight) {
    //         dy = -dy;
    //         console.log("BALL TOUCH PADDLE");
    // }
   
    rect.x = paddleX;
    rect.y = canvas.height - paddleHeight;
    rect.w = paddleWidth;
    rect.h = paddleHeight;

    if (RectCircleColliding(circle, rect)) {
        dy = -dy;
        console.log("BALL TOUCH PADDLE");
    }  

    if (y + deltaY  > canvas.height - ballRadius) {
        console.log("BALL FALL OUT");
        lives--;
        if (!lives) {
            alert("GAME OVER");
            document.location.reload();
        }
        else {
            x = canvas.width/2;
            y = canvas.height-30;
            dx = 10;
            dy = -10;
            paddleX = (canvas.width-paddleWidth)/2;
        }
    }
    
    if (rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

   // x += dx * (delta / 100);
   // y += dy * (delta / 100);
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
    

    deltaX = dx * (delta /100);
    deltaY = dy * (delta /100);
    x += deltaX;
    y += deltaY;

    requestAnimationFrame(draw);

    now = Date.now();
    delta = now - then;
    
    if (delta > fpsInterval) {
        then = now - (delta % fpsInterval);
    }
    else delta = 0;
}

draw();