// Global variables needed for text animation
let w, h, ctx, hw, hh;
let c = document.getElementById('c');
let letters = [];
let isAnimationComplete = false;
let animationStarted = false;

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', initializeAll);

function initializeAll() {
  // First, get the canvas and initialize context
  c = document.getElementById('c');
  if (!c) return;  // Exit if canvas not found

  // Initialize canvas and context
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  ctx = c.getContext('2d');
  hw = w / 2;
  hh = h / 2;
  
  // Set the font before creating letters
  ctx.font = opts.charSize + "px Verdana";
  
  // Initialize letters
  initializeLetters();

  // Create navigation button (but keep it hidden)
  createNavigationButton();

  // Only start animation sequence if it hasn't started yet
  if (!animationStarted) {
    animationStarted = true;
    startAnimationSequence();
  }
}

function createNavigationButton() {
  // Remove existing button if it exists
  const existingButton = document.getElementById('nextButton');
  if (existingButton) {
    existingButton.remove();
  }

  const navButton = document.createElement('button');
  navButton.id = 'nextButton';
  
  // Style the button container
  navButton.style.position = 'fixed';
  navButton.style.bottom = '20px';
  navButton.style.left = '50%';
  navButton.style.transform = 'translateX(-50%)';
  navButton.style.padding = '10px 20px';
  navButton.style.fontSize = '16px';
  navButton.style.display = 'none';
  navButton.style.cursor = 'pointer';
  navButton.style.backgroundColor = 'transparent';
  navButton.style.border = '2px solid #000';
  navButton.style.borderRadius = '5px';
  navButton.style.zIndex = '1000';

  // Add button text
  navButton.textContent = 'Next Page';
  
  // Create stars container
  const stars = document.createElement('div');
  stars.className = 'stars';
  stars.style.position = 'absolute';
  stars.style.width = '100%';
  stars.style.height = '100%';
  stars.style.pointerEvents = 'none';
  
  // Define star positions
  const positions = [
    { top: '-15px', left: '-15px' },
    { top: '-15px', right: '-15px' },
    { bottom: '-15px', left: '-15px' },
    { bottom: '-15px', right: '-15px' },
    { top: '50%', left: '-15px', transform: 'translateY(-50%)' },
    { top: '50%', right: '-15px', transform: 'translateY(-50%)' }
  ];

  // Create stars
  positions.forEach((pos, index) => {
    const star = document.createElement('span');
    star.textContent = '🌟';
    star.style.position = 'absolute';
    Object.entries(pos).forEach(([key, value]) => {
      star.style[key] = value;
    });
    star.style.opacity = '0';
    star.style.transition = 'opacity 0.3s ease';
    star.style.animation = `sparkle 1.5s infinite alternate ${index * 0.2}s`;
    star.style.color = 'cyan';
    star.style.fontSize = '20px';
    star.style.pointerEvents = 'none';
    stars.appendChild(star);
  });

  // Add stars to button
  navButton.appendChild(stars);
  
  // Add to document
  document.body.appendChild(navButton);

  // Add click event listener
  navButton.addEventListener('click', (e) => {
    e.preventDefault();  // Prevent any default behavior
    e.stopPropagation(); // Stop event bubbling
    window.location.href = 'sec.html';
  });

  return navButton;
}

function startAnimationSequence() {
  // Start flower animation
  setTimeout(() => {
    document.body.classList.remove('not-loaded');
  }, 1000);

  // Start birthday animation
  setTimeout(() => {
    if (c) {
      c.style.display = 'block';
      if (!isAnimationComplete) {
        anim();
      }
    }
  }, 5800);

  // Show navigation button
  setTimeout(() => {
    const navButton = document.getElementById('nextButton');
    if (navButton) {
      navButton.style.display = 'flex';
      isAnimationComplete = true;
    }
  }, 18000);
}

function initializeLetters() {
  letters = []; // Clear existing letters
  for (let i = 0; i < opts.strings.length; ++i) {
    for (let j = 0; j < opts.strings[i].length; ++j) {
      letters.push(
        new Letter(
          opts.strings[i][j],
          j * opts.charSpacing + opts.charSpacing / 2 - (opts.strings[i].length * opts.charSize) / 2,
          i * opts.lineHeight + opts.lineHeight / 2 - (opts.strings.length * opts.lineHeight) / 2
        )
      );
    }
  }
}

// Window resize handler
window.addEventListener("resize", () => {
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  hw = w / 2;
  hh = h / 2;
  ctx.font = opts.charSize + "px Verdana";
});


