'use strict';

angular.module( 'portailApp' )
    .controller( 'LogviewerCtrl',
                 [ '$scope', '$state', '$http', 'current_user', 'APP_PATH', 'log',
                   function( $scope, $state, $http, current_user, APP_PATH, log ) {
                       $scope.current_user = current_user;

                       $scope.go_home = function() {
                           $state.go( 'portail.logged' );
                       };

                       if ( !$scope.current_user.profil_actif.admin ) {
                           $scope.go_home();
                       }

                       $scope.logs = [];
                       $scope.filters = {};

                       $scope.apply_filters = function( raw_logs ) {
                           var filtered_logs = angular.copy( raw_logs );

                           return filtered_logs;
                       };

                       $scope.retrieve_data = function() {
                           log.query()
                               .then( function( response ) {
                                   $scope.raw_logs = response.data;

                                   _.chain($scope.logs).first().keys()
                                       .reject( function( key ) {
                                           return key == 'timestamp' || key == 'id' || key == 'params';
                                       } )
                                       .each( function( key ) {
                                           $scope.filters[ key ] = { id: key,
                                                                     data: _.chain($scope.logs).pluck( key ).uniq().value(),
                                                                     selected: null };
                                       } );
                               } );
                       };

                       $scope.retrieve_data();
                   }
                 ] );
