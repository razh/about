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

  function init() {
    $canvas = $( '<canvas></canvas>' ),
    canvas  = $canvas[0],
    context = canvas.getContext( '2d' );

    $( 'body' ).append( $canvas );

    var width  = canvas.width  = 480,
        height = canvas.height = 320;

    var i = nodeCount;
    while( i-- ) {
      nodes.push( new Node( Math.random() * width, Math.random() * height ) );
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
      src.forEach(function( dst, dstIndex ) {
        edges.push( new Edge( nodes[ srcIndex ], nodes[ dstIndex ] ) );
      });
    });

    console.log(edges)

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
