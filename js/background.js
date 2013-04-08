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

    this.scale = 18;
    this.size  = 1.5;

    this.points = [];

    // Coefficients.
    this.a = 10;
    this.b = 28;
    this.c = 8 / 3;

    this.count = 10000;
    this.dt    = 0.01;

    // Position (in percentages).
    this.x = 0.45;
    this.y = 0.5;
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
        dt    = this.dt;

    var x1 = x0,
        y1 = y0,
        z1 = z0;

    // Bounds.
    var zmin = Number.POSITIVE_INFINITY,
        zmax = Number.NEGATIVE_INFINITY;

    var points = [];
    var i, il;
    for ( i = 0; i < count; i++ ) {
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

      // Float32Array creation was found to be more expensive than object creation.
      points.push({
        x: x1,
        y: y1,
        z: z1
      });

      x0 = x1;
      y0 = y1;
      z0 = z1;
    }

    // Set third coordinate to alpha value (rounded to nearest hundredths).
    var inverseDepth  = 1 / ( zmax - zmin ),
        relativeZ;

    for ( i = 0, il = points.length; i < il; i++ ) {
      relativeZ = ( points[i].z - zmin ) * inverseDepth;
      points[i].z = Math.round( relativeZ * relativeZ * 1e3 ) * 1e-3;
    }

    points.sort(function( a, b ) {
      return a.z - b.z;
    });

    for ( i = 0, il = points.length; i < il; i++ ) {
      this.points.push( points[i].x );
      this.points.push( points[i].y );
      this.points.push( points[i].z );
    }
  };

  Background.prototype.draw = function() {
    this.ctx.fillStyle = 'rgba( ' + this.red   +
                         ', '     + this.green +
                         ', '     + this.blue  +
                         ', '     + this.alpha + ' )';

    this.ctx.fillRect( 0, 0, this.WIDTH, this.HEIGHT );

    var scale  = this.scale,
        radius = this.size / scale;

    this.ctx.save();

    // Tranform context.
    this.ctx.translate( this.x * this.WIDTH,
                        this.y * this.HEIGHT );
    this.ctx.scale( scale, scale );

    // Calculate viewport boundaries.
    var lx = -this.x * this.WIDTH  / scale,
        ly = -this.y * this.HEIGHT / scale,
        rx = ( 1 - this.x ) * this.WIDTH  / scale,
        ry = ( 1 - this.y ) * this.HEIGHT / scale;

    var particleRGB = 'rgba( ' + this.particleRed   +
                      ', '     + this.particleGreen +
                      ', '     + this.particleBlue  +
                      ', ';

    var x, y, alpha,
        currentAlpha = 0.0;
    for ( var i = 0, il = this.points.length; i < il; i += 3 ) {
      x = this.points[ i ];
      y = this.points[ i + 1 ];
      alpha = this.points[ i + 2 ];

      // Clip unseen points.
      if ( lx > x || x > rx ||
           ly > y || y > ry ) {
        continue;
      }

      if ( alpha !== currentAlpha ) {
        this.ctx.fillStyle = particleRGB + alpha + ' )';
      }

      this.ctx.fillRect( x, y, radius, radius );
    }

    this.ctx.restore();
  };

  Background.prototype.resize = function( event ) {
    this.WIDTH  = window.innerWidth;
    this.HEIGHT = window.innerHeight;

    this.canvas.width  = this.WIDTH;
    this.canvas.height = this.HEIGHT;
  };


}) ( window, document );


// Function taken verbatim from java.awt.Color.
function convertHSBtoRGB( hue, saturation, brightness ) {
  var r = 0,
      g = 0,
      b = 0;

  if ( saturation === 0 ) {
    r = g = b = brightness * 255 + 0.5;
  } else {
    var h = ( hue - Math.floor( hue ) ) * 6.0,
        f = h - Math.floor( h ),
        p = brightness * ( 1.0 - saturation ),
        q = brightness * ( 1.0 - saturation * f ),
        t = brightness * ( 1.0 - ( saturation * ( 1.0 - f ) ) );
    switch ( h ) {

      case 0:
        r = brightness * 255 + 0.5;
        g = t * 255 + 0.5;
        b = p * 255 + 0.5;
        break;

      case 1:
        r = q * 255 + 0.5;
        g = brightness * 255 + 0.5;
        b = p * 255 + 0.5;
        break;

      case 2:
        r = p * 255 + 0.5;
        g = brightness * 255 + 0.5;
        b = t * 255 + 0.5;
        break;

      case 3:
        r = p * 255 + 0.5;
        g = q * 255 + 0.5;
        b = brightness * 255 + 0.5;
        break;

      case 4:
        r = t * 255 + 0.5;
        g = p * 255 + 0.5;
        b = brightness * 255 + 0.5;
        break;

      case 5:
        r = brightness * 255 + 0.5;
        g = p * 255 + 0.5;
        b = q * 255 + 0.5;
        break;

    }
  }

  return ( Math.round(r) << 16 ) |
         ( Math.round(g) <<  8 ) |
         ( Math.round(b) <<  0 );
}

(function( window ) {
  window.onresize = function( event ) {
    background.resize();
    background.draw();
  };

  var time = Date.now();

  var background = new Background();
  background.create();
  background.draw();

  console.log( Date.now() - time );
}) ( window );
