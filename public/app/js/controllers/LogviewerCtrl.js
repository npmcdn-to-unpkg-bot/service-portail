'use strict';

angular.module( 'portailApp' )
    .controller( 'LogviewerCtrl',
                 [ '$scope', '$state', '$http', 'current_user', 'APP_PATH',
                   function( $scope, $state, $http, current_user, APP_PATH ) {
                       $scope.current_user = current_user;

                       $scope.go_home = function() {
                           $state.go( 'portail.logged' );
                       };

                       if ( !$scope.current_user.profil_actif.admin ) {
                           $scope.go_home();
                       }

                       $scope.logs = [];
                       $scope.filters = {};

                       $scope.retrieve_data = function() {
                           $http.get( '/api/app/v2/log' )
                               .then( function( response ) {
                                   $scope.logs = response.data;

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
