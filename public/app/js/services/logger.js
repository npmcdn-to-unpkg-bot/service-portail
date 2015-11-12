angular.module( 'portailApp' )
    .service( 'logger',
	      [ '$http', '$state', 'APP_PATH', 'currentUser',
		function( $http, $state, APP_PATH, currentUser ) {
		    this.log = function( url, params ) {
			currentUser.get( false )
			    .then( function( user ) {
				$http.post( APP_PATH + '/api/logger',
					    { app: 'PORTAIL',
					      uid: user.uid,
					      uai: user.profil_actif.etablissement_code_uai,
					      user_type: user.profil_actif.profil_id,
					      timestamp: Date.now(),
					      url: _(url).isNull() ? APP_PATH + $state.current.url: url,
					      params: _(params).isNull() ? _($state.params).map( function( value, key ) { return key + '=' + value; } ).join( '&' ) : params } );
			    } );
		    };
		}
	      ] );
