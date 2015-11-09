angular.module( 'portailApp' )
    .service( 'logger',
	      [ '$http', '$state', 'APP_PATH', 'currentUser',
		function( $http, $state, APP_PATH, currentUser ) {
		    this.log = function( app_id ) {
			currentUser.get( false )
			    .then( function( user ) {
				$http.post( APP_PATH + '/api/logger',
					    { app_id: app_id,
					      uid: user.uid,
					      uai: user.profil_actif.etablissement_code_uai,
					      user_type: user.profil_actif.profil_id,
					      timestamp: Date.now(),
					      url: APP_PATH + $state.current.url,
					      params: $state.params } );
			    } );
		    };
		}
	      ] );
