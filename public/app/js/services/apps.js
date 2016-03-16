'use strict';

angular.module( 'portailApp' )
    .factory( 'Apps',
              [ '$resource', 'APP_PATH',
                function( $resource, APP_PATH ) {
                    return $resource( APP_PATH + '/api/apps/:id',
                                      { id              : '@id',
                                        application_id	: '@application_id',
                                        index		: '@index',
                                        type		: '@type',
                                        libelle		: '@libelle',
                                        description	: '@description',
                                        url		: '@url',
                                        active		: '@active',
                                        icon		: '@icon',
                                        color		: '@color' },
                                      { update: { method: 'PUT' },
                                        query_default: { methode: 'GET',
                                                         url: APP_PATH + '/api/apps/default/',
                                                         isArray: true } } );
                } ] );

angular.module( 'portailApp' )
    .service( 'apps',
              [ 'Apps',
                function( Apps ) {
                    var _this = this;
                    this.apps = null;

                    this.query = function( force_reload ) {
                        if ( _(_this.apps).isNull() || force_reload ) {
                            _this.apps = Apps.query().$promise;
                        }

                        return _this.apps;
                    };

                    this.nullify = function() {
                        _this.apps = null;
                    };
                }
              ] );
