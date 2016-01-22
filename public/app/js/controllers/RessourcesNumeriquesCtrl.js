'use strict';

angular.module( 'portailApp' )
    .controller( 'RessourcesNumeriquesCtrl',
                 [ '$scope', 'currentUser', 'APP_PATH', 'log',
                   function( $scope, currentUser, APP_PATH, log ) {
                       $scope.prefix = APP_PATH;

                       $scope.log_and_open_link = function( url ) {
                           log.add( 'GAR', url, null );
                           window.open( url, 'laclasseexterne' );
                       };

                       currentUser.ressources().then( function ( response ) {
                           $scope.ressources_numeriques = response;
                       } );
                   }
                 ]
               );
