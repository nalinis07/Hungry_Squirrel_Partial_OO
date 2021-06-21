//constants
const gameWidth =  800;
const gameHeight =  600;
const mazeColor = "black";
const INTRO=0, START=1, PLAY=2, END=3, WIN=4;
const SQUIRRELMOVE=5;
const MAXLIVES = 3;
const MAXNUTS=35;

var soundPlayedOnce = false;   //NALINI

//variables
var squirrel, squirrelImg, squirrelFlip;
var snake, snakeImg, snakeFlip, snake2, snake3;
var nutImg, gnutImg;
var bgImg;
var gameState=INTRO;
var story, gameStory;
var randNum;
var score=0, lives=MAXLIVES;
var nutGroup, gnutGroup, mazeGroup, mazeGateGroup;
var blackScreen;
var edges;
var collectGnut, collectNuts, snakeBites, loseGame, gameWin;



function preload(){

  //load squirrel image
  squirrelImg=loadImage("assets/images/Squirrel_left.png");
  squirrelFlip=loadImage("assets/images/Squirrel_right.png");

  //load snake image
  snakeImg=loadImage("assets/images/snake2.png");
  snakeFlip=loadImage("assets/images/snakeFlip.png")

  //load nuts images
  nutImg=loadImage("assets/images/nut.png");
  gnutImg=loadImage("assets/images/gnut.png");

  //load bg image
  bgImg=loadImage("assets/images/bg1.png");

  //load story img
  gameStory=loadImage("assets/images/gameStory5.png");

  //load all sounds
  collectGnut=loadSound("assets/sounds/collectGoldenNut.mp3");
  collectNuts=loadSound("assets/sounds/collectNut.mp3");
  snakeBites=loadSound("assets/sounds/snakeBite.mp3");
  loseGame=loadSound("assets/sounds/loseGame.mp3");
  gameWin=loadSound("assets/sounds/gameWin.mp3");

}


function setup() {
  createCanvas(gameWidth, gameHeight);

  mazeGroup = new Group ();
  mazeGateGroup = new Group ();
  //call create maze
  createMainMaze();
  createGateMaze();

  //create group for golden and normal nuts
  nutGroup=new Group();
  gnutGroup=new Group();

  //call create nuts
  createNuts();
  //call create golden nuts
  createGoldenNuts();
      
  //create squirrel sprite and add image
  squirrel=createSprite(753,65,10,10);
  squirrel.addImage("leftImg", squirrelImg);

  //create snakes and add image
  snake=createSprite(55,575,1,1);
  snake.addImage(snakeImg);
  snake.scale=.2;  
  snake2=createSprite(50,55,1,1);
  snake2.addImage(snakeImg);
  snake2.scale=.2; 
  snake3=createSprite(750,575,1,1);
  snake3.addImage(snakeFlip);
  snake3.scale=.2;

  //create story sprite for background
  story=createSprite(410,300,gameWidth,gameHeight);
  story.addImage(gameStory);
  story.scale=.84;

  //create black screen
  blackScreen=createSprite(gameWidth/2,gameHeight/2,gameWidth,gameHeight);
  blackScreen.shapeColor="black";
  blackScreen.visible=false;

}

