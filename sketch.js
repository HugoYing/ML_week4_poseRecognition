/*
Imagine you are a fish swimming and breathing on the bottom of the sea
*/
/*
How to trigger interaction: Raise your hand and move it in front of the webcam
*/

let handpose;
let video;
let particles = [];
let color1, color2;
let currentColor;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  handpose = ml5.handpose(video, modelReady);
  handpose.on('predict', gotPoses);
  
  color1 = color(30,30,180);
  color2 = color(40,50,220);
  currentColor = color1;
}

function modelReady() {
  console.log('Model loaded');
}

function gotPoses(results) {
  if (results.length > 0) {
    let hand = results[0].landmarks[0];
    let x = map(hand[0], 0, video.width, 0, width);
    let y = map(hand[1], 0, video.height, 0, height);
    particles.push(new Particle(x, y));
  }
}

function draw() {
  background(currentColor);
  currentColor = lerpColor(color1, color2, millis() / 10000 % 1);
  
  //background(0);
  //image(video, 0, 0, width, height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.acc = createVector(0, -0.05);
    this.lifespan = 255;
    this.size = 15;
    this.color = color(random(50,100), random(50,100), random(180,255));
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 5;
    this.size -= 0.2;
    this.color.levels[3] = this.lifespan;
  }

  show() {
    stroke(255);
    fill(this.color,255,this.lifespan);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  isFinished() {
    return this.lifespan <= 0;
  }
}


