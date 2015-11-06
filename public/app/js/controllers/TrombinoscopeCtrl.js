'use strict';

angular.module( 'portailApp' )
    .controller( 'TrombinoscopeCtrl',
		 [ '$scope', '$state', 'currentUser', 'COULEURS',
		   function( $scope, $state, currentUser, COULEURS ) {
		       $scope.filters = {
			   regroupements_types: { classes: true,
						  groupes_eleves: false },
			   text: { regroupement: '',
				   user: '' },
			   order_asc: true
		       };

		       currentUser.regroupements().then( function ( response ) {
			   $scope.regroupements = response;

			   $scope.showElevesRegroupement = function( regroupement ) {
			       $scope.regroupement = regroupement;
			       currentUser.eleves_regroupement( regroupement.id )
				   .then( function( response ) {
				       $scope.eleves = response;
				   } );
			   };

			   $scope.retour = function() {
			       $scope.eleves = undefined;
			       $scope.regroupement = undefined;
			   };
		       });
		   }
		 ]
	       );
