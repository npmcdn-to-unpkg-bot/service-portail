'use strict';
angular.module( 'portailApp' )
  .run( [ '$templateCache',
    function( $templateCache ) {
      $templateCache.put( 'views/index.html',
                          '<div class="portail">	<div class="main">		<div data-ui-view="main"></div>	</div>    <div class="aside">		<div class="scroller" style="position: relative">			<div class="logolaclasse gris4">				<a data-ng-click="go_home()">					<img draggable="false" data-ng-src="{{prefix}}/app/vendor/laclasse-common-client/images/logolaclasse.svg" />					<h3 class="hidden-xs hidden-sm">laclasse.com</h3>				</a>			</div>			<div class="user"				 data-ng-style="{ \'background-image\': \'url(\' + current_user.avatar + \')\' }">				<span class="user-info">					<a data-ui-sref="portail.user">						<h3 class="hidden-xs hidden-sm full-name">{{current_user.prenom}} {{current_user.nom}}</h3>						<h3 class="hidden-md hidden-lg initiales">{{current_user.prenom[0]}}{{current_user.nom[0]}}</h3>					</a>					<select class="gris4"						data-ng-controller="ProfilActifCtrl"						data-ng-model="current_user.profil_actif"						data-ng-change="reload()"						data-ng-options="profil as profil.etablissement_nom + \' : \' + profil.profil_nom group by profil.etablissement_nom for profil in current_user.profils track by profil.index" >					</select>					<a class="btn hidden-xs hidden-sm logout" data-ng-href="{{prefix}}/logout" title="Déconnexion de Laclasse.com">se déconnecter</a>				</span>				<span class="connect-register" data-ng-if="!current_user.is_logged">					<a href="{{prefix}}/login" title="Connexion avec Laclasse.com">se connecter</a>				</span>			</div>			<div class="news">				<ul class="hidden-xs hidden-sm"					data-ng-if="newsfeed"					rn-carousel					rn-carousel-auto-slide="5"					rn-carousel-buffered					rn-carousel-pause-on-hover					rn-carousel-controls-allow-loop					rn-carousel-controls					rn-carousel-index="news_index">					<li ng-repeat="slide in newsfeed | orderBy:\'pubDate\':true" active="slide.active">						<div class="news-image"							data-ng-style="{ \'background-image\': \'url({{slide.image ? slide.image : \'app/vendor/laclasse-common-client/images/logolaclasse.svg\' }})\' }"></div>						<div class="carousel-caption">							<span class="pub-date" data-ng-cloak>{{ slide.pubDate | date:\'medium\' }}</span>							<a href="{{ slide.link }}" target="_blank"><h6 data-ng-cloak>{{ slide.title }}</h6></a>							<p data-ng-bind-html="slide.trusted_description"></p>						</div>					</li>				</ul>				<div class="hidden-xs hidden-sm angular-carousel-indicators"					rn-carousel-indicators					data-ng-if="newsfeed.length > 1"					slides="newsfeed"					rn-carousel-index="news_index">				</div>			</div>		</div>		<span class="hidden-xs hidden-sm floating-button big toggle bouton-config-news blanc"			data-ng-if="current_user.profil_actif.admin"			data-ng-click="config_news_fluxes()"></span>    </div></div>' );     } ] );