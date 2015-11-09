angular.module( 'portailApp' )
    .service( 'logger',
	      [ '$http', '$state', '$q', 'APP_PATH', 'currentUser',
		function( $http, $state, $q, APP_PATH, currentUser ) {
		    this.log = function( app_id ) {
			var get_ip = _.memoize( function() {
			    return $http.get( 'https://api.ipify.org?format=json' );
			} );

			var user = null;
			var ip = null;
			var _user = currentUser.get( false )
				.then( function( response ) {
				    user = response;
				} );
			var _ip = get_ip()
				.then( function( response ) {
				    ip = response.data.ip;
				} );

			$q.all( [ _user, _ip ] )
			    .then( function(  ) {
				$http.post( APP_PATH + '/api/logger',
					    { ip: ip,
					      app_id: app_id,
					      uid: user.uid,
					      uai: user.profil_actif.etablissement_code_uai,
					      user_type: user.profil_actif.profil_id,
					      timestamp: Date.now(),
					      url: APP_PATH + $state.current.url,
					      params: _($state.params).map( function( value, key ) { return key + '=' + value; } ).join( '&' ) } );
			    } );
		    };
		}
	      ] );
