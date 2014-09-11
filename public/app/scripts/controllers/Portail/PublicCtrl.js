/* 
 * Controleur de la page publique 
 */
'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailPublicCtrl',
		 [ '$scope', 'currentUser', 'APP_PATH',
		   function( $scope, currentUser, APP_PATH ) {
		       $scope.prefix = APP_PATH;
                       // TODO : faire une factory et un service pour les annonces.
                       // L'idée est d'aller lire le flux twitter @laclasse avec le hash #sys
                       $scope.annonce = ""; //"En moment sur Laclasse.com : La version 3 sort des cartons !";
		       currentUser.get().then( function( response ) {
			   $scope.current_user = response;
console.debug($scope.current_user);
			   if ( $scope.current_user.is_logged ) {
			       currentUser.apps().then( function( response ) {
				   $scope.apps = response;
			       });
			   }
		       });
		   } ] );


