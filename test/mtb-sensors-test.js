var assert = require('chai').assert,
    mtb = require('../');

describe( '#getWeatherData', function() {
  it( 'should return an array', function( done ) {
    mtb.getWeatherData( function( err, results ) {
      assert.typeOf( results, 'Array' );
      assert.equal( results.length, 24 );
      var firstRecord = results[ 0 ];
      assert.property( firstRecord, 'wv-temp' );
      done();
    } );
  } );
} );