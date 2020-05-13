window.onload = function () 
{
	if(playAgain)
	{
		var abcd = document.getElementById("start");
		abcd.click();
	}
};

// Start Game Function
function startGame()
{
	info.remove();
	myGameArea.start();
	createCircle();
	increment();
    animate();
    updateArea();
}
var info = document.querySelector(".info");
var navBar = document.getElementById("play");
var circleArray = [];
// Game Area Object
var myGameArea = 
	{
	canvas : document.createElement("canvas"),
	start : function () {
		this.canvas.width = window.innerWidth - 10;
		this.canvas.height = window.innerHeight - 160;
		this.context = this.canvas.getContext('2d');
		navBar.appendChild(this.canvas);
		this.canvas.setAttribute("id","container");
	}
}
var animateId;
var pause = false;
var sec=10,ms=0,count,sec_alt,ms_alt;
var test = true;
var gameOver = false;
// StopWatch Function
var stopwatch = 
{
  start: function()
  {
    ms = 0;
    sec = 10;
    count = setInterval(function()
    {
      if(ms<=0 && sec>=0)
      {
        ms = 100;
        sec--;
      }
      else if (ms>0 && sec>=0)
      {
        ms--;
      }
      else if(sec<=0)
      {
      	sec = 0;
      	ms = 0;
      	stopwatch.stop();
      }
      else
      {
      	stopwatch.stop();
      }
      sec_alt = stopwatch.display(sec);
      ms_alt = stopwatch.display(ms);

      stopwatch.update(sec_alt + ":" + ms_alt);
    },10);
  },
  stop: function()
  {
    clearInterval(count);
  },
  update: function(txt)
  {
    var temp = document.getElementById("timer");
    temp.firstChild.nodeValue = txt;
  },
  display: function(time)
  {
    var temp;
    if(time < 10)
    {
      temp = "0" + time;
    }
    else
    {
      temp = time;
    }
    return temp;
    
  }
};
var end = false;
var scoreDisplay = document.getElementById('score');
var timer = document.getElementById('timer');
var nCircle = 1;
var timerInterval;
var w = window.innerWidth - 10;
var h = window.innerHeight - 160;
var area = w*h; 
var groupArea = 0;
var occupied = 0;
var interval,j=0;
var time = 400;
var score = 0;
var overflow = false;
var index = [];
var remCircle = [];
var remRadius = [];
var startTimer = false;
var playAgain = false;
var playBtn = document.getElementById("start");
var pauseBtn = document.getElementById('pause');
var resumeBtn = document.getElementById("resume");
// Play Button
playBtn.onclick = function () 
{
	resetConditions();
	cancelAnimationFrame(animateId);
	startGame();
	if(this.textContent === "Play Again?")
	{
		// this.textContent = "Play";
		playAgain = true;
		location.reload();
	}
}

