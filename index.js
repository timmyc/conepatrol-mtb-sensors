var Xray = require( 'x-ray' ),
	x = Xray();

var COLUMN_KEYS = {
	"6300' Base Depth": 'wv-base',
	"6300' Base Temp": 'wv-temp',
	"7285' Sunrise Temp": 'sunrise-temp',
	"7800' Pine Temp": 'pine-temp',
	"8000' Northwest Temp": 'northwest-temp',
	"9000' Summit Temp": 'summit-temp',
	"Base RH": 'wv-rh',
	"Pine RH": 'pine-rh',
	"Summit RH": 'summit-rh',
	"Sunrise Wind Avg": 'sunrise-wind-avg',
	"Sunrise Wind Dir": 'sunrise-wind-dir',
	"Sunrise Wind Max": 'sunrise-wind-max',
	"Pine Wind Avg": 'pine-wind-avg',
	"Pine Wind Dir": 'pine-wind-dir',
	"Pine Wind Max": 'pine-wind-max',
	"Northwest Wind Avg": 'northwest-wind-avg',
	"Northwest Wind Dir": 'northwest-wind-dir',
	"Northwest Wind Max": 'northwest-wind-max',
	"Summit Wind Avg": 'summit-wind-avg',
	"Summit Wind Dir": 'summit-wind-dir',
	"Summit Wind Max": 'summit-wind-max',
}

module.exports = {
	getWeatherData: function( cb ) {
		x( 'http://www.mtbachelor.com/24-weather-report/', 'tr', [ { time: 'th', columns: [ 'td' ] } ] )(function( err, data ){
			if ( err ) {
				return []
			}

			var isNa = /n\/a/;

			var columnMap = data[ 0 ].columns.map( function( item ) {
				return COLUMN_KEYS[ item ];
			} );

			data.splice( 0, 1 );

			var results = data.map( function( row ) {
				var record = {
					time: row.time
				}

				columnMap.forEach( function( key, index ) {
					var value = row.columns[ index ];
					record[ key ] = isNa.test( value ) ? null : value;
				} );

				return record;
			} );

			cb( results );
		} );
	}	
}
