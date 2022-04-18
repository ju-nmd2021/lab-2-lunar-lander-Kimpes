//the sprite for the main character
function fireFighterSprite(object) {
  push();
  translate(object.x, object.y);
  rotate(object.rotation);

  //stick figure
  if (object.state != "stand") {
    push();
    strokeWeight(0);
    fill(0, 0, 0);
    circle(-5, -30, 20);

    strokeWeight(6);
    noFill();
    bezier(10, 0, 20, 0, 20, -20, -10, -30); //right arm
    bezier(-30, 0, -30, -10, -30, -15, -10, -30); //left arm
    bezier(-10, -30, -15, -40, -30, -35, -35, -25); //body
    line(-35, -25, 0, -13); //right leg
    line(-35, -25, -50, -5); //left leg
    pop();

    fireExtinguisher();

    pop();
  } else {
    push();
    strokeWeight(0);
    fill(0, 0, 0);
    circle(-25, -60, 20);

    strokeWeight(6);
    noFill();
    bezier(15, -50, 5, -40, -10, -40, -30, -50); //right arm
    bezier(5, -10, 5, -10, -30, -40, -30, -50); //left arm
    bezier(-35, -35, -35, -40, -35, -50, -25, -60); //body
    line(-35, -35, -15, 0); //right leg
    line(-35, -35, -35, 0); //left leg
    pop();

    push();
    translate(10, -30);
    rotate(-1.3);
    fireExtinguisher();
    pop();

    pop();
  }
}

function fireExtinguisher() {
  //fire extinguisher body
  strokeWeight(0);
  translate(-10, 0);
  fill(255, 0, 0);
  rect(-25, -10, 50, 20);
  circle(25, 0, 20);

  //muzzle
  push();
  translate(10, 8);
  fill(150, 0, 0);
  triangle(0, 0, -5, 10, 5, 10);
  pop();

  push();
  stroke(150, 0, 0);
  strokeWeight(4);
  line(33, 5, 34, -10);
  line(33, 5, 40, -8);
  pop();
}

//sprite for collision platform
function collisionBlock(object) {
  push();
  translate(object.x, object.y);
  fill(100, 100, 100);
  strokeWeight(0);
  rect(-object.width / 2, 0, object.width, 20);
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
let gameState = "play";

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
        fireFighter.y < platform.y + 20 &&
        fireFighter.x < platform.x + platform.width / 2 &&
        fireFighter.x > platform.x - platform.width / 2
      ) {
        collisionDetection++;
      }
      if (collisionDetection) {
        fireFighter.state = "stand";
      } else {
        fireFighter.state = "fall";
      }
    }

    //if collision is false then you're just flying normally
    if (fireFighter.state === "fall") {
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
