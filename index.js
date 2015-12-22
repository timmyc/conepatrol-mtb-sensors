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
};

var CONDITIONS_KEYS = {
	'since 3pm yesterday': 'snowfall_since_3_pm',
	'24 Hour': 'snowfall_last_24_hours',
	'3 Day': 'snowfall_last_3_days',
	'7 Day': 'snowfall_last_7_days',
	'snowfall since Oct 1': 'snowfall_season'
};

module.exports = {
	getWeatherData: function( cb ) {
		x( 'http://www.mtbachelor.com/24-weather-report/',
			'tr', [ { time: 'th', columns: [ 'td' ] } ] )
		( function( err, data ){
			if ( err ) {
				return cb( err, [] );
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

			cb( null, results );
		} );
	},

	getConditionsPageData: function( cb ) {
		x( 'http://www.mtbachelor.com/conditions-report/',
			'div.conditions',
			x( '.item', [ { key: '.value', value: '.key' } ] ) )
		( function( err, data ) {
			if ( err ) {
				return cb( err, {} );
			}

			var snowfallData = {
				base: {},
				mid: {}
			}

			data.forEach( function( row ) {
				if ( ! row.value || ! row.key || ! CONDITIONS_KEYS[ row.key ] ) {
					return;
				}

				var key = CONDITIONS_KEYS[ row.key ],
					value = row.value.replace( '"', '' );

				if ( snowfallData.mid[ key ] ) {
					snowfallData.base[ key ] = value;
					return;
				}

				snowfallData.mid[ key ] = value
			} )

			cb( null, snowfallData );
		} );
	}	
}