// Pause Button
pauseBtn.addEventListener('click',function()
{
	pause = true;
});
// Resume Button
resumeBtn.addEventListener('click',function() 
{
	if(pause)
	{
		pause = false;
		increment();
		cancelAnimationFrame(animateId);
		animate();
	}
});
var maxRadius = 60;
var mouse = {
	x: undefined,
	y: undefined
}
var colors = ["#3726A6","#4A44F2","#F2E635","#F2BE22","#F20505"];
// Getting the mouse Coordinates
window.addEventListener("mousedown",function(event){
	mouse.x = event.clientX - myGameArea.canvas.offsetLeft;
	mouse.y = event.clientY - myGameArea.canvas.offsetTop;
});
// Resizing Window
window.addEventListener('resize',function() 
{
	myGameArea.canvas.width = window.innerWidth - 10;
	myGameArea.canvas.height = window.innerHeight - 160;
	cancelAnimationFrame(animateId);
	animate();
});
// Get Distance Function
function getDistance(x1,y1,x2,y2)
{
	var xDistance = x2-(x1);
	var yDistance = y2-(y1);
	return Math.sqrt(Math.pow(xDistance,2) + Math.pow(yDistance,2));
}
// Circle Object
function Circle(x,y,dx,dy,radius,isLiving)
{
	var c = myGameArea.context;
	this.isLiving = isLiving;
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius
	this.color = colors[Math.floor(Math.random()*4 + 1)];
	this.minRadius = radius;
	this.draw = function()
	{
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		c.fillStyle = this.color;
		c.fill();
	}
	this.update = function()
	{
		if(this.isLiving && !pause)
		{
			this.x+=this.dx;
			this.y+=this.dy;
			if(this.x + this.radius>(window.innerWidth - 23) || this.x - this.radius<0)
			{
				this.dx = -this.dx;
			}
			if(this.y + this.radius>(window.innerHeight - 160) ||this.y - this.radius<0)
			{
				this.dy = -this.dy;
			}
			this.draw();
		}
		else 
		{
			return;
		}
	}
	this.remove = function()
	{
		if(getDistance(this.x,this.y,mouse.x,mouse.y)<this.radius)
		{
			this.isLiving = false;
			remRadius.push(this.radius);
			this.radius = 0;
		}
	}
	
}
// UpdateArea function
function updateArea()
{
	circleArray.forEach(function (argument) 
	{
		groupArea+= calculateArea(argument);
	});
	occupied = (groupArea/area)*100;
	groupArea = 0;
	if(parseFloat(occupied.toPrecision(3),10)>75)
	{
		startTimer = true;
	}
}
// To calculate the area of the bubble
function calculateArea(obj)
{
	return Math.PI*(Math.pow(obj.radius,2));
}
// Creating Bubbles
function createCircle()
{
	for(var i=0;i<nCircle;i++)
{   
	var radius= Math.random()*20 + 20 ;
	var x=Math.random() * ((window.innerWidth - 23) - radius*2) + radius;
	var dx  = (Math.random() - 0.5)*2 ;
	var dy = (Math.random() - 0.5)*2 ;
	
	var y=Math.random() * ((window.innerHeight - 145) - radius*2) + radius;
	circleArray.push(new Circle(x,y,dx,dy,radius,true));
}
if(gameOver)
{
	circleArray.length = 0;
	return 1;
}
}
// Incrementing the number of bubbles as time Progresses
function increment()
{
	if(occupied>75 && end)
	{
		clearInterval(interval);
	}
	else if(occupied<97)
	{
		interval = setInterval(function () 
		{
			/*var radius= Math.random()*20 + 20 ;
		    var x=Math.random() * ((window.innerWidth - 23) - radius*2) + radius;
		    var dx  = (Math.random() - 0.5)*2 ;
		    var dy = (Math.random() - 0.5)*2 ;
			var y=Math.random() * ((window.innerHeight - 145) - radius*2) + radius;
		    circleArray.push(new Circle(x,y,dx,dy,radius,true));*/
		    createCircle();
		   	for(var i=0; i<circleArray.length;i++)
		   	{
		   		if(!circleArray[i].isLiving)
		   		{
		   			index[i] = circleArray[i];
		   		}
		   	}
		   	scoreBoard();
		},time);
	}
	if(pause)
	{
		return 1;
	}
}
// Updating score board
function scoreBoard()
{
	var filtered = index.filter(function (el) 
	{
  	return el != null;
	});
	remCircle[j] = filtered;
}
// Calculating score Function
function calculateScore () 
{
	for(var i=0;i<remRadius.length;i++)
	{
		if(remRadius[i]>20 && remRadius[i]<=25)
		{
			score = score + 5;
		}
		else if(remRadius[i]>=26 && remRadius[i]<=30)
		{
			score = score + 10;
		}
		else if(remRadius[i]>=31 && remRadius[i]<=35)
		{
			score = score + 15;
		}
		else if(remRadius[i]>=36 && remRadius[i]<=40)
		{
			score = score + 20;
		}
	}
	scoreDisplay.textContent = score.toString();
	score = 0;
}
// Reset Conditions
function resetConditions()
{
	circleArray.length = 0;
	playAgain = false;
	gameOver = false;
	interval = 0;
	pause = false, end = false, overflow = false, startTimer = false, test = true;
	sec = 10, ms = 0;
	nCircle = 1;
	groupArea = 0;
	occupied = 0;
	j=0, score = 0;
	time = 400;
	index = [];
	remCircle = [];
	remRadius = [];
	cancelAnimationFrame(animateId);
}
// Animate Function
function animate()
{
		
		if(sec<=0)
		{
			myGameArea.canvas.classList.add('selected');
			calculateScore();
			end = true;
			setTimeout(function () 
			{
				var c = myGameArea.context;
				c.clearRect(0, 0, innerWidth, innerHeight);
				myGameArea.canvas.classList.remove('selected');
				c.fillStyle = 'blue';
				c.font = "700 50px Jost";
				c.fillText('Game Over!!',(myGameArea.canvas.width - 200)/2,(myGameArea.canvas.height)/2);
			},500);
			playBtn.textContent = "Play Again?";
			gameOver = true;
			circleArray.length = 0;
			return 1;
		}
		else
		{
				if(!pause)
				{
					var c = myGameArea.context;
				   	animateId = requestAnimationFrame(animate);
					c.clearRect(0, 0, innerWidth, innerHeight);
					for(var i=0;i<circleArray.length;i++)
					{
						circleArray[i].update();
					}
					myGameArea.canvas.addEventListener("click",function () 
					{
						for(var i=0;i<circleArray.length;i++)
					{
						circleArray[i].remove();

					}
					});
					calculateScore();
					updateArea();
				}
		}
		if((occupied>50 && occupied<97) && !pause)
		{
			time-=1;
		}
		if(startTimer && test)
		{
			stopwatch.start();
			test = false;
		}
		
}