// Animation options
const opts = {
  strings: ["HAPPY", "BIRTHDAY!", "to You"],
  charSize: 30,
  charSpacing: 35,
  lineHeight: 40,

  cx: w / 2,
  cy: h / 2,

  fireworkPrevPoints: 100,
  fireworkBaseLineWidth: 5,
  fireworkAddedLineWidth: 8,
  fireworkSpawnTime: 200,
  fireworkBaseReachTime: 30,
  fireworkAddedReachTime: 30,
  fireworkCircleBaseSize: 20,
  fireworkCircleAddedSize: 10,
  fireworkCircleBaseTime: 30,
  fireworkCircleAddedTime: 30,
  fireworkCircleFadeBaseTime: 10,
  fireworkCircleFadeAddedTime: 5,
  fireworkBaseShards: 5,
  fireworkAddedShards: 5,
  fireworkShardPrevPoints: 3,
  fireworkShardBaseVel: 4,
  fireworkShardAddedVel: 2,
  fireworkShardBaseSize: 3,
  fireworkShardAddedSize: 3,
  gravity: 0.1,
  upFlow: -0.1,
  letterContemplatingWaitTime: 360,
  balloonSpawnTime: 20,
  balloonBaseInflateTime: 10,
  balloonAddedInflateTime: 10,
  balloonBaseSize: 20,
  balloonAddedSize: 20,
  balloonBaseVel: 0.4,
  balloonAddedVel: 0.4,
  balloonBaseRadian: -(Math.PI / 2 - 0.5),
  balloonAddedRadian: -1,
};

const calc = {
  totalWidth:
    opts.charSpacing *
    Math.max(opts.strings[0].length, opts.strings[1].length),
};

const Tau = Math.PI * 2;
const TauQuarter = Tau / 4;

// Letter constructor and prototype methods
function Letter(char, x, y) {
  this.char = char;
  this.x = x;
  this.y = y;

  this.dx = -ctx.measureText(char).width / 2;
  this.dy = +opts.charSize / 2;

  this.fireworkDy = this.y - hh;

  var hue = (x / calc.totalWidth) * 360;

  this.color = "hsl(hue,80%,50%)".replace("hue", hue);
  this.lightAlphaColor = "hsla(hue,80%,light%,alp)".replace("hue", hue);
  this.lightColor = "hsl(hue,80%,light%)".replace("hue", hue);
  this.alphaColor = "hsla(hue,80%,50%,alp)".replace("hue", hue);

  this.reset();
}

Letter.prototype.reset = function () {
  this.phase = "firework";
  this.tick = 0;
  this.spawned = false;
  this.spawningTime = (opts.fireworkSpawnTime * Math.random()) | 0;
  this.reachTime =
    (opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random()) |
    0;
  this.lineWidth =
    opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
  this.prevPoints = [[0, hh, 0]];
};

