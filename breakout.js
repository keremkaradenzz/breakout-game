function start() {
    drawTable();
    document.getElementById("btn").style.visibility = "hidden";
    document.getElementById("prg").style.visibility = "hidden";
    var level = [
        '**************',
        '**************',
        '**************',
        '**************'
    ];

    var gameLoop;
    var gameSpeed = 20;
    var ballMovementSpeed = 3;
    var _score=0;
    var topSpeed=0;
    var leftSpeed=0;
    
    var bricks = [];
    var bricksMargin = 1;
    var bricksWidth = 0;
    var bricksHeight = 18;

    var ball = {
        width: 6,
        height: 6,
        left: 0,
        top: 0,
        speedLeft: 0,
        speedTop: 0
    };
    var d = 0;
    var paddle = {
        width: 100,
        height: 6,
        left: (document.getElementById('breakout').offsetWidth / 2) - 30,
        top: document.getElementById('breakout').offsetHeight - 40
    };
    var rightPressed = false;
    var leftPressed = false;
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false)
    function startGame() {


        resetBall();
        buildLevel();
        createBricks();
        updateObjects();
    }

    function drawTable() {
        document.body.style.background = '#0E5CAD';
        document.body.style.font = '18px Orbitron';
        document.body.style.color = '#FFF';
        
        var breakout = document.createElement('div');
        var paddle = document.createElement('div');
        var ball = document.createElement('div');
        var score=document.createElement('h3');

        var topScore=document.createElement('p');
        topScore.style.color="white";
        topScore.innerHTML="TOPSCORES";
        topScore.style.marginLeft="5";
        topScore.id="TopScore";

        score.style.color="white";
        score.innerHTML=0;
        score.style.marginLeft="5";
        score.id="score";
        for (var i = 0; i < 3; i++) {

            var heart = document.createElement('div');
            heart.id = "heart" + i;
            heart.style.backgroundColor = "Red"
            heart.style.width = '20px';
            heart.style.height = '20px';
            heart.style.borderRadius = "20px";
            heart.style.marginLeft = "5px";
            heart.style.float = "right";
            breakout.appendChild(heart);
        }


        breakout.id = 'breakout';
        breakout.style.width = '800px';
        breakout.style.height = '600px';
        breakout.style.position = 'fixed';
        breakout.style.left = '50%';
        breakout.style.top = '50%';
        breakout.style.transform = 'translate(-50%, -50%)';
        breakout.style.background = '#000000';

        paddle.id = 'paddle';
        paddle.style.background = '#E80505';
        paddle.style.position = 'absolute';
        paddle.style.boxShadow = '0 15px 6px -2px rgba(0,0,0,.6)';

        ball.className = 'ball';
        ball.style.position = 'absolute';
        ball.style.background = '#FFF';
        ball.style.boxShadow = '0 15px 6px -1px white';
        ball.style.borderRadius = '50%';
        ball.style.zIndex = '9';

        var a = [];
        a = JSON.parse(localStorage.getItem('session')) || [];
        a.sort(function(a, b){return a - b}); // kücükten 
        a.reverse()
        for(var i=0;i<3;i++)
        {
            topScore.innerHTML+=`<br>`+a[i];
     
        }
      
        breakout.appendChild(paddle);
        breakout.appendChild(ball);
        breakout.appendChild(score);
        document.body.appendChild(topScore);
        document.body.appendChild(breakout);
    }

    function removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    function buildLevel() {
        var arena = document.getElementById('breakout');

        bricks = [];

        for (var row = 0; row < level.length; row++) {
            for (var column = 0; column <= level[row].length; column++) {

                if (!level[row][column] || level[row][column] === ' ') {
                    continue;
                }

                bricksWidth = (arena.offsetWidth - bricksMargin * 2) / level[row].length;

                bricks.push({
                    left: bricksMargin * 2 + (bricksWidth * column),
                    top: bricksHeight * row + 60,
                    width: bricksWidth - bricksMargin * 2,
                    height: bricksHeight - bricksMargin * 2
                });
            }
        }
    }

    function removeBricks() {
        document.querySelectorAll('.brick').forEach(function (brick) {
            removeElement(brick);
        });

    }
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function createBricks() {
        removeBricks();

        var arena = document.getElementById('breakout');
        
        bricks.forEach(function (brick, index) {
            var element = document.createElement('div');

            element.id = 'brick-' + index;
            element.className = 'brick';
            element.style.left = brick.left + 'px';
            element.style.top = brick.top + 'px';
            element.style.width = brick.width + 'px';
            element.style.height = brick.height + 'px';
            element.style.background = '#FFFFFF';
            element.style.position = 'absolute';
            element.style.boxShadow = '0 15px 20px 0px rgba(0,0,0,.4)';
            element.style.color = "black";
            //-> element.innerHTML = Math.floor(Math.random()*10);   
            element.innerHTML = index+1;
            element.style.backgroundColor = getRandomColor();
            arena.appendChild(element)
        });
    }
    
    function updateObjects() {
        document.getElementById('paddle').style.width = paddle.width + 'px';
        document.getElementById('paddle').style.height = paddle.height + 'px';
        document.getElementById('paddle').style.left = paddle.left + 'px';
        document.getElementById('paddle').style.top = paddle.top + 'px';

        document.querySelector('.ball').style.width = ball.width + 'px';
        document.querySelector('.ball').style.height = ball.height + 'px';
        document.querySelector('.ball').style.left = ball.left + 'px';
        document.querySelector('.ball').style.top = ball.top + 'px';
    }

    function resetBall() {
        var arena = document.getElementById('breakout');

        ball.left = (arena.offsetWidth / 2) - (ball.width / 2);
        ball.top = (arena.offsetHeight / 1.6) - (ball.height / 2);
        ball.speedLeft = 1;
        ball.speedTop = ballMovementSpeed;

        if (Math.round(Math.random() * 1)) {
            ball.speedLeft = -ballMovementSpeed;
        }

        document.querySelector('.ball').style.left = ball.left + 'px';
        document.querySelector('.ball').style.top = ball.top + 'px';

    }
    function keyDownHandler(e) {
        var arena = document.getElementById('breakout');
        
        var arenaWidth = arena.offsetWidth;
        if (e.key == "Right" || e.key == "ArrowRight" ) {
            rightPressed = true;
          
            if(paddle.left<=arenaWidth-paddle.width-20)
            {
                paddle.left += 20;
            }
            
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
            if(paddle.left>=(document.getElementById('paddle').offsetWidth / 2)-39)
            {
                paddle.left -= 20;
            }
        }
        if (e.keyCode == 80) pauseGame();
        if (e.keyCode == 82) resumeGame();
      
    }
    function resumeGame(){
        ball.speedTop=topSpeed;
        ball.speedLeft=leftSpeed;
       /* var ob=document.getElementById("btn-1");
        ob.style.visibility="hidden";*/
    }
    function pauseGame() {
         topSpeed=ball.speedTop;
         leftSpeed=ball.speedLeft;
         ball.speedTop=0;
         ball.speedLeft=0;
         resumeBtn();
    }
    
    function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;

        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }
    function resumeBtn()
    {
        window.alert("PAUSED GAME - Press 'R' to continue. ")
      /*  var resume=document.createElement("div");
        resume.id="btn-1";
        
        resume.style.visibility="visible";
        resume.style.backgroundColor="white";
        resume.style.color="black";
        resume.innerHTML="RESUME";
        resume.style.display="inline";
        document.body.appendChild(resume);*/
    }
    function movePaddle(clientX) {  // mouse movement
        var arena = document.getElementById('breakout');
        var arenaRect = arena.getBoundingClientRect();
        var arenaWidth = arena.offsetWidth;
        var mouseX = clientX - arenaRect.x;
        var halfOfPaddle = document.getElementById('paddle').offsetWidth / 2;


        if (mouseX <= halfOfPaddle) {
            mouseX = halfOfPaddle;
        }

        if (mouseX >= arenaWidth - halfOfPaddle) {
            mouseX = arenaWidth - halfOfPaddle;
        }


        paddle.left = mouseX - halfOfPaddle;
    }
    function SaveDataToLocalStorage(data)
{
    var a = [];
    a = JSON.parse(localStorage.getItem('session')) || [];
    a.push(data);
    localStorage.setItem('session', JSON.stringify(a));
}
    function moveBall() { // top movement

        detectCollision();

        var arena = document.getElementById('breakout');

        ball.top += ball.speedTop;
        ball.left += ball.speedLeft;

        if (ball.left <= 0 || ball.left + ball.width >= arena.offsetWidth) {

            ball.speedLeft = -ball.speedLeft;

        }
        if (ball.top <= 0 || ball.top + ball.height >= arena.offsetHeight) {
            ball.speedTop = -ball.speedTop

        }


        if (ball.top + ball.height >= arena.offsetHeight) {

            resetBall();
            var hearts = document.getElementById("heart"+d);
            hearts.remove();

            d++;
            if (d == 3) {
                SaveDataToLocalStorage(_score);
                window.alert("GAME OVER");
                window.location.reload(1);

            }


        }
    }


    function detectCollision() {
        if (ball.top + ball.height >= paddle.top
            && ball.top + ball.height <= paddle.top + paddle.height
            && ball.left >= paddle.left
            && ball.left <= paddle.left + paddle.width
        ) {
            ball.speedTop = -ball.speedTop;
            ball.left += 9;

            if (ball.speedTop > -10) {
                ball.speedTop -= 2;
            }


        }

        for (var i = 0; i < bricks.length; i++) {
            var brick = bricks[i];

            if (ball.top + ball.height >= brick.top
                && ball.top <= brick.top + brick.height
                && ball.left + ball.width >= brick.left
                && ball.left <= brick.left + brick.width
                && !brick.removed
            ) {
                console.log(brick);
          
                brick.height = 0;
                brick.width = 0;
                brick.top = 0;
                brick.left = 0;
                
              
                var score=document.getElementById("score");
                _score++;
         
                score.innerHTML=_score;
                createBricks();

                ball.speedTop = -ball.speedTop; 

                break;
            }
        }
    }



    function setEvents() {
        document.addEventListener('mousemove', function (event) {
            movePaddle(event.clientX);
        });
    }

    function startGameLoop() {

        gameLoop = setInterval(function () {
            moveBall();

            updateObjects();
        }, gameSpeed);
    }

    setEvents();
    startGame();
    startGameLoop();


};