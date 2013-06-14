(function() {
  'use strict';

  // Shamelessly sourced from three.js. Authored by mrdoob.
  function Vector3( x, y, z ) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  Vector3.prototype.draw = function( ctx ) {
    ctx.arc( this.x, this.y, 2, 0, 2 * Math.PI );
  };

  function Sphere( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {
    this.radius = radius || 50;

    this.widthSegments = widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
    this.heightSegments = heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

    this.phiStart = phiStart = phiStart || 0;
    this.phiLength = phiLength = typeof phiLength !== 'undefined' ? phiLength : Math.PI * 2;

    this.thetaStart = thetaStart = thetaStart || 0;
    this.thetaLength = thetaLength = typeof thetaLength !== 'undefined' ?  phiLength : Math.PI;

    this.vertices = [];

    var x, y, u, v;
    var vertex;

    for ( y = 0; y <= heightSegments; y++ ) {
      for ( x = 0; x <= widthSegments; x++ ) {
        u = x / widthSegments;
        v = y / heightSegments;

        vertex = new Vector3();
        vertex.x = -radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
        vertex.y =  radius * Math.cos( thetaStart + v * thetaLength );
        vertex.z =  radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

        this.vertices.push( vertex );
      }
    }
  }

  Sphere.prototype.draw = function( ctx ) {
    ctx.fillStyle = 'white';
    for ( var i = 0, il = this.vertices.length; i < il; i++ ) {
      this.vertices[i].draw( ctx );
    }
    ctx.fill();
  };


  var canvas = document.getElementById( 'canvas' );
  var context = canvas.getContext( '2d' );

  var sphere = new Sphere( 50, 16, 16 );

  canvas.width = 150;
  canvas.height = 150;


  context.translate( 75, 75 );
  draw();

  function draw() {
    context.clearRect( 0, 0, canvas.width, canvas.height );
    sphere.draw( context );
  }
}) ();
