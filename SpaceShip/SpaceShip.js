function thrustCloud() {
  push();
  stroke(255, 255, 255);
  strokeWeight(5);
  translate(-20, 0);

  line(
    20,
    0,
    Math.floor(Math.random() * 40),
    100 + Math.floor(Math.random() * 10)
  );
  circle(
    Math.floor(Math.random() * 40),
    Math.floor(Math.random() * 10) + 100,
    Math.floor(Math.random() * 40)
  );
  pop();
}

//the sprite for the main character
function fireFighterSprite(object) {
  push();
  translate(object.x, object.y);
  rotate(object.rotation);
  scale(0.7);

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

    if (object.state === "thrust") {
      for (let i = 0; i < 4; i++) {
        thrustCloud();
      }
    }
    fireExtinguisher();

    pop();
  } else {
    //if fire fighter has landed
    push();
    translate(0, 10);
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
    translate(10, -23);
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
  translate(10, 6);
  scale(1.5);
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
  if (object.goal) {
    fill(200, 100, 100);
  }
  strokeWeight(0);
  rect(-object.width / 2, 0, object.width, height - object.y);
  pop();
}

//variables for gameplay
let fireFighter = {
  x: 100,
  y: 300,
  rotation: 0,
  thrustForce: 0.5,
  state: "stand",
  fuel: 100,
};

let startingPlatform = {
  x: 100,
  y: 300,
  width: 100,
  goal: false,
};
// let platformEasyGoal = {
//   x: 320,
//   y: 300,
//   width: 100,
//   goal: true,
// };
// let platformHardGoal = {
//   x: 500,
//   y: 400,
//   width: 50,
//   goal: true,
// };

let platforms = [startingPlatform];

let gravity = 0.2;
let friction = 0.9;
let downSpeed = 0;
let sideSpeed = 0;
let subTimer = 0;
let timer = 10;
let gameState = "start";
let multiplier = 1;

//the draw function. It makes things happen
function draw() {
  background(150, 200, 250);

  if (gameState === "start") {
    //start screen
    textAlign(CENTER);
    push();
    fill(200, 50, 50);
    textSize(30);
    text(
      "Lenny Fire Fighter's Last Leap of Luck The Game",
      width / 2 - 275,
      100,
      550
    );
    pop();

    push();
    textSize(18);
    text(
      "Land on burning buildings as quickly and safely as possible for a higher score",
      width / 2 - 125,
      200,
      250
    );
    pop();

    push();
    translate(0, 150);
    text("Press SPACEBAR to thrust", width / 2, 200);
    text("Press A & D to steer", width / 2, 220);
    text("Press R to start (and restart)", width / 2, 240);
    pop();
  } else {
    //not the start screen
    fireFighterSprite(fireFighter);

    for (let platform of platforms) {
      collisionBlock(platform);
    }

    push();
    fill(0, 0, 0);
    textSize(30);
    text("fuel: " + fireFighter.fuel, 80, 40);
    pop();

    push();
    fill(0, 0, 0);
    textSize(30);
    text("time left: " + timer + "s", width - 120, 40);
    pop();

    //victory screen!
    if (gameState === "win") {
      textAlign(CENTER);
      push();
      fill(200, 50, 50);
      textSize(30);
      text("Success!", width / 2 - 275, 100, 550);

      fill(0, 150, 0);
      textSize(20);
      text(
        "Score: " +
          Math.floor((fireFighter.fuel / 10) * (timer * 10) * multiplier),
        width / 2 - 275,
        130,
        550
      );
      pop();
    }

    //actual gameplay state
    if (gameState === "play") {
      subTimer++;
      if (subTimer % 30 === 0) {
        timer--;
        if (timer === 0) {
          gameState = "fail";
        }
      }

      //checks collision with all platforms
      let collisionDetection = 0;
      for (let platform of platforms) {
        if (
          //checks if you've collided
          fireFighter.y + 10 > platform.y &&
          fireFighter.x < platform.x + platform.width / 2 &&
          fireFighter.x > platform.x - platform.width / 2
        ) {
          //checks if the collision was fatal
          if (
            fireFighter.rotation <= 1.5 &&
            fireFighter.rotation >= -1.5 &&
            downSpeed <= 5 &&
            fireFighter.y < platform.y + 10
          ) {
            if (platform.goal === true && sideSpeed === 0) {
              multiplier = 1 / (platform.width / 100);
              gameState = "win";
            }
            collisionDetection++;
          } else {
            gameState = "fail";
          }
        }
        if (collisionDetection >= 1) {
          if (fireFighter.state !== "stand") {
            fireFighter.y = platform.y - 9;
          }
          fireFighter.state = "stand";
        } else {
          fireFighter.state = "fall";
        }
      }

      if (keyIsDown(32) && fireFighter.fuel > 0) {
        sideSpeed -=
          Math.cos(fireFighter.rotation + PI / 2) * fireFighter.thrustForce;
        downSpeed -=
          Math.sin(fireFighter.rotation + PI / 2) * fireFighter.thrustForce;
        fireFighter.state = "thrust";

        fireFighter.fuel--;
      }

      //if collision is false then you're just flying normally
      if (fireFighter.state !== "stand") {
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
      text("Press R to return to main menu", width / 2, 500);
      pop();
    }
  }
}

function keyPressed() {
  console.log(keyCode);
  if (keyIsDown(82)) {
    //reset button for testing purposes
    fireFighter.x = 100;
    fireFighter.y = 292;
    fireFighter.rotation = 0;
    downSpeed = 0;
    sideSpeed = 0;
    fireFighter.fuel = 100;
    timer = 10;
    subTimer = 0;

    seedX = startingPlatform.width;
    seedY = 0;
    seedWidth = 0;

    if (gameState === "start") {
      platforms.splice(1, 2);
      for (let i = 0; i < 2; i++) {
        seedX += Math.floor(Math.random() * 200 + 100);
        seedY = Math.floor(Math.random() * 400 + 100);
        seedWidth = Math.floor(Math.random() * 50 + 50);

        platforms.push({
          x: seedX,
          y: seedY,
          width: seedWidth,
          goal: true,
        });
      }
      gameState = "play";
    } else {
      gameState = "start";
    }
  }
}
