'use strict';

angular.module( 'portailApp.controllers' )
    .controller( 'PortailAppsDamierCtrl',
		 [ '$scope', 'currentUser', 'news', 'APPLICATION_PREFIX',
		   function( $scope, currentUser, news, APPLICATION_PREFIX ) {

		       $scope.racine_images = '/app/bower_components/charte-graphique-laclasse-com/images/';
		       $scope.couleurs = [ 'bleu',
					   'vert',
					   'rouge',
					   'violet',
					   'orange',
					   'jaune',
					   'gris1',
					   'gris2',
					   'gris3',
					   'gris4' ];

		       $scope.apps = [ { id: 'messagerie',
					 icone: $scope.racine_images + '01_messagerie.svg',
					 couleur: 'bleu',
					 nom: 'messagerie',
					 lien: '/portail/#/show-app?app=messagerie',
					 notifications: [  ],
					 active: false
				       },
				       { id: 'documents',
					 icone: $scope.racine_images + '02_documents.svg',
					 couleur: 'jaune',
					 nom: 'documents',
					 lien: '/portail/#/show-app?app=documents',
					 notifications: [  ],
					 active: false
				       },
				       { id: 'cahierdetextes',
					 icone: $scope.racine_images + '03_cahierdetextes.svg',
					 couleur: 'violet',
					 nom: 'cahier de textes',
					 lien: '/portail/#/show-app?app=cahierdetextes',
					 notifications: [  ],
					 active: false
				       },
				       { id: 'notesabsences',
					 icone: $scope.racine_images + '04_notesabsences.svg',
					 couleur: 'vert',
					 nom: 'notes et absences',
					 lien: '/portail/#/show-app?app=notesabsences',
					 notifications: [  ],
					 active: false
				       },
				       { id: 'validationcompetences',
					 icone: $scope.racine_images + '05_validationcompetences.svg',
					 couleur: 'rouge',
					 nom: 'validation de compétences',
					 lien: '/portail/#/show-app?app=validationcompetences',
					 notifications: [  ],
					 active: false
				       },
				       { id: 'thematiques',
					 icone: $scope.racine_images + '06_thematiques.svg',
					 couleur: 'vert',
					 nom: 'classes culturelles numériques',
					 lien: '/portail/#/show-app?app=thematiques',
					 notifications: [  ],
					 active: false
				       },
				       { id: 'blogs',
					 icone: $scope.racine_images + '07_blogs.svg',
					 couleur: 'bleu',
					 nom: 'blogs',
					 lien: '/portail/#/show-app?app=blogs',
					 notifications: [  ],
					 active: false
				       },
				       { id: 'ressources',
					 icone: $scope.racine_images + '08_ressources.svg',
					 couleur: 'jaune',
					 nom: 'ressources numériques',
					 lien: '/portail/#/show-app?app=ressources',
					 notifications: [  ],
					 active: false
				       },
				       { id: 'trombi',
					 icone: $scope.racine_images + '09_trombi.svg',
					 couleur: 'violet',
					 nom: 'trombinoscope',
					 lien: '/portail/#/show-app?app=trombi',
					 notifications: [  ],
					 active: false
				       },
				       { id: 'suivi',
					 icone: $scope.racine_images + '10_suivi.svg',
					 couleur: 'bleu',
					 nom: 'suivi des élèves',
					 lien: '/portail/#/show-app?app=suivi',
					 notifications: [  ],
					 active: false
				       },
				       { id: 'publipostage',
					 icone: $scope.racine_images + '11_publipostage.svg',
					 couleur: 'jaune',
					 nom: 'info familles',
					 lien: '/portail/#/show-app?app=publipostage',
					 notifications: [  ],
					 active: false
				       },
				       { id: 'aide',
					 icone: $scope.racine_images + '12_aide.svg',
					 couleur: 'rouge',
					 nom: 'aide',
					 lien: '/portail/#/show-app?app=aide',
					 notifications: [  ],
					 active: false
				       },
				       { id: 'admin',
					 icone: $scope.racine_images + '13_admin.svg',
					 couleur: 'jaune',
					 nom: 'administration',
					 lien: '/portail/#/show-app?app=admin',
					 notifications: [  ],
					 active: false
				       },
				       { id: '',
					 icone: '',
					 couleur: 'rouge',
					 nom: '',
					 lien: '',
					 notifications: [  ],
					 active: true
				       },
				       { id: '',
					 icone: '',
					 couleur: 'vert',
					 nom: '',
					 lien: '',
					 notifications: [  ],
					 active: true
				       },
				       { id: 'horloge',
					 icone: '',
					 couleur: 'bleu',
					 nom: '',
					 lien: '',
					 notifications: [  ],
					 active: true
				       }
				     ];

		       currentUser.get().then( function( response ) {
			   $scope.current_user = response.data;

			   if ( $scope.current_user.is_logged ) {
			       // FIXME: utiliser de vraies données
			       _($scope.apps).each( function( app ) {
				   app.active = true;
				   if ( app.lien !== '') {
				       app.notifications = [ 1, 2 ];
				   }
			       });
			   }
		       });

		   } ] );