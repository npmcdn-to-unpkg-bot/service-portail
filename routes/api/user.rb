# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Api
      module User
        def self.registered( app )
          #
          # Gestion de session côtế client
          #
          app.get "#{APP_PATH}/api/user" do
            content_type :json

            return { user: '',
                     info: {},
                     is_logged: false }.to_json unless logged?

            user.full( env ).to_json
          end

          app.put "#{APP_PATH}/api/user" do
            content_type :json
            param :nom,            String,  required: false
            param :prenom,         String,  required: false
            param :sexe,           String,  required: false, in: %w(F M)
            param :date_naissance, Date,    required: false
            param :adresse,        String,  required: false
            param :code_postal,    Integer, required: false, within: 0..999_999
            param :ville,          String,  required: false
            # param :login,          String,  required: false
            # param :password,       String,  required: false
            # param :bloque,         TrueClass, required: false

            AnnuaireWrapper::User.put( user.uid,
                                       params )

            set_current_user( user.uid )

            user.full( env ).to_json
          end

          app.post "#{APP_PATH}/api/user/avatar/?" do
            content_type :json

            AnnuaireWrapper::User.put_avatar( user.uid,
                                              params[:image] ) if params[:image]

            set_current_user( user.uid )

            user.full( env ).to_json
          end

          app.delete "#{APP_PATH}/api/user/avatar/?" do
            content_type :json

            AnnuaireWrapper::User.delete_avatar( user.uid )

            set_current_user( user.uid )

            user.full( env ).to_json
          end

          app.put "#{APP_PATH}/api/user/profil_actif/?" do
            content_type :json
            param :profil_id, String, required: true
            param :uai, String, required: true

            AnnuaireWrapper::User.put_profil_actif( user.uid,
                                                    params[:profil_id],
                                                    params[:uai] )

            set_current_user( user.uid )

            user.full( env ).to_json
          end

          #
          # Classes et groupes de l'utilisateur
          #
          app.get "#{APP_PATH}/api/user/regroupements/?" do
            content_type :json

            regroupements = AnnuaireWrapper::User.get_regroupements( user.uid )
            regroupements = [ regroupements[ 'classes' ],
                              regroupements[ 'groupes_eleves' ] ]
                            .flatten
                            .reject { |regroupement| regroupement[ 'etablissement_code' ] != user.profil_actif['uai'] }
                            .each { |regroupement|
              regroupement[ 'id' ] =  regroupement.key?( 'classe_id' ) ? regroupement['classe_id'] : regroupement['groupe_id']
              regroupement[ 'libelle' ] =  regroupement.key?( 'classe_libelle' ) ? regroupement['classe_libelle'] : regroupement['groupe_libelle']
            }
                            .uniq { |regroupement| regroupement['id'] }
                            .sort_by { |regroupement| regroupement['libelle'].to_s }
                            .reverse
                            .map { |regroupement|
              { libelle: regroupement['libelle'],
                id: regroupement['id'],
                etablissement_nom: regroupement['etablissement_nom'] } }

            # Associer les couleurs des carrés
            colorize( regroupements ).to_json
          end

          #
          # Élèves des Classes et groupes de l'utilisateur
          #
          app.get "#{APP_PATH}/api/user/regroupements/:id/eleves" do
            content_type :json

            eleves = AnnuaireWrapper::Etablissement.regroupement_detail( params[:id] )['eleves']
                                                   .map { |eleve|
              eleve[ 'avatar' ] = ANNUAIRE[:url].gsub( %r{/api}, '/' ) + eleve[ 'avatar' ]

              eleve
            }

            colorize( eleves ).to_json
          end

          #
          # Ressources numériques de l'utilisateur
          #
          app.get "#{APP_PATH}/api/user/ressources_numeriques/?" do
            content_type :json

            # Ne prendre que les ressources de l'établissement courant.
            # Qui sont dans la fenêtre d'abonnement
            # Triées sur les types de ressources desc pour avoir 'MANUEL' en premier, puis 'DICO', puis 'AUTRES'
            ressources = AnnuaireWrapper::User.get_resources( user.uid )
                                              .reject { |ressource| ressource[ 'etablissement_code_uai' ] != user.profil_actif['uai'] ||
                                                        Date.parse( ressource['date_deb_abon'] ) >= Date.today ||
                                                        Date.parse( ressource['date_fin_abon'] ) <= Date.today }
                                              .sort_by { |ressource| ressource['type_ressource'].to_s }
                                              .reverse
                                              .each { |ressource|
              ressource['icone'] = '08_ressources.svg'
              ressource['icone'] = '05_validationcompetences.svg'  if ressource['type_ressource'] == 'MANUEL'
              ressource['icone'] = '07_blogs.svg'                  if ressource['type_ressource'] == 'AUTRE'
            }

            # Associer les couleurs des carrés
            colorize( ressources ).to_json
          end
        end
      end
    end
  end
end