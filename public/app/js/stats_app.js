	 'use strict';

// Declare app level module which depends on filters, and services
angular.module( 'statsApp',
		[ 'ui.bootstrap',
		  'nvd3',
		  'angularMoment' ] )
    .run( [ 'amMoment', function( amMoment ) { amMoment.changeLocale( 'fr' ); } ] )
    .service( 'log',
	      [ '$http', 'APP_PATH',
		function( $http, APP_PATH ) {
		    this.query = function( params ) {
			return $http.get( APP_PATH + '/api/log' );
		    };

		    this.stats = function( params ) {
			return $http.get( APP_PATH + '/api/log/stats', { params: params } );
		    };
		}
	      ] )
    .controller( 'StatsCtrl',
		 [ '$scope', '$http', 'moment', 'APP_PATH', 'log',
		   function ( $scope, $http, moment, APP_PATH, log ) {
		       $scope.period_types = { list: [ { label: 'jour', value: 'day' },
						       { label: 'semaine', value: 'week' },
						       { label: 'mois', value: 'month' },
						       { label: 'année', value: 'year' } ],

		       var for_nvd3 = {
			   get_y: function(){ return function(d) { return d.count; }; },
			   get_x: function( metric ){ return function(d) { return d[ metric ]; }; },
			   yAxisFormatFunction:  function() {
			       return function( d ) { return d3.format( '.0d' )( d ); };
			   }
		       };
					       selected: 'week' };

		       $scope.multibarchart_options = { chart: { type: 'multiBarChart',
								 height: 256,
								 width: 550,
								 margin: { left: 50,
									   top: 20,
									   bottom: 100,
									   right: 20 },
								 showControls: false,
								 showValues: true,
								 // yAxisTickFormat: for_nvd3.yAxisFormatFunction,
								 // //x: for_nvd3.get_x,
								 // y: for_nvd3.get_y,
								 stacked: false,
								 duration: 500,
								 labelThreshold: 0.01,
								 labelSunbeamLayout: true
							       }
						      };
		       $scope.multibarhorizontalchart_options = $scope.multibarchart_options;
		       $scope.multibarhorizontalchart_options.chart.type = 'multiBarHorizontalChart';
		       $scope.multibarhorizontalchart_options.chart.margin = { left: 150,
									       top: 20,
									       bottom: 20,
									       right: 50 };

		       $scope.retrieve_data = function( from ) {
			   $scope.fin = $scope.debut.clone().endOf( $scope.period_types.selected );

			   var params = { from: $scope.debut.clone().toDate(),
					  until: $scope.fin.clone().toDate() };

			   log.stats( params )
			       .then( function ( response ) {
				   $scope.stats = response.data;
				   $scope.filters = {};
				   _.chain($scope.stats.general).keys()
				       .select( function( key ) { return key == 'uai'; } )
				       .each ( function( key ) {
					   $scope.filters[ key ] = _($scope.stats.general[ key ]).pluck( key );
				       } );

				   _.chain($scope.stats.general)
				       .keys()
				       .each( function( key ) {
					   $scope.stats.general[ key ].bar_graph_data = [ { "key": key,
											    "values": _($scope.stats.general[ key ])
											    .map( function( item ) {
												return { key: key,
													 x: (key == 'uai') ? _($scope.stats.info.noms_uais).find({ uai: item[ key ] }).nom : item[ key ],
													 y: item.count };

											    } )
											  } ];
				       } );

				   _([ 'uai', 'user_type' ]).each( function( key ) {
				       var first = _.chain($scope.stats[ key ]).keys().first().value();
				       _($scope.stats[ key ]).each( function( stats, clef ) {
					   stats[ key ] = (key == 'uai') ? _($scope.stats.info.noms_uais).find({ uai: clef }).nom : clef;
					   stats.active_tab = clef == first;

					   _.chain(stats)
					       .keys()
					       .each( function( _key ) {
						   stats[ _key ].bar_graph_data = [ { "key": _key,
										      "values": _(stats[ _key ])
										      .map( function( item ) {
											  return { key: _key,
												   x: item[ _key ],
												   y: item.count };
										      } )

										    } ];
					       } );
				       } );

				       $scope.stats[ key ] = _($scope.stats[ key ]).toArray();
				   } );
			       } );
		       };

		       $scope.decr_period = function() {
			   $scope.debut.subtract( 1, $scope.period_types.selected + 's' );
			   $scope.retrieve_data( $scope.debut );
		       };
		       $scope.incr_period = function() {
			   $scope.debut.add( 1, $scope.period_types.selected + 's' );
			   $scope.retrieve_data( $scope.debut );
		       };
		       $scope.reset_period = function() {
			   $scope.debut = moment().startOf( $scope.period_types.selected );
			   $scope.retrieve_data( $scope.debut );
		       };

		       $scope.reset_period();
		   }
		 ] );
