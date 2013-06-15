(function() {
  function Circle( x, y, radius, color ) {
    this.x = x || 0;
    this.y = y || 0;

    this.radius = radius || 1;
    this.color = color || 'black';

    this.radialVelocity = ( 0.5 * Math.random() + 0.15 ) * 2 * Math.PI / 180;
    if ( Math.random() < 0.5 ) {
      this.radialVelocity = -this.radialVelocity;
    }

    this.velocityX = 400;
    this.velocityY = 400;
  }

  Circle.prototype.update = function( dt ) {
    var halfWidth = 0.5 * WIDTH,
        halfHeight = 0.5 * HEIGHT;

    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;

    // Transform origin to center.
    var x = this.x - halfWidth,
        y = this.y - halfHeight;

    // Rotate.
    var cos = Math.cos( this.radialVelocity ),
        sin = Math.sin( this.radialVelocity );

    var rx = cos * x - sin * y,
        ry = sin * x + cos * y;

    this.x = rx + halfWidth;
    this.y = ry + halfHeight;

    if ( this.x < 0 ) {
      this.x = WIDTH;
    } else if ( this.x > WIDTH ) {
      this.x = 0;
    }

    if ( this.y < 0 ) {
      this.y = HEIGHT;
    } else if ( this.y > HEIGHT ) {
      this.y = 0;
    }
  };

  Circle.prototype.draw = function( ctx ) {
    ctx.beginPath();
    ctx.arc( this.x, this.y, this.radius, 0, 2 * Math.PI );
    ctx.closePath();

    ctx.fillStyle = this.color;
    ctx.fill();
  };

  var canvas = document.getElementById( 'canvas' );
  var context = canvas.getContext( '2d' );

  var WIDTH = Math.max( 480, Math.min( window.innerWidth, window.innerHeight ) );
  var HEIGHT = WIDTH;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  canvas.style.marginTop = -0.5 * HEIGHT + 'px';
  canvas.style.marginLeft = -0.5 * WIDTH + 'px';

  var prevTime = Date.now();
  var currTime;

  var circles = [];
  var circleCount = 15;

  var backgroundColor = '#ddd';

  function update() {
    currTime = Date.now();
    var dt = currTime - prevTime;
    prevTime = currTime;

    if ( dt > 1e2 ) {
      dt = 1e2;
    }

    dt *= 1e-3;

    var j;
    for ( var i = 0; i < circleCount; i++ ) {
      circles[i].update( dt );
    }
  }

  function draw() {
    context.fillStyle = backgroundColor;
    context.fillRect( 0, 0, WIDTH, HEIGHT );
    for ( var i = 0; i < circleCount; i++ ) {
      circles[i].draw( context );
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame( loop );
  }

  function init() {
    if ( !window.requestAnimationFrame ) {
      return;
    }

    var widthSquared = 0.5 * WIDTH;
    widthSquared *= widthSquared;

    var circle;
    var x, y, radius;
    for ( var i = 0; i < circleCount; i++ ) {
      radius = Math.random() * 2 + 1;

      x = Math.min( Math.max( WIDTH * Math.random(), 2 * radius ), WIDTH - 2 * radius );
      y = HEIGHT * Math.random() - 2 * radius;

      circle = new Circle( x, y, radius );
      circles.push( circle );
    }

    requestAnimationFrame( loop );
  }

  window.addEventListener( 'resize', function() {
    WIDTH = Math.max( 480, Math.min( window.innerWidth, window.innerHeight ) );
    HEIGHT = WIDTH;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    canvas.style.marginTop = -0.5 * HEIGHT + 'px';
    canvas.style.marginLeft = -0.5 * WIDTH + 'px';
  });

  init();
}) ();
