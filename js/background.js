(function( window, document, undefined ) {

  Background = function() {
    this.WIDTH  = window.innerWidth;
    this.HEIGHT = window.innerHeight;

    this.canvas = document.createElement( 'canvas' );

    this.canvas.width  = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    document.body.appendChild( this.canvas );

    this.ctx = this.canvas.getContext( '2d' );

    this.red   = 255;
    this.green = 255;
    this.blue  = 255;
    this.alpha = 1.0;

    this.particleRed   = 115;
    this.particleGreen = 72;
    this.particleBlue  = 84;

    this.size = 1.5;

    this.points = [];

    // Coefficients.
    this.a = 10;
    this.b = 28;
    this.c = 8 / 3;

    this.count = 10000;
    this.dt = 0.01;

    this.zmin = Number.POSITIVE_INFINITY;
    this.zmax = Number.NEGATIVE_INFINITY;

    this.resizing = false;
  };

  Background.prototype.create = function() {
    // Initial variables.
    var x0 = 0.1,
        y0 = 0,
        z0 = 0;

    var a = this.a,
        b = this.b,
        c = this.c;

    var count = this.count,
        dt = this.dt;

    var x1 = x0,
        y1 = y0,
        z1 = z0;

    // Bounds.
    var zmin = this.zmin,
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

      zmin = Math.min( zmin, z1 );
      zmax = Math.max( zmax, z1 );

      this.points.push( x1 );
      this.points.push( y1 );
      this.points.push( z1 );

      x0 = x1;
      y0 = y1;
      z0 = z1;
    }

    this.zmin = zmin;
    this.zmax = zmax;
  };

  Background.prototype.draw = function() {
    this.ctx.fillStyle = 'rgba( ' + this.red   +
                         ', '     + this.green +
                         ', '     + this.blue  +
                         ', '     + this.alpha + ' )';

    this.ctx.fillRect( 0, 0, this.WIDTH, this.HEIGHT );

    var inverseDepth  = 1 / ( this.zmax - this.zmin );
        scale         = 18,
        radius        = this.size / scale;

    this.ctx.save();

    this.ctx.translate( 0.4 * this.WIDTH, 0.5 * this.HEIGHT );
    this.ctx.scale( scale, scale );

    var x, y, z;
    var alpha;
    var relativeZ;
    for ( var i = 0, il = Math.floor( this.points.length / 3 ); i < il; i++ ) {
      x = this.points[ 3 * i ];
      y = this.points[ 3 * i + 1 ];
      z = this.points[ 3 * i + 2 ];

      relativeZ = ( z - this.zmin ) * inverseDepth;
      alpha = Math.max( 0.0, Math.pow( relativeZ, 2 ) );

      this.ctx.fillStyle = 'rgba( ' + this.particleRed   +
                           ', '     + this.particleGreen +
                           ', '     + this.particleBlue  +
                           ', '     + alpha + ' )';
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

window.onresize = function( event ) {
  if ( !background.resizing ) {
    console.log('resize');
    background.resizing = true;

    background.resize();
    background.draw();

    background.resizing = false;
  }
};

var background = new Background();
background.create();
background.draw();
