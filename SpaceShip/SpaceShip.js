function extinguisherMan(x, y, rotation) {
  translate(x, y);
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
let extinguisherX = width / 2;
let extinguisherY = 100;
let extinguisherRotation = 0;
let gravity = 0.2;
let speed = 0;
let gameState = "play";

//the draw function. It makes things happen
function draw() {
  background(150, 150, 150);
  extinguisherMan(extinguisherX, extinguisherY);

  if (gameState === "play") {
    if (keyIsDown(32)) {
      speed -= gravity;
      extinguisherY += speed;
    } else {
      speed += gravity;
      extinguisherY += speed;
    }
  }
}

function keyPressed() {
  console.log(keyCode);
  if (keyIsDown(82)) {
    //reset button for testing purposes
    extinguisherX = width / 2;
    extinguisherY = 100;
    extinguisherRotation = 0;
    speed = 0;
    gameState = "play";
  }
}
