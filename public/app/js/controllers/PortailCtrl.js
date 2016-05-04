/*
 * Controleur de la page publique
 */
'use strict';

angular.module( 'portailApp' )
    .controller( 'PortailCtrl',
                 [ '$scope', '$rootScope', '$sce', '$state', '$uibModal', 'moment', 'toastr', 'current_user', 'APP_PATH', 'RANDOM_IMAGES', 'news',
                   function( $scope, $rootScope, $sce, $state, $uibModal, moment, toastr, current_user, APP_PATH, RANDOM_IMAGES, news ) {
                       $scope.prefix = APP_PATH;
                       $scope.current_user = current_user;

                       $scope.go_home = function() {
                           $state.go( 'portail.logged' );
                       };

                       // TODO : faire une factory et un service pour les annonces.
                       // L'idée est d'aller lire le flux twitter @laclasse avec le hash #sys
                       $scope.annonce = ""; //"En moment sur Laclasse.com : La version 3 sort des cartons !";
                       $scope.newsfeed = [];

                       var retrieve_news = function( force_reload ) {
                           news.get( force_reload )
                               .then( function( response ) {
                                   $scope.newsfeed = _(response.data).map( function( item, index ) {
                                       item.id = index;
                                       item.trusted_description = $sce.trustAsHtml( item.description );
                                       item.no_image = _(item.image).isNull();
                                       if ( item.no_image ) {
                                           item.image = item.title == 'Publipostage' ? APP_PATH + '/app/vendor/laclasse-common-client/images/11_publipostage.svg' : _(RANDOM_IMAGES).sample();
                                       }

                                       return item;
                                   });

                                   $scope.carouselIndex = 0;
                               });
                       };

                       $scope.config_news_fluxes = function() {
                           $uibModal.open( {
                               templateUrl: 'views/popup_config_news_fluxes.html',
                               controller: 'PopupConfigNewsFluxesCtrl'
                           } )
                               .result.then( function() {
                                   retrieve_news( true );
                               } );
                       };

                       retrieve_news( false );

                       if ( $scope.current_user.default_password ) {
                           $uibModal.open( {
                               templateUrl: 'views/popup_change_password.html',
                               resolve: { current_user: function() { return current_user; } },
                               controller: [ '$scope', '$uibModalInstance', 'current_user',
                                             function( $scope, $uibModalInstance, current_user ) {
                                                 $scope.current_user = current_user;

                                                 $scope.fermer = function( sauvegarder ) {
                                                     var password_confirmed = true;
                                                     if ( !_($scope.password.old).isEmpty() && !_($scope.password.new1).isEmpty() ) {
                                                         if ( $scope.password.new1 == $scope.password.new2 ) {
                                                             $scope.current_user.previous_password = $scope.password.old;
                                                             $scope.current_user.new_password = $scope.password.new1;
                                                         } else {
                                                             password_confirmed = false;
                                                             toastr.error( 'Confirmation de mot de passe incorrecte.',
                                                                           'Erreur',
                                                                           { timeout: 100000 } );
                                                         }
                                                     }

                                                     if ( password_confirmed ) {
                                                         $scope.current_user.$update()
                                                             .then( function() {
                                                                 $uibModalInstance.close( $scope );
                                                             } );
                                                     }
                                                 };
                                             } ],
                               backdrop: 'static',
                               keyboard: false
                           } )
                               .result.then( function( scope_popup ) {
                                   $scope.current_user = scope_popup.current_user;
                               } );
                       }
                   }
                 ] );
