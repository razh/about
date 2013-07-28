'use strict';

(function( $ ) {
  $(function() {
    $( 'body' ).rain({
      gravity: 0,
      color: 'rgba(255, 255, 255, 0.5)',
      count: 1000,
      lineWidth: 2,
      velocity: {
        x: {
          min: 0,
          max: -1
        },
        y: {
          min: 0,
          max: -2
        }
      }
    });
  });
}) ( jQuery );
