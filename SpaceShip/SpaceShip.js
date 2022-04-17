function fireFighterSprite(object) {
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
}

//variables for gameplay
let fireFighter = {
  x: width / 2,
  y: 100,
  rotation: 0,
};

let fallAcceleration = 0.1;
let fallSpeed = 0;

let thrustAcceleration = 0.2;
let thrustSpeed = 0;
let gameState = "play";

//the draw function. It makes things happen
function draw() {
  background(150, 150, 150);
  fireFighterSprite(fireFighter);

  if (gameState === "play") {
    if (keyIsDown(32)) {
      thrustSpeed -= 3 * thrustAcceleration;
      fireFighter.x += Math.cos(fireFighter.rotation) * thrustSpeed;
      fireFighter.y += Math.sin(fireFighter.rotation) * thrustSpeed;
    }

    if (keyIsDown(68)) {
      fireFighter.rotation += 0.1;
    } else if (keyIsDown(65)) {
      fireFighter.rotation -= 0.1;
    }

    fallSpeed += fallAcceleration;
    fireFighter.y += fallSpeed;

    //solution inspired by Garrit's lecture on car rotation
  }
}

function keyPressed() {
  console.log(keyCode);
  if (keyIsDown(82)) {
    //reset button for testing purposes
    fireFighter.x = width / 2;
    fireFighter.y = 100;
    fireFighter.rotation = 0;
    fallSpeed = 0;
    gameState = "play";
  }
}
