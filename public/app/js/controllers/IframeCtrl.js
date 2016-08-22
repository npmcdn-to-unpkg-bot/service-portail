'use strict';

angular.module( 'portailApp' )
    .controller( 'IframeCtrl',
                 [ '$scope', '$stateParams', '$sce', '$state', 'apps',
                   function ( $scope, $stateParams, $sce, $state, apps ) {
                       apps.query()
                           .then( function ( response ) {
                               // Toutes les applications en iframe
                               var app = _( response ).findWhere( { application_id: $stateParams.app } );

                               if ( _(app).isUndefined() ) {
                                   $state.go( 'portail.logged', {}, { reload: true, inherit: true, notify: true } );
                               } else {
                                   $scope.app = { nom: app.nom,
                                                  url: $sce.trustAsResourceUrl( app.url ) };
                               }
                           } );
                   }
                 ] );