function draw() {
  background(bgImg);
  
  //show all sprites
  drawSprites();

  if(gameState!=INTRO){

    //display points and lives
    push();
    textSize (15);
    fill(220,30,5);
    stroke(4);
    text ("POINTS : " + score + "            LIVES : " + lives, 300,15);
    pop();

  }


  if (gameState==INTRO){
    

    if(keyDown("N")){

      //hide text and story sprite shown in INTRO state
      story.destroy();
  
      //change to start state
      gameState=START;
  
    }
    
  }


  if (gameState==START){

    //show text to press S key to start playing
    fill(220,30,5);
    textSize(15);
    text ("Press the S key to start", 330,50);

    //when s key is pressed,
    if(keyDown("S")){
      mazeGateGroup.destroyEach ();
      // play game
      gameState=PLAY;

    }

  }


  if(gameState==PLAY){


    edges=createEdgeSprites();

      //if squirrel touches any nut,
      nutGroup.overlap(squirrel, collectNut);
      gnutGroup.overlap(squirrel, collectGoldenNut);

      //if squirrel touches snake,
      snake.overlap(squirrel, snakeBite);
      snake2.overlap(squirrel, snakeBite);
      snake3.overlap(squirrel, snakeBite);
    
    
      //call snake movement functions to make snakes move
      
      snakeMovement();
      snakeTwoMovement();
      snakeThreeMovement();
    
    
      //let squirrel move using arrow key controls
      if(keyDown("UP_ARROW")){
          squirrel.y = squirrel.y-SQUIRRELMOVE;
      }
      if(keyDown("DOWN_ARROW")){
          squirrel.y=squirrel.y+SQUIRRELMOVE;
      }
      if(keyDown("LEFT_ARROW")){
          squirrel.x=squirrel.x-SQUIRRELMOVE;
          squirrel.addImage("LeftImage", squirrelImg);
          squirrel.changeImage("LeftImage"); 
      }
      if(keyDown("RIGHT_ARROW")){
          squirrel.x=squirrel.x+SQUIRRELMOVE;
          squirrel.addImage("RightImage", squirrelFlip); 
          squirrel.changeImage("RightImage");
      }
      
      //make squirrel collide against all walls of the maze and edges 
      squirrelCollide();
    
      //make snakes collide against all walls of the maze and edges 
      snakesCollide();
      

      if (score>=MAXNUTS){

        //change gameState to win
        gameState=WIN;

      }

      if (lives<=0){

        //change gameState to end
        gameState=END; 

      }
      
  }
  

  if (gameState==END){

    //destroy nuts
    nutGroup.destroyEach();
    gnutGroup.destroyEach();

    //make black screen visible
    blackScreen.visible=true;

    //display you lose press r to try again text
    textSize(30);
    text("You Lose! Press R to try again.", 200,300);  

    console.log ("gameState in loose  :" +  gameState);
    
    //play end sound   //NALINI
    if (soundPlayedOnce == false) {
      loseGame.play();
      soundPlayedOnce = true; 
    }

  }
  //NALINI moved the keydown to separate if statement
  if (keyDown ("R") && (gameState == END || gameState == WIN)){
    restart ();
  }
  if(gameState==WIN){

    //destroy nuts
    nutGroup.destroyEach();
    gnutGroup.destroyEach();

    //make black screen visible
    blackScreen.visible=true;

    //display you win text
    textSize(40);
    text("You Win!!!", 320,300);

    //display mini text at bottom that says press r to play again
    textSize(15);
    text("Press R to play again", 350, 590);


    //play win sound   //NALINI
    if (soundPlayedOnce == false) {
      gameWin.play();
      soundPlayedOnce = true;
    }

  }

  

}


function createNuts(){
  var obj;
  //create all 35 nuts
  obj = new Nut (590,60,nutGroup);
  obj = new Nut (670,115,nutGroup);
  obj = new Nut (600,175,nutGroup);
  obj = new Nut (750,175,nutGroup);
  obj = new Nut (750,175,nutGroup);
  obj = new Nut (600,250,nutGroup);
  obj = new Nut (600,350,nutGroup);
  obj = new Nut (700,400,nutGroup);
  obj = new Nut (750,330,nutGroup);
  obj = new Nut (670,520,nutGroup);
  obj = new Nut (550,570,nutGroup);
  obj = new Nut (450,520,nutGroup);
  obj = new Nut (380,450,nutGroup);
  obj = new Nut (280,500,nutGroup);
  obj = new Nut (350,570,nutGroup);
  obj = new Nut (180,510,nutGroup);
  obj = new Nut (50,490,nutGroup);
  obj = new Nut (30,390,nutGroup);
  obj = new Nut (180,390,nutGroup);
  obj = new Nut (300,350,nutGroup);
  obj = new Nut (150,305,nutGroup);
  obj = new Nut (670,520,nutGroup);
  obj = new Nut (80,120,nutGroup);
  obj = new Nut (320,240,nutGroup);
  obj = new Nut (400,290,nutGroup);
  obj = new Nut (440,180,nutGroup);
  obj = new Nut (500,320,nutGroup);
  obj = new Nut (520,120,nutGroup);
  obj = new Nut (400,90,nutGroup);
  obj = new Nut (300,50,nutGroup);
  obj = new Nut (230,150,nutGroup);
  obj = new Nut (170,60,nutGroup);
  obj = new Nut (40,250,nutGroup);
  obj = new Nut (90,180,nutGroup);
  obj = new Nut (220,260,nutGroup);
  obj = new Nut (500,430,nutGroup);
  
}

