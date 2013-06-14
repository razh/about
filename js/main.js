(function() {
  function Circle( x, y, radius, color ) {
    this.x = x || 0;
    this.y = y || 0;

    this.radius = radius || 1;
    this.color = color || 'white';

    this.velocityX = 0;
    this.velocityY = 0;
  }

  Circle.prototype.update = function( dt ) {
    this.velocityY += dt * 100;
    this.y = Math.min( HEIGHT - this.radius, this.y + this.velocityY * dt );
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

  var WIDTH = 250;
  var HEIGHT = 250;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  var prevTime = Date.now();
  var currTime;

  var circles = [];
  var circleCount = 10;


  function update() {
    currTime = Date.now();
    var dt = ( currTime - prevTime ) * 1e-3;
    prevTime = currTime;

    for ( var i = 0; i < circleCount; i++ ) {
      circles[i].update( dt );
    }
  }

  function draw() {
    context.clearRect( 0, 0, WIDTH, HEIGHT );
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

    var circle;
    var x, y, radius;
    for ( var i = 0; i < circleCount; i++ ) {
      radius = Math.random() * 10 + 10;
      x = Math.min( Math.max( WIDTH * Math.random(), radius ), WIDTH - radius );
      y = HEIGHT * Math.random();

      circle = new Circle( x, y, radius );
      circles.push( circle );
    }

    requestAnimationFrame( loop );
  }

  init();
}) ();