Letter.prototype.step = function () {
  if (this.phase === "firework") {
    if (!this.spawned) {
      ++this.tick;
      if (this.tick >= this.spawningTime) {
        this.tick = 0;
        this.spawned = true;
      }
    } else {
      ++this.tick;

      var linearProportion = this.tick / this.reachTime,
        armonicProportion = Math.sin(linearProportion * TauQuarter),
        x = linearProportion * this.x,
        y = hh + armonicProportion * this.fireworkDy;

      if (this.prevPoints.length > opts.fireworkPrevPoints)
        this.prevPoints.shift();

      this.prevPoints.push([x, y, linearProportion * this.lineWidth]);

      var lineWidthProportion = 1 / (this.prevPoints.length - 1);

      for (var i = 1; i < this.prevPoints.length; ++i) {
        var point = this.prevPoints[i],
          point2 = this.prevPoints[i - 1];

        ctx.strokeStyle = this.alphaColor.replace(
          "alp",
          i / this.prevPoints.length
        );
        ctx.lineWidth = point[2] * lineWidthProportion * i;
        ctx.beginPath();
        ctx.moveTo(point[0], point[1]);
        ctx.lineTo(point2[0], point2[1]);
        ctx.stroke();
      }

      if (this.tick >= this.reachTime) {
        this.phase = "contemplate";

        this.circleFinalSize =
          opts.fireworkCircleBaseSize +
          opts.fireworkCircleAddedSize * Math.random();
        this.circleCompleteTime =
          (opts.fireworkCircleBaseTime +
            opts.fireworkCircleAddedTime * Math.random()) |
          0;
        this.circleCreating = true;
        this.circleFading = false;

        this.circleFadeTime =
          (opts.fireworkCircleFadeBaseTime +
            opts.fireworkCircleFadeAddedTime * Math.random()) |
          0;
        this.tick = 0;
        this.tick2 = 0;

        this.shards = [];

        var shardCount =
            (opts.fireworkBaseShards +
              opts.fireworkAddedShards * Math.random()) |
            0,
          angle = Tau / shardCount,
          cos = Math.cos(angle),
          sin = Math.sin(angle),
          x = 1,
          y = 0;

        for (var i = 0; i < shardCount; ++i) {
          var x1 = x;
          x = x * cos - y * sin;
          y = y * cos + x1 * sin;

          this.shards.push(new Shard(this.x, this.y, x, y, this.alphaColor));
        }
      }
    }
  } else if (this.phase === "contemplate") {
    ++this.tick;

    if (this.circleCreating) {
      ++this.tick2;
      var proportion = this.tick2 / this.circleCompleteTime,
        armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

      ctx.beginPath();
      ctx.fillStyle = this.lightAlphaColor
        .replace("light", 50 + 50 * proportion)
        .replace("alp", proportion);
      ctx.beginPath();
      ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau);
      ctx.fill();

      if (this.tick2 > this.circleCompleteTime) {
        this.tick2 = 0;
        this.circleCreating = false;
        this.circleFading = true;
      }
    } else if (this.circleFading) {
      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

      ++this.tick2;
      var proportion = this.tick2 / this.circleFadeTime,
        armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

      ctx.beginPath();
      ctx.fillStyle = this.lightAlphaColor
        .replace("light", 100)
        .replace("alp", 1 - armonic);
      ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau);
      ctx.fill();

      if (this.tick2 >= this.circleFadeTime) this.circleFading = false;
    } else {
      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
    }

    for (var i = 0; i < this.shards.length; ++i) {
      this.shards[i].step();

      if (!this.shards[i].alive) {
        this.shards.splice(i, 1);
        --i;
      }
    }

    if (this.tick > opts.letterContemplatingWaitTime) {
      this.phase = "balloon";

      this.tick = 0;
      this.spawning = true;
      this.spawnTime = (opts.balloonSpawnTime * Math.random()) | 0;
      this.inflating = false;
      this.inflateTime =
        (opts.balloonBaseInflateTime +
          opts.balloonAddedInflateTime * Math.random()) |
        0;
      this.size =
        (opts.balloonBaseSize + opts.balloonAddedSize * Math.random()) | 0;

      var rad =
          opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
        vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();

      this.vx = Math.cos(rad) * vel;
      this.vy = Math.sin(rad) * vel;
    }
  } else if (this.phase === "balloon") {
    ctx.strokeStyle = this.lightColor.replace("light", 80);

    if (this.spawning) {
      ++this.tick;
      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

      if (this.tick >= this.spawnTime) {
        this.tick = 0;
        this.spawning = false;
        this.inflating = true;
      }
    } else if (this.inflating) {
      ++this.tick;

      var proportion = this.tick / this.inflateTime,
        x = (this.cx = this.x),
        y = (this.cy = this.y - this.size * proportion);

      ctx.fillStyle = this.alphaColor.replace("alp", proportion);
      ctx.beginPath();
      generateBalloonPath(x, y, this.size * proportion);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, this.y);
      ctx.stroke();

      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

      if (this.tick >= this.inflateTime) {
        this.tick = 0;
        this.inflating = false;
      }
    } else {
      this.cx += this.vx;
      this.cy += this.vy += opts.upFlow;

      ctx.fillStyle = this.color;
      ctx.beginPath();
      generateBalloonPath(this.cx, this.cy, this.size);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(this.cx, this.cy);
      ctx.lineTo(this.cx, this.cy + this.size);
      ctx.stroke();

      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(
        this.char,
        this.cx + this.dx,
        this.cy + this.dy + this.size
      );

      if (this.cy + this.size < -hh || this.cx < -hw || this.cy > hw)
        this.phase = "done";
    }
  }
};

// Shard constructor and methods
function Shard(x, y, vx, vy, color) {
  var vel =
    opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();

  this.vx = vx * vel;
  this.vy = vy * vel;

  this.x = x;
  this.y = y;

  this.prevPoints = [[x, y]];
  this.color = color;

  this.alive = true;

  this.size =
    opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
}

