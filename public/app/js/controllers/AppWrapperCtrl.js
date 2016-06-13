'use strict';

angular.module( 'portailApp' )
    .controller( 'AppWrapperCtrl',
                 [ '$scope', '$rootScope', '$state', 'APP_PATH', 'current_user',
                   function ( $scope, $rootScope, $state, APP_PATH, current_user ) {
                       $scope.iOS = ( navigator.userAgent.match( /iPad/i ) !== null ) || ( navigator.userAgent.match( /iPhone/i ) !== null );
                       $scope.prefix = APP_PATH;

                       $scope.go_home = function() {
                           $state.go( 'portail.logged' );
                       };
                   }
                 ] );
