'use strict';

angular.module( 'portailApp' )
    .controller( 'ProfilActifCtrl',
                 [ '$scope', '$rootScope', '$state', '$stateParams', 'currentUser', 'apps',
                   function( $scope, $rootScope, $state, $stateParams, currentUser, apps ) {
                       $scope.reload = function() {
                           $rootScope.current_user.$change_profil_actif( { profil_id: $scope.current_user.profil_actif.profil_id,
                                                                           uai: $scope.current_user.profil_actif.etablissement_code_uai } )
                               .then( function() {
                                   apps.nullify();
                                   $state.transitionTo( $state.current, $stateParams, { reload: true, inherit: true, notify: true } );
                               });
                       };
                   } ] );
