'use strict';

angular.module( 'portailApp' )
    .controller( 'RessourcesNumeriquesCtrl',
                 [ '$scope', '$state', '$window', 'currentUser', 'APP_PATH', 'log', 'apps',
                   function( $scope, $state, $window, currentUser, APP_PATH, log, apps ) {
                       $scope.prefix = APP_PATH;

                       apps.query()
                           .then( function ( response ) {
                               if ( _.chain( response ).findWhere( { application_id: 'GAR' } ).isUndefined().value() ) {
                                   $state.go( 'portail.logged', {}, { reload: true, inherit: true, notify: true } );
                               }

                               $scope.log_and_open_link = function( url ) {
                                   log.add( 'GAR', url, null );
                                   $window.open( url, 'laclasseexterne' );
                               };

                               currentUser.ressources().then( function ( response ) {
                                   $scope.ressources_numeriques = response;
                               } );
                           } );
                   }
               ]
);
