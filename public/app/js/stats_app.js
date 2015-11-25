         'use strict';

// Declare app level module which depends on filters, and services
angular.module( 'statsApp',
                [ 'nvd3ChartDirectives' ] )
    .service( 'log',
              [ '$http', 'APP_PATH',
                function( $http, APP_PATH ) {
                    this.query = function( params ) {
                        return $http.get( APP_PATH + '/api/log' );
                    };

                    this.stats = function() {
                        return $http.get( APP_PATH + '/api/log/stats' );
                    };
                }
              ] )
    .controller( 'StatsCtrl',
                 [ '$scope', '$http', 'APP_PATH', 'log',
                   function ( $scope, $http, APP_PATH, log ) {
                       $scope.for_nvd3 = {
                           get_y: function(){ return function(d) { return d.count; }; },
                           get_x: function( metric ){ return function(d) { return d[ metric ]; }; }
                       };

                       $scope.retrieve_data = function() {
                           log.stats()
                               .then( function ( response ) {
                                   $scope.stats = response.data;

                                   _.chain($scope.stats.general)
                                       .keys()
                                       .each( function( key ) {
                                           $scope.stats.general[ key ].bar_graph_data = [ { "key": key,
                                                                                            "values": _($scope.stats.general[ key ])
                                                                                            .map( function( item ) {
                                                                                                return [ item[ key ], item.count ]; } )
                                                                                          } ];
                                       } );

                                   _($scope.stats.uai).each( function( etablissement ) {
                                       _.chain(etablissement)
                                           .keys()
                                           .each( function( key ) {
                                               etablissement[ key ].bar_graph_data = [ { "key": key,
                                                                                         "values": _($scope.stats.general[ key ])
                                                                                         .map( function( item ) {
                                                                                             return [ item[ key ], item.count ]; } )
                                                                                       } ];
                                           } );
                                   } );
                               } );
                       };

                       $scope.retrieve_data();
                   }
                 ] );
