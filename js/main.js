(function( $, window, document ) {
  'use strict';

  var PI2 = 2 * Math.PI;

  var config = {
    radius: 10,
    fill: 'white',

    stroke: 'white',
    lineWidth: 2
  };

  var nodeCount = 10,
      edgeCount = 10;

  var nodes = [],
      edges = [],
      adjacenyList = [];

  var stage = {
    x0: 0.0,
    y0: 0.0,
    x1: 0.0,
    y1: 0.0
  };

  var $canvas, canvas, context;

  var prevTime, currTime, running;

  function Node( x, y ) {
    this.x = x || 0.0;
    this.y = y || 0.0;

    this.vx = 0.0;
    this.vy = 0.0;
  }

  Node.prototype.draw = function( ctx ) {
    ctx.arc( this.x, this.y, config.radius, 0, PI2 );
  };

  Node.prototype.update = function( dt ) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if ( stage.x0 > this.x || this.x > stage.x1 ) {
      this.vx = -this.vx;
    }

    if ( stage.y0 > this.y || this.y > stage.y1 ) {
      this.vy = -this.vy;
    }
  };

  function Edge( src, dst ) {
    this.src = typeof src !== 'undefined' ? src : null;
    this.dst = typeof dst !== 'undefined' ? dst : null;
  }

  Edge.prototype.draw = function( ctx ) {
    var x0 = this.src.x,
        y0 = this.src.y,
        x1 = this.dst.x,
        y1 = this.dst.y;

    ctx.moveTo( x0, y0 );
    ctx.lineTo( x1, y1 );
  };

  Edge.prototype.update = function( dt ) {};

  function init() {
    $canvas = $( '<canvas></canvas>' ),
    canvas  = $canvas[0],
    context = canvas.getContext( '2d' );

    $( 'body' ).append( $canvas );

    var width  = stage.x1 = canvas.width  = 480,
        height = stage.y1 = canvas.height = 320;

    var i = nodeCount,
        node;

    while( i-- ) {
      node = new Node( Math.random() * width, Math.random() * height );
      node.vx = ( Math.random() > 0.5 ? 1 : -1 ) * Math.random() * 20 + 20;
      node.vy = ( Math.random() > 0.5 ? 1 : -1 ) * Math.random() * 20 + 20;
      nodes.push( node );
    }

    i = edgeCount;
    var srcIndex, dstIndex;
    while ( i > 0 ) {
      srcIndex = Math.floor( Math.random() * nodeCount );
      dstIndex = Math.floor( Math.random() * nodeCount );

      while ( srcIndex === dstIndex ) {
        dstIndex = Math.floor( Math.random() * nodeCount );
      }

      if ( !adjacenyList[ srcIndex ] ) {
        adjacenyList[ srcIndex ] = [];
      }

      if ( adjacenyList[ srcIndex ].indexOf( dstIndex ) === -1 ) {
        adjacenyList[ srcIndex ].push( dstIndex );
        i--;
      }
    }

    adjacenyList.forEach(function( src, srcIndex ) {
      src.forEach(function( dstIndex ) {
        edges.push( new Edge( nodes[ srcIndex ], nodes[ dstIndex ] ) );
      });
    });

    prevTime = Date.now();
    tick();
  }

  function tick() {
    update();
    draw();

    requestAnimationFrame( tick );
  }

  function update() {
    currTime = Date.now();
    var dt = currTime - prevTime;
    prevTime = currTime;

    if ( dt > 1e2 ) {
      dt = 1e2;
    }

    // Convert from milliseconds to seconds.
    dt *= 1e-3;

    nodes.forEach(function( node ) {
      node.update( dt );
    });
  }

  function draw() {
    context.clearRect( 0, 0, canvas.width, canvas.height );

    context.beginPath();
    edges.forEach(function( edge ) {
      edge.draw( context );
    });

    context.lineWidth = config.lineWidth;
    context.strokeStyle = config.stroke;
    context.stroke();

    context.beginPath();
    nodes.forEach(function( node ) {
      node.draw( context );
    });

    context.fillStyle = config.fill;
    context.fill();
  }

  init();

}) ( jQuery, window, document );
