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

		       $scope.actions = {
			   regroupement: [
			       {
				   glyphicon: 'envelope',
				   do: function( regroupement ) {
				       console.log( 'Gonna send a nice email to ' + regroupement.libelle );
				   }
			       },
			       {
				   glyphicon: 'calendar',
				   do: function( regroupement ) {
				       console.log( 'Gonna show the CTXT for ' + regroupement.libelle );
				   }
			       }
			   ],
			   people: [
			       {
				   glyphicon: 'envelope',
				   do: function( people ) {
				       console.log( 'Gonna send a nice email to ' + people.prenom + ' ' + people.nom );
				   }
			       },
			       {
				   glyphicon: 'refresh',
				   do: function( people ) {
				       console.log( 'Gonna show the SUIVI for ' + people.prenom + ' ' + people.nom );
				   }
			       }
			   ]
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
