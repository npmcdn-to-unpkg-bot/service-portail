'use strict';

angular.module( 'portailApp' )
    .controller( 'RessourcesNumeriquesCtrl',
		 [ '$scope', 'currentUser', 'APP_PATH', 'logger',
		   function( $scope, currentUser, APP_PATH, logger ) {
		       $scope.prefix = APP_PATH;

		       $scope.log_external_link = function( url ) {
			   logger.log( url, null );
		       };

		       currentUser.ressources().then( function ( response ) {
			   $scope.ressources_numeriques = response;
		       } );
		   }
		 ]
	       );
