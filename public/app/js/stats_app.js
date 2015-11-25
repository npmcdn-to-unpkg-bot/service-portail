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
                }
              ] )
// définition des couleurs
    .constant( 'THEME', { filled: { base: '#aaffaa',
                                    stroke: '#88aa88' },
                          validated: { base: '#00ff00',
                                       stroke: '#00aa00' }
                        } )

// options des graphiques
    .factory( 'CHART_COLORS_FUNCTION', [ 'THEME',
                                         function( THEME ) {
                                             return function() {
                                                 var couleurs = [ THEME.validated.base, THEME.filled.base ];
                                                 return function( d, i ) {
                                                     return couleurs[ i ];
                                                 };
                                             };
                                         } ] )
    .service( 'BARCHART_DEFINITION', [ 'CHART_COLORS_FUNCTION',
                                       function( CHART_COLORS_FUNCTION ) {
                                           return function() {
                                               return { data: [],
                                                        tooltipContent: function() {
                                                            return function( key, x, y, e, graph ) {
                                                                return '<h2>' + x + '</h2><p>' + y + ' ' + key + '</p>';
                                                            };
                                                        },
                                                        xAxisTickFormatFunction: function() { return function( d ) { return d; }; },
                                                        colorFunction: CHART_COLORS_FUNCTION };
                                           };
                                       } ] )
    .service( 'PIECHART_DEFINITION', [ 'CHART_COLORS_FUNCTION',
                                       function( CHART_COLORS_FUNCTION ) {
                                           return function() {
                                               return { data: [ { label: 'saisie', value: 0 },
                                                                { label: 'valide', value: 0 } ],
                                                        xFunction: function(){ return function(d) { return d.label; }; },
                                                        yFunction: function(){ return function(d) { return d.value; }; },
                                                        colorFunction: CHART_COLORS_FUNCTION };
                                           };
                                       } ] )
    .controller( 'StatsCtrl',
                 [ '$scope', '$http', 'APP_PATH', 'log', 'PIECHART_DEFINITION',
                   function ( $scope, $http, APP_PATH, log, PIECHART_DEFINITION ) {
                       $scope.statistics = {};

                       $scope.logs = [];
                       $scope.filters = {};

                       $scope.apply_filters = function( raw_logs ) {
                           var filtered_logs = angular.copy( raw_logs );

                           return filtered_logs;
                       };

                       $scope.compute_statistics = function( logs ) {
                           // FIXME: temporarely filter out PORTAIL's internal pages
                           var tmp_logs = _(logs).reject( function( entry ) {
                               return entry.app == 'PORTAIL' && entry.url != '/portail/';
                           } );

                           return _.chain( tmp_logs ).first().keys()
                               .reject( function ( key ) {
                                   return key == 'timestamp' || key == 'id' || key == 'params' || key == 'ip';
                               } )
                               .map( function ( key ) {
                                   return [ key,
                                            _.chain(tmp_logs)
                                            .countBy( function( entry ) { return entry[ key ]; } )
                                            .map( function( value, key ) { return { key: key, val: value } ; } )
                                            .value() ];
                               } )
                               .object()
                               .value();
                       };

                       $scope.extract_filters = function( logs ) {
                           var filters = {};
                           _.chain( $scope.logs ).first().keys()
                               .reject( function ( key ) {
                                   return key == 'timestamp' || key == 'id' || key == 'params';
                               } )
                               .each( function ( key ) {
                                   filters[ key ] = {
                                       id: key,
                                       data: _.chain( $scope.logs ).pluck( key ).uniq().value(),
                                       selected: null
                                   };
                               } );

                           return filters;
                       };

                       $scope.retrieve_data = function() {
                           log.query()
                               .then( function ( response ) {
                                   $scope.logs = $scope.apply_filters( response.data );

                                   $scope.statistics = $scope.compute_statistics( $scope.logs );
                                   $scope.filters = $scope.extract_filters( $scope.logs );
                               } );
                       };

                       $scope.retrieve_data();
                   }
                 ] );
