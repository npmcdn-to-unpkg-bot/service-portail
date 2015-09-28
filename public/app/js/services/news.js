'use strict';

angular.module( 'portailApp' )
    .service('news',
	     [ '$http', 'APP_PATH',
	       function( $http, APP_PATH ) {
		   var news = null;
		   this.get = function( force_reload ) {
		       if ( _(news).isNull() || force_reload ) {
			   news = $http.get( APP_PATH + '/api/news' );
		       }

		       return news;
		   };
	       } ] );
