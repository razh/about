(function( window, document, undefined ) {

  Background = function() {
    this.WIDTH  = window.innerWidth;
    this.HEIGHT = window.innerHeight;

    this.canvas = document.createElement( 'canvas' );

    this.canvas.width  = this.WIDTH;
    this.canvas.height = this.HEIGHT;

    this.canvas.style.position = 'absolute';

    document.body.style.margin  = '0';
    document.body.style.padding = '0';
    document.body.appendChild( this.canvas );

    this.ctx = this.canvas.getContext( '2d' );

    this.red   = 242;
    this.green = 229;
    this.blue  = 223;
    this.alpha = 1.0;

    this.minRed = 0;
    this.minGreen = 0;
    this.minBlue = 0;

    this.factorRed   = 100;
    this.factorGreen = 100;
    this.factorBlue  = 100;

    this.size = 1.5;

    this.points = [];

    this.xmin = Number.POSITIVE_INFINITY;
    this.ymin = Number.POSITIVE_INFINITY;
    this.zmin = Number.POSITIVE_INFINITY;

    this.xmax = Number.NEGATIVE_INFINITY;
    this.ymax = Number.NEGATIVE_INFINITY;
    this.zmax = Number.NEGATIVE_INFINITY;
  };

  Background.prototype.create = function() {
    // Initial variables.
    var x0 = 0.1,
        y0 = 0,
        z0 = 0;

    // Coefficients.
    var a = 10,
        b = 28,
        c = 8 / 3;

    var count = 10000,
        dt = 0.01;

    var x1 = x0,
        y1 = y0,
        z1 = z0;

    // Bounds.
    var xmin = this.xmin,
        ymin = this.ymin;
        zmin = this.zmin;

    var xmax = this.xmax,
        ymax = this.ymax;
        zmax = this.zmax;

    for ( var i = 0; i < count; i++ ) {
      /**
        We step through the system of differential equations defined by:

          dx / dt = a ( y - x)
          dy / dt = x ( b - z ) - y
          dz / dt = x * y - c * z

        For more information, see {@link http://paulbourke.net/fractals/lorenz/},
        which is what the following is based off of. Also check out
        {@link http://lab.aerotwist.com/webgl/strange-attractor/}, which is Paul
        Lewis's JavaScript implementation using WebGL/three.js.
       */

      x1 = x0 + dt * a * ( y0 - x0 );
      y1 = y0 + dt * ( x0 * ( b - z0 ) - y0 ) ;
      z1 = z0 + dt * ( x0 * y0 - c * z0 );

      xmin = Math.min( xmin, x1 );
      ymin = Math.min( ymin, y1 );
      zmin = Math.min( zmin, z1 );

      xmax = Math.max( xmax, x1 );
      ymax = Math.max( ymax, y1 );
      zmax = Math.max( zmax, z1 );

      this.points.push( x1 );
      this.points.push( y1 );
      this.points.push( z1 );

      x0 = x1;
      y0 = y1;
      z0 = z1;
    }

    this.xmin = xmin;
    this.ymin = ymin;
    this.zmin = zmin;

    this.xmax = xmax;
    this.ymax = ymax;
    this.zmax = zmax;
  };

  Background.prototype.draw = function() {
    this.ctx.fillStyle = 'rgba( ' + this.red   +
                         ', '     + this.green +
                         ', '     + this.blue  +
                         ', '     + this.alpha + ' )';

    this.ctx.fillRect( 0, 0, this.WIDTH, this.HEIGHT );

    var inverseWidth  = 1 / ( this.xmax - this.xmin ),
        inverseHeight = 1 / ( this.ymax - this.ymin ),
        inverseDepth  = 1 / ( this.zmax - this.zmin );
        scale         = 18,
        radius        = this.size / scale;

    this.ctx.save();

    this.ctx.translate( 0.4 * this.WIDTH, 0.5 * this.HEIGHT );
    this.ctx.scale( scale, scale );

    var x, y, z;
    var r, g, b, a;
    var relativeX, relativeY, relativeZ;
    for ( var i = 0, il = Math.floor( this.points.length / 3 ); i < il; i++ ) {
      x = this.points[ 3 * i ];
      y = this.points[ 3 * i + 1 ];
      z = this.points[ 3 * i + 2 ];

      relativeX = ( x - this.xmin ) * inverseWidth;
      relativeY = ( y - this.ymin ) * inverseHeight;
      relativeZ = ( z - this.zmin ) * inverseDepth;

      r = Math.round( this.factorRed * 2 * Math.abs( relativeX - 0.5 ) ) + this.minRed;
      g = this.minGreen;
      b = Math.round( this.factorBlue * 2 * Math.abs( relativeY - 0.5 ) ) + this.minBlue;
      a = Math.max( 0.0, Math.pow( relativeZ, 2 ) );
      if ( i === 0 ) {
        console.log( 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + a + ' )' );
      }

      r = 36;
      g = 20;
      b = 38;

      this.ctx.fillStyle = 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + a + ' )';
      this.ctx.fillRect( x, y, radius, radius );
    }

    this.ctx.restore();
  };

  Background.prototype.resize = function( event ) {
    this.ctx.clearRect( 0, 0, this.WIDTH, this.HEIGHT );

    this.WIDTH  = window.innerWidth;
    this.HEIGHT = window.innerHeight;

    this.canvas.width  = this.WIDTH;
    this.canvas.height = this.HEIGHT;
  };

}) ( window, document );

var background = new Background();
background.create();
background.draw();

window.onresize = function( event ) {
  console.log('resize');
  background.resize();
  background.draw();
};

function onChange() {
  background.draw();
}

var gui = new dat.GUI();
var controller = gui.add( background, 'minRed', 0, 255 ).step(1);
controller.onChange( onChange );
controller = gui.add( background, 'minGreen', 0, 255 ).step(1);
controller.onChange( onChange );
controller = gui.add( background, 'minBlue', 0, 255 ).step(1);
controller.onChange( onChange );

controller = gui.add( background, 'factorRed', 0, 255 ).step(1);
controller.onFinishChange( onChange );
controller = gui.add( background, 'factorGreen', 0, 255 ).step(1);
controller.onFinishChange( onChange );
controller = gui.add( background, 'factorBlue', 0, 255 ).step(1);
controller.onFinishChange( onChange );

controller = gui.add( background, 'size', 0.1, 10 ).step( 0.25 );
controller.onFinishChange( onChange );
