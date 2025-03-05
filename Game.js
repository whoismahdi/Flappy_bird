let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

let frames = 0;

let sprite = new Image();
sprite.src = "img/sprite.png";

let HIT = new Audio("audio/hit.wav")
let FLAP = new Audio('audio/flap.wav')
let SCORE = new Audio("audio/score.wav")
let DIE = new Audio("audio/die.wav")
let START = new Audio("audio/start.wav")

let state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2,
};

class painting {
  constructor(sX, sY, w, h, x, y, Again = false) {
    this.sX = sX || 0;
    this.sY = sY || 0;
    this.w = w || 0;
    this.h = h || 0;
    this.x = x || 0;
    this.y = y || 0;
    this.draw(Again);
  }
  draw(Again) {
    c.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );

    if (Again == true) {
      c.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x + this.w,
        this.y,
        this.w,
        this.h
      );
    }
  }
  update(Again) {
    this.draw(Again);
  }
}

class bored {
  constructor() {}
  draw() {
    c.beginPath();
    c.fillStyle = "#70c5ce";
    c.fill();
    c.fillRect(0, 0, canvas.width, canvas.height);
  }
  update() {
    this.draw();
  }
}

class birdAnimate {
  constructor(sX, sY, w, h, x, y) {
    this.sX = sX || 0;
    this.sY = sY || 0;
    this.w = w || 0;
    this.h = h || 0;
    this.x = x || 0;
    this.y = y || 0;
    this.draw();
    this.speed = 0;
    this.g = 0.25;
    this.rotate = 0;
  }
  draw() {
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.rotate);
    c.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      -this.w / 2,
      -this.h / 2,
      this.w,
      this.h
    );
    c.restore();
  }
  update() {
    if (frames % 40 == 0) this.sY = 112;
    if (frames % 40 == 10) this.sY = 139;
    if (frames % 40 == 20) this.sY = 164;
    if (frames % 40 == 30) this.sY = 139;
    if (state.current == state.getReady) this.y = 135;
    if (state.current == state.game || state.current == state.over) {
      this.speed += this.g;
      this.y += this.speed;
      if (this.speed < 5) {
        this.rotate = -(Math.PI / 180) * 25;
      } else this.rotate = (Math.PI / 180) * 90;
    }
    if (this.y + this.h / 2 >= canvas.height - fg.h ) {
      if (state.current != state.over) {
        DIE.play()
      }
      state.current = state.over;
      this.y = canvas.height - fg.h - this.h / 2;
      this.sY = 139;
    }
    this.draw();
  }
  flap() {
    this.speed = -4.6
  }
}

class pipes {
  constructor() {
    this.sXT = 553;
    this.sXB = 502;
    this.sY = 0
    this.w = 53
    this.h = 400
    this.dx = 2
    this.gap = 110;
    this.position = [];
    this.maxYpose = -150;
    this.draw();
  }
  draw() {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPose = p.y;
      let bottomYPose = p.y + this.h + this.gap;
      c.drawImage(
        sprite,
        this.sXT,
        this.sY,
        this.w,
        this.h,
        p.x,
        topYPose,
        this.w,
        this.h
      );
      c.drawImage(
        sprite,
        this.sXB,
        this.sY,
        this.w,
        this.h,
        p.x,
        bottomYPose,
        this.w,
        this.h
      );
    }
  }
  update() {
    if (state.current == state.game) {
      if (frames % 100 == 0) {
        this.position.push({
          x: canvas.width,
          y: this.maxYpose * (Math.random() + 1),
        });
      }

      for (let i = 0; i < this.position.length; i++) {
        let p = this.position[i];
        p.x -= this.dx;

        let topYpose = p.y + this.h + this.gap;

        if (p.x + this.w < 0) {
          this.position.shift();
          score.now++
          SCORE.play()
          score.best = Math.max(score.best,score.now)
          localStorage.setItem('score',score.best)
        }

        if (
          bird.x + bird.w / 2 > p.x &&
          bird.x - bird.w / 2 < p.x + this.w &&
          bird.y + bird.h / 2 > p.y &&
          bird.y - bird.h / 2 < p.y + this.h
        ) {
          HIT.play()
          state.current = state.over;
        }
        if (
          bird.x + bird.w / 2 > p.x &&
          bird.x - bird.w / 2 < p.x + this.w &&
          bird.y + bird.h / 2 > topYpose &&
          bird.y - bird.h / 2 < topYpose + this.h
        ) {
          HIT.play()
          state.current = state.over;
        }
      }
    }
    this.draw();
  }
}

class scores {
  constructor() {
    this.best = parseInt(localStorage.getItem('score') || 0)
    this.now = 0;
  }
  draw() {
    if (state.current == state.game) {
      c.lineWidth = 2;
      c.font = "35px IMPACT";
      c.fillStyle = 'white'
      c.fillText(this.now, canvas.width / 2, 50);
      c.strokeText(this.now, canvas.width / 2, 50);
    }
    if (state.current == state.over) {
      c.lineWidth = 2;
      c.font = "30px IMPACT";
      c.fillStyle = 'white'

      c.fillText(this.now, 225, 192);
      c.strokeText(this.now, 225, 192);

      c.fillText(this.best, 225, 234);
      c.strokeText(this.best, 225, 234);
    }
  }
  update(){
    this.draw()
  }
}

function gameHandler() {
  switch (state.current) {
    case state.getReady:
      START.play()
      bird.flap()
      state.current = state.game;
      break;
    case state.game:
      FLAP.play()
      bird.flap();
      break;
    default:
      bird.x = 50
      bird.y = 150
      pipe.position = [];
      frames = 0;
      bird.rotate = 0;
      bird.speed = 0;
      score.now = 0;
      state.current = state.getReady;
      break;
  }
}

document.addEventListener("keypress", (e) => {
  if (e.key == " ") {
    gameHandler();
  }
});

window.addEventListener('touchstart',gameHandler);

let gameBored = new bored();
let bg = new painting(0, 0, 275, 226, 0, canvas.height - 226, true);
let fg = new painting(276, 0, 224, 112, 0, canvas.height - 112, true);
let bird = new birdAnimate(276, 112, 34, 26, 50, 150);
let getReady = new painting(0,228,173,152,canvas.width / 2 - 173 / 2,80,false);
let gameOver = new painting(175,228,225,202,canvas.width / 2 - 225 / 2,93,false);
let pipe = new pipes();
let score = new scores()
animate();
function animate() {
  gameBored.update();
  bg.update(true);
  pipe.update();
  fg.update(true);
  bird.update();
  if (state.current == state.getReady) {
    getReady.update(false);
  }
  if (state.current == state.over) {
    gameOver.update(false);
  }
  if (state.current == state.game) {
    fg.x = (fg.x - 2) % (fg.w / 2);
  }
  score.update()
  frames++;
  requestAnimationFrame(this.animate.bind(this));
}