Shard.prototype.step = function () {
  this.x += this.vx;
  this.y += this.vy += opts.gravity;

  if (this.prevPoints.length > opts.fireworkShardPrevPoints)
    this.prevPoints.shift();

  this.prevPoints.push([this.x, this.y]);

  var lineWidthProportion = this.size / this.prevPoints.length;

  for (var k = 0; k < this.prevPoints.length - 1; ++k) {
    var point = this.prevPoints[k],
      point2 = this.prevPoints[k + 1];

    ctx.strokeStyle = this.color.replace("alp", k / this.prevPoints.length);
      ctx.lineWidth = k * lineWidthProportion;
      ctx.beginPath();
      ctx.moveTo(point[0], point[1]);
      ctx.lineTo(point2[0], point2[1]);
      ctx.stroke();
    }
  
    if (this.prevPoints[0][1] > hh) this.alive = false;
  };
  function generateBalloonPath(x, y, size) {
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
      x - size / 2,
      y - size / 2,
      x - size / 4,
      y - size,
      x,
      y - size
    );
    ctx.bezierCurveTo(x + size / 4, y - size, x + size / 2, y - size / 2, x, y);
  }
  
  function anim() {
    window.requestAnimationFrame(anim);
  
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, w, h);
  
    ctx.translate(hw, hh);
  
    var done = true;
    for (var l = 0; l < letters.length; ++l) {
      letters[l].step();
      if (letters[l].phase !== "done") done = false;
    }
  
    ctx.translate(-hw, -hh);
  
    if (done) for (var l = 0; l < letters.length; ++l) letters[l].reset();
  }
  
  for (let i = 0; i < opts.strings.length; ++i) {
    for (var j = 0; j < opts.strings[i].length; ++j) {
      letters.push(
        new Letter(
          opts.strings[i][j],
          j * opts.charSpacing +
            opts.charSpacing / 2 -
            (opts.strings[i].length * opts.charSize) / 2,
          i * opts.lineHeight +
            opts.lineHeight / 2 -
            (opts.strings.length * opts.lineHeight) / 2
        )
      );
    }
  }
  
  anim();
  
  window.addEventListener("resize", function () {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
  
    hw = w / 2;
    hh = h / 2;
  
    ctx.font = opts.charSize + "px Verdana";
  });
  anim();

document.addEventListener('DOMContentLoaded', () => {
  // Start flower animation first
  setTimeout(() => {
    document.body.classList.remove('not-loaded');
  }, 1000);

  // Wait for flower animation to complete before initializing birthday animation
  setTimeout(() => {
    // Get canvas and ensure it's ready
    const canvas = document.getElementById('c');
    if (canvas) {
      canvas.style.display = 'block';
      // All your existing animation code will run automatically since
      // it's already set up to use the canvas with id 'c'
    }
  }, 5800); // 1000ms initial delay + 4800ms for flower animation
});

function anim() {
  window.requestAnimationFrame(anim);

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, w, h);

  ctx.translate(hw, hh);

  var done = true;
  for (var l = 0; l < letters.length; ++l) {
    letters[l].step();
    if (letters[l].phase !== "done") done = false;
  }

  ctx.translate(-hw, -hh);

  if (done) {
    for (var l = 0; l < letters.length; ++l) letters[l].reset();
  }
}
document.addEventListener('DOMContentLoaded', () => {
  // First, get the canvas and initialize context
  c = document.getElementById('c');
  if (c) {
    // Initialize canvas and context
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    ctx = c.getContext('2d');
    hw = w / 2;
    hh = h / 2;
    
    // Create and add the button with stars
    const navButton = document.createElement('button');
    navButton.id = 'nextButton';  // Keep your original button ID
    navButton.textContent = 'Next Page';
    
    // Create stars container
    const stars = document.createElement('div');
    stars.className = 'stars';
    navButton.appendChild(stars);

    // Add stars with their positions
    const positions = [
        { top: '-15px', left: '-15px' },
        { top: '-15px', right: '-15px' },
        { bottom: '-15px', left: '-15px' },
        { bottom: '-15px', right: '-15px' },
        { top: '50%', left: '-15px', transform: 'translateY(-50%)' },
        { top: '50%', right: '-15px', transform: 'translateY(-50%)' }
    ];

    positions.forEach((pos, index) => {
        const star = document.createElement('span');
        star.textContent = '✨';
        star.style.position = 'absolute';
        Object.entries(pos).forEach(([key, value]) => {
            star.style[key] = value;
        });
        star.style.opacity = '0';
        star.style.transition = 'opacity 0.3s ease';
        star.style.animation = `sparkle 1.5s infinite alternate ${index * 0.2}s`;
        star.style.color = 'cyan';
        star.style.fontSize = '20px';
        star.style.pointerEvents = 'none';
        stars.appendChild(star);
    });

    // Add button to document
    document.body.appendChild(navButton);

    // Add click event listener to the button
    navButton.addEventListener('click', () => {
        window.location.href = 'sec.html';
    });

    // Start animations
    setTimeout(() => {
      document.body.classList.remove('not-loaded');
    }, 1000);

    setTimeout(() => {
      c.style.display = 'block';
      anim(); // Start the animation
    }, 5800);

    // Show the button after animations
    setTimeout(() => {
      if (navButton) {
        navButton.style.display = 'flex';  // Changed to flex for star positioning
      }
    }, 18000);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const nextButton = document.getElementById('nextButton');
  if (nextButton) {
      nextButton.addEventListener('click', function() {
          window.location.href = 'sec.html';
      });
  }
});