function createGoldenNuts(){

  //create all 5 golden nuts
  var obj ;
  obj = new GNut (730,230, gnutGroup);
  obj = new GNut (430,375, gnutGroup);
  obj = new GNut (50,320, gnutGroup);
  obj = new GNut (510,60, gnutGroup);
  obj = new GNut (220,570, gnutGroup);
  
}

function createGateMaze(){
  // gate maze pieces
  var obj ; 
  obj = new Maze (30,550,170,7,"gray", mazeGateGroup);
  obj = new Maze (115,575,7,57,"gray", mazeGateGroup);
  obj = new Maze (765,105,110,7,"gray", mazeGateGroup);
  obj = new Maze (710,68.5,7,80,"gray", mazeGateGroup);
  obj = new Maze (110,53.5,7,60,"gray", mazeGateGroup);
  obj = new Maze (25,80,170,7,"gray", mazeGateGroup);
  obj = new Maze (700,575,7,70,"gray", mazeGateGroup);
  obj = new Maze (750,550,95,7,"gray", mazeGateGroup);
}

function createMainMaze () {
  var obj;
  // main maze
  obj = new Maze (350,230,7,180, mazeColor, mazeGroup);
  obj =  new Maze (350,140,90,7,mazeColor, mazeGroup);
  obj =  new Maze (290,210,120,7,mazeColor, mazeGroup);
  obj =  new Maze (20,345,350,7,mazeColor, mazeGroup);
  obj =  new Maze (70,345,7,105,mazeColor, mazeGroup);
  obj =  new Maze (250,470,145,7,mazeColor, mazeGroup);
  obj =  new Maze (250,480,7,85,mazeColor, mazeGroup);
  obj =  new Maze (120,175,7,85,mazeColor, mazeGroup);
  obj =  new Maze (90,155,120,7,mazeColor, mazeGroup);
  obj =  new Maze (570,175,7,305,mazeColor, mazeGroup);
  obj =  new Maze (550,100,150,7,mazeColor, mazeGroup);
  obj =  new Maze (460,270,7,160,mazeColor, mazeGroup);
  obj =  new Maze (480,400,230,7,mazeColor, mazeGroup);
  obj =  new Maze (780,200,270,7,mazeColor, mazeGroup);
  obj =  new Maze (700,200,7,105,mazeColor, mazeGroup);
  obj =  new Maze (690,330,50,7,mazeColor, mazeGroup);
  obj =  new Maze (650,550,105,7,mazeColor, mazeGroup);
  obj =  new Maze (700,500,7,105,mazeColor, mazeGroup);
  obj =  new Maze (580,480,60,7,mazeColor, mazeGroup);
  obj =  new Maze (400,565,7,75,mazeColor, mazeGroup);
  obj =  new Maze (240,70,7,50,mazeColor, mazeGroup);
  obj =  new Maze (240,70,50,7,mazeColor, mazeGroup);
  obj =  new Maze (400,24,800,10,mazeColor, mazeGroup);
  obj =  new Maze (400,597,800,10,mazeColor, mazeGroup);
  obj =  new Maze (797,320,10,600,mazeColor, mazeGroup);
  obj =  new Maze (3,320,10,600,mazeColor, mazeGroup);

}


function snakeMovement(){

  if (frameCount%200==0){

    //assign random number movements
    randNum=round(random(1,4));

    //switch case
    switch (randNum){

      //let snake move left
      case 1 : snake.velocityX=-5; snake.velocityY=2; snake.addImage(snakeFlip);
      break;

      //let snake move right
      case 2 : snake.velocityX=5; snake.velocityY=2; snake.addImage(snakeImg);
      break;

      //let snake move down
      case 3 : snake.velocityY=5; snake.velocityX=2;
      break;

      //let snake move up
      case 4 : snake.velocityY=-5; snake.velocityX=2;
      break;

      default : break ;

    }
  }
}

