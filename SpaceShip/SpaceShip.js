//the sprite for the main character
function fireFighterSprite(object) {
  push();
  translate(object.x, object.y);
  rotate(object.rotation);
  strokeWeight(0);

  //fire extinguisher body
  fill(255, 0, 0);
  rect(-25, -10, 50, 20);
  circle(25, 0, 20);

  //muzzle
  push();
  translate(15, 8);
  fill(0, 0, 0);
  triangle(0, 0, -5, 10, 5, 10);
  pop();
  pop();
}

//sprite for collision platform
function collisionBlock(object) {
  push();
  translate(object.x, object.y);
  fill(100, 100, 100);
  strokeWeight(0);

  rect(-object.width / 2, 0, object.width, 50);
  pop();
}

//variables for gameplay
let fireFighter = {
  x: width / 2,
  y: 100,
  rotation: 0,
  thrustForce: 0.5,
  collision: false,
};

let platform1 = {
  x: width / 2,
  y: 300,
  width: 200,
};

let gravity = 0.1;
let friction = 0.9;
let downSpeed = 0;
let sideSpeed = 0;
let gameState = "play";

//the draw function. It makes things happen
function draw() {
  background(150, 150, 150);
  fireFighterSprite(fireFighter);
  collisionBlock(platform1);

  if (gameState === "play") {
    if (keyIsDown(32)) {
      sideSpeed -=
        Math.cos(fireFighter.rotation + PI / 2) * fireFighter.thrustForce;
      downSpeed -=
        Math.sin(fireFighter.rotation + PI / 2) * fireFighter.thrustForce;
    }

    //checks collision with platform1
    if (
      fireFighter.y + 10 > platform1.y &&
      fireFighter.y < platform1.y + 50 &&
      fireFighter.x < platform1.x + platform1.width / 2 &&
      fireFighter.x > platform1.x - platform1.width / 2
    ) {
      fireFighter.collision = true; //TODO: convert to for loop
    } else {
      fireFighter.collision = false;
    }

    //if collision is false then you're just flying normally
    if (fireFighter.collision === false) {
      if (keyIsDown(68)) {
        fireFighter.rotation += 0.1;
      } else if (keyIsDown(65)) {
        fireFighter.rotation -= 0.1;
      }
      downSpeed += gravity;

      //if collision true then you've landed on something
    } else {
      //can't keep falling if collided
      if (downSpeed > 0) {
        downSpeed = 0;
      }
      //resets rotation upon landing
      if (fireFighter.rotation != 0) {
        fireFighter.rotation = 0;
      }

      //slows down horizontal movement when landed, to simulate friction
      if (sideSpeed > 0.3 || sideSpeed < -0.3) {
        sideSpeed *= friction;
      } else {
        sideSpeed = 0;
      }
    }
    fireFighter.y += downSpeed;
    fireFighter.x += sideSpeed;
  }
}

function keyPressed() {
  console.log(keyCode);
  if (keyIsDown(82)) {
    //reset button for testing purposes
    fireFighter.x = width / 2;
    fireFighter.y = 100;
    fireFighter.rotation = 0;
    downSpeed = 0;
    sideSpeed = 0;
    gameState = "play";
  }
}
