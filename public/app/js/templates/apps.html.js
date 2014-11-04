'use strict';
angular.module( 'portailApp' )
  .run( [ '$templateCache',
    function( $templateCache ) {
      $templateCache.put( 'views/apps.html',
                          '<div class="row damier">  <div data-ng-repeat="app in apps | orderBy:\'index\'"       class="col-xs-12 col-sm-6 col-md-3 col-lg-3 petite case animate scale-fade-in {{ app.couleur }}"       data-ng-if="current_user.is_logged">    <a data-ui-sref="app-wrapper({ app: app.id })"       data-ng-if="app.active"       title="{{ app.survol }}">      <span class="compteur-notification orange-brillant"	    data-ng-if="app.notifications > 0">{{app.notifications}}</span>      <img data-ng-src="{{prefix}}/{{app.icone}}"	   data-ng-if="app.icone"/>      <span class="app-name">{{ app.nom }}</span>    </a>  </div></div>' );     } ] );