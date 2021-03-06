'use strict';

angular.module( 'portailApp' )
    .factory( 'User',
              [ '$resource', 'APP_PATH',
                function( $resource, APP_PATH ) {
                    return $resource( APP_PATH + '/api/user',
                                      { force_refresh: '@force_refresh' },
                                      { update: { method: 'PUT',
                                                  params: { nom: '@nom',
                                                            prenom: '@prenom',
                                                            sexe: '@sexe',
                                                            date_naissance: '@date_naissance',
                                                            adresse: '@adresse',
                                                            code_postal: '@code_postal',
                                                            ville: '@ville',
                                                            // login: '@login',
                                                            previous_password: '@previous_password',
                                                            new_password: '@new_password' //,
                                                            // bloque: '@bloque'
                                                          } },
                                        change_profil_actif: { method: 'PUT',
                                                               url: APP_PATH + '/api/user/profil_actif/:index',
                                                               params: { profil_id: '@profil_id' } }
                                      } );
                } ] );

angular.module( 'portailApp' )
    .factory( 'UserRessources',
              [ '$resource', 'APP_PATH',
                function( $resource, APP_PATH ) {
                    return $resource( APP_PATH + '/api/user/ressources_numeriques' );
                } ] );

angular.module( 'portailApp' )
    .factory( 'UserHelpLinks',
              [ '$resource', 'APP_PATH',
                function( $resource, APP_PATH ) {
                    return $resource( APP_PATH + '/api/user/help-links' );
                } ] );

angular.module( 'portailApp' )
    .factory( 'UserRegroupements',
              [ '$resource', 'APP_PATH',
                function( $resource, APP_PATH ) {
                    return $resource( APP_PATH + '/api/user/regroupements/:id',
                                      { id: '@id' },
                                      { eleves: { method: 'GET',
                                                  url: APP_PATH + '/api/user/regroupements/:id/eleves',
                                                  isArray: true } } );
                } ] );

angular.module( 'portailApp' )
    .service( 'currentUser',
              [ '$rootScope', '$http', '$resource', 'APP_PATH', 'User', 'UserRessources', 'UserRegroupements', 'UserHelpLinks',
                function( $rootScope, $http, $resource, APP_PATH, User, UserRessources, UserRegroupements, UserHelpLinks ) {
                    var user = null;

                    this.force_refresh = function( force_reload ) {
                        user = User.get( { force_refresh: force_reload } ).$promise;
                        user.then( function( response ) {
                            $rootScope.current_user = response;
                        } );
                    };
                    this.get = function( force_reload ) {
                        if ( _(user).isNull() || force_reload ) {
                            this.force_refresh( force_reload );
                        }
                        return user;
                    };

                    this.help_links = function() { return UserHelpLinks.query().$promise; };
                    this.ressources = function() { return UserRessources.query().$promise; };
                    this.regroupements = function() { return UserRegroupements.query().$promise; };
                    this.eleves_regroupement = function( id ) { return UserRegroupements.eleves( { id: id } ).$promise; };

                    this.avatar = { upload: function( file ) {
                        var fd = new FormData();
                        fd.append( 'image', file );
                        fd.append( 'fileFormDataName', 'image' );

                        return $http.post( APP_PATH + '/api/user/avatar', fd, {
                            transformRequest: angular.identity,
                            headers: { 'Content-Type': undefined }
                        } );
                    },
                                    delete: function() {
                                        return $http.delete( APP_PATH + '/api/user/avatar' );
                                    }
                                  };
                } ] );
