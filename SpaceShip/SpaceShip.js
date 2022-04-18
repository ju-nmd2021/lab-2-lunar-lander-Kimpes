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
  x: 100,
  y: 200,
  rotation: 0,
  thrustForce: 0.5,
  collision: false,
  state: "fall",
};

let platform1 = {
  x: 100,
  y: 300,
  width: 200,
};
let platform2 = {
  x: 400,
  y: 300,
  width: 200,
};

let platforms = [platform1, platform2];

let gravity = 0.1;
let friction = 0.9;
let downSpeed = 0;
let sideSpeed = 0;
let gameState = "fail";

//the draw function. It makes things happen
function draw() {
  background(150, 150, 150);
  fireFighterSprite(fireFighter);
  collisionBlock(platform1);
  collisionBlock(platform2);

  if (gameState === "play") {
    if (keyIsDown(32)) {
      sideSpeed -=
        Math.cos(fireFighter.rotation + PI / 2) * fireFighter.thrustForce;
      downSpeed -=
        Math.sin(fireFighter.rotation + PI / 2) * fireFighter.thrustForce;
    }

    //checks collision with all platforms
    let collisionDetection = 0;
    for (let platform of platforms) {
      if (
        fireFighter.y + 10 > platform.y &&
        fireFighter.y < platform.y + 50 &&
        fireFighter.x < platform.x + platform.width / 2 &&
        fireFighter.x > platform.x - platform.width / 2
      ) {
        collisionDetection++;
      }
      if (collisionDetection) {
        fireFighter.collision = true;
      } else {
        fireFighter.collision = false;
      }
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

    if (
      fireFighter.x < -50 ||
      fireFighter.x > width + 50 ||
      fireFighter.y < -50 ||
      fireFighter.y > height + 50
    ) {
      gameState = "fail";
    }
  } else if (gameState === "fail") {
    textAlign(CENTER);
    push();
    textSize(30);
    text("GAME OVER", width / 2, 100);
    pop();

    push();
    text("Press R to play again", width / 2, 500);
    pop();
  }
}

function keyPressed() {
  console.log(keyCode);
  if (keyIsDown(82)) {
    //reset button for testing purposes
    fireFighter.x = 100;
    fireFighter.y = 200;
    fireFighter.rotation = 0;
    downSpeed = 0;
    sideSpeed = 0;
    gameState = "play";
  }
}