function snakeTwoMovement(){

  if (frameCount%200==0){

    //assign random number movements
    randNum=round(random(1,4));

    //switch case
    switch (randNum){

      //let snake move left
      case 1 : snake2.velocityX=-4; snake2.velocityY=2; snake.addImage(snakeFlip);
      break;

      //let snake move right
      case 2 : snake2.velocityX=4; snake2.velocityY=2; snake.addImage(snakeImg);
      break;

      //let snake move down
      case 3 : snake2.velocityY=4; snake2.velocityX=2;
      break;

      //let snake move up
      case 4 : snake2.velocityY=-4; snake2.velocityX=2;
      break;

      default : break ;

    }
  }
}

function snakeThreeMovement(){

  if (frameCount%200==0){

    //assign random number movements
    randNum=round(random(1,4));

    //switch case
    switch (randNum){

      //let snake move left
      case 1 : snake3.velocityX=-5; snake3.velocityY=3; snake.addImage(snakeFlip);
      break;

      //let snake move right
      case 2 : snake3.velocityX=5; snake3.velocityY=3; snake.addImage(snakeImg);
      break;

      //let snake move down
      case 3 : snake3.velocityY=5; snake3.velocityX=3;
      break;

      //let snake move up
      case 4 : snake3.velocityY=-5; snake3.velocityX=3;
      break;

      default : break ;

    }
  }
}


//when squirrel touches any normal nut,
function collectNut (nutSprite, squirrel) {

  //destroy nut
  nutGroup.remove (nutSprite);
  nutSprite.destroy ();

  //increment score
  score++;

  //play collect nut sound
  collectNuts.play();

}


//when squirrel touches any golden nut,
function collectGoldenNut (gnutSprite, squirrel) {
  
  //destroy golden nut
  gnutGroup.remove (gnutSprite);
  gnutSprite.destroy ();

  //increment score and lives 
  score++;
  lives++;

  //play collect golden nut sound
  collectGnut.play();

}

//when snake touches/bites squirrel
function snakeBite(sn, sq){

  //if there is a life left,
  if (lives >= 1) {

    //dedcut life 
    lives--; 
    
    //squirrel.setCollider ("circle", 0,0,10);
  }  
  else {
    //else, change gameState to END 
    gameState = END;
  }

  //move squirrel back to beginning position
  squirrel.x=753;
  squirrel.y=65;

  //play snake bite sound
  snakeBites.play();
 
}


function restart(){


  //reset gameState to start
  gameState=START;
  

  soundPlayedOnce = false;  //NALINI
  

  //move squirrel back to beginning position
  squirrel.x=753;
  squirrel.y=65;

  //reset lives and score
  lives=MAXLIVES;
  score=0;

  //reset snake's position
  snake.x=55;
  snake.y=575;
  snake2.x=50;
  snake2.y=55;
  snake3.x=750;
  snake3.y=575;

  //reset snake velocity to zero
  snake.velocityX=0;
  snake.velocityY=0;
  snake2.velocityX=0;
  snake2.velocityY=0;
  snake3.velocityX=0;
  snake3.velocityY=0;

  //make blackScreen invisible again
  blackScreen.visible=false;

  //recreate maze 3,4,5,6,8,32
  createGateMaze ();

  //destroy all nuts and reset them
  nutGroup.destroyEach();
  gnutGroup.destroyEach();
  createNuts();
  createGoldenNuts();

 
}





function squirrelCollide(){
  //make squirrel collide against all walls of the maze and edges 
  squirrel.collide (mazeGroup);
  squirrel.collide(edges);

}

function snakesCollide(){

  snake.bounceOff (mazeGroup) ;
  snake.collide(snake2);
  snake.collide(snake3);
  snake.bounceOff(edges);

  snake2.bounceOff (mazeGroup) ;
  snake2.collide(snake);
  snake2.collide(snake3);
  snake2.bounceOff(edges);

  snake3.bounceOff (mazeGroup) ;
  snake3.collide(snake);
  snake3.collide(snake2);
  snake3.bounceOff(edges);
}

