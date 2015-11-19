/*
 * Controleur de la page publique
 */
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

                       $http.get( '/api/app/v2/log' )
                           .then( function( response ) {
                               $scope.logs = response;
                           } );
                   }
                 ] );
