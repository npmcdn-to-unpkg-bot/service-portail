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
            param :force_refresh, Sinatra::Param::Boolean, required: false

            return { user: '',
                     info: {},
                     is_logged: false }.to_json unless logged?

            init_current_user( user[:uid] ) if params.key?( :force_refresh ) && params[:force_refresh]

            uv = user_verbose
            uv['profil_actif']['etablissement_logo'] = AnnuaireWrapper::Etablissement.get( uv['profil_actif']['etablissement_code_uai'] )['logo']
            uv['profil_actif']['etablissement_logo'] = "#{URL_ENT}#{URL_ENT.split('').last == '/' ? '' : '/'}api/logos/#{uv['profil_actif']['etablissement_logo']}" unless uv['profil_actif']['etablissement_logo'].nil?

            uv.to_json
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
            param :previous_password,       String, required: false
            param :new_password, String, required: false
            # param :bloque,         TrueClass, required: false

            good_password = false
            if params[:previous_password]
              if AnnuaireWrapper::User.check_password( user[:login], params[:previous_password] )
                good_password = true
                params['password'] = params[:new_password]
              end
            end

            if good_password
              AnnuaireWrapper::User.put( user[:uid], params )

              init_current_user( user[:uid] )
            end

            utilisateur = user_verbose

            utilisateur[:wrong_password] = !good_password

            json utilisateur
          end

          app.post "#{APP_PATH}/api/user/avatar/?" do
            content_type :json

            AnnuaireWrapper::User::Avatar.update( user[:uid],
                                                  params[:image] ) if params[:image]

            init_current_user( user[:uid] )

            json user_verbose
          end

          app.delete "#{APP_PATH}/api/user/avatar/?" do
            content_type :json

            AnnuaireWrapper::User::Avatar.delete( user[:uid] )

            init_current_user( user[:uid] )

            json user_verbose
          end

          app.put "#{APP_PATH}/api/user/profil_actif/?" do
            content_type :json
            param :profil_id, String, required: true
            param :uai, String, required: true

            AnnuaireWrapper::User.put_profil_actif( user[:uid],
                                                    params[:profil_id],
                                                    params[:uai] )

            init_current_user( user[:uid] )

            json user_verbose
          end

          #
          # Classes et groupes de l'utilisateur
          #
          app.get "#{APP_PATH}/api/user/regroupements/?" do
            content_type :json

            regroupements = AnnuaireWrapper::User::Regroupements.query( user[:uid] )
            regroupements = [ regroupements[ 'classes' ],
                              regroupements[ 'groupes_eleves' ] ]
                              .flatten
                              .reject do |regroupement|
              regroupement[ 'etablissement_code' ] != user[:user_detailed]['profil_actif']['etablissement_code_uai']
            end
                              .each do |regroupement|
              regroupement[ 'id' ] =  regroupement.key?( 'classe_id' ) ? regroupement['classe_id'] : regroupement['groupe_id']
              regroupement[ 'libelle' ] = regroupement.key?( 'classe_libelle' ) ? regroupement['classe_libelle'] : regroupement['groupe_libelle']
              regroupement[ 'type' ] = regroupement.key?( 'classe_id' ) ? 'classe' : 'groupe_eleve'
            end
                              .uniq { |regroupement| regroupement['id'] }
                              .sort_by { |regroupement| regroupement['libelle'].to_s }
                              .reverse
                              .map do |regroupement|
              { libelle: regroupement['libelle'],
                id: regroupement['id'],
                etablissement_nom: regroupement['etablissement_nom'],
                type: regroupement['type'] }
            end

            json regroupements
          end

          #
          # Élèves des Classes et groupes de l'utilisateur
          #
          app.get "#{APP_PATH}/api/user/regroupements/:id/eleves" do
            content_type :json

            eleves = AnnuaireWrapper::Etablissement
                       .regroupement_detail( params[:id] )['eleves']
                       .map do |eleve|
              eleve[ 'avatar' ] = "#{ANNUAIRE[:url]}/avatar/#{eleve[ 'avatar' ]}"

              eleve
            end

            json eleves
          end

          #
          # Ressources numériques de l'utilisateur
          #
          app.get "#{APP_PATH}/api/user/ressources_numeriques/?" do
            content_type :json

            # Ne prendre que les ressources de l'établissement courant.
            # Qui sont dans la fenêtre d'abonnement
            # Triées sur les types de ressources desc pour avoir 'MANUEL' en premier, puis 'DICO', puis 'AUTRES'
            ressources = AnnuaireWrapper::User::Ressources.query( user[:uid] )
                                                          .reject do |ressource|
              ressource[ 'etablissement_code_uai' ] != user[:user_detailed]['profil_actif']['etablissement_code_uai'] ||
                Date.parse( ressource['date_deb_abon'] ) >= Date.today ||
                Date.parse( ressource['date_fin_abon'] ) <= Date.today
            end
                                                          .sort_by { |ressource| ressource['type_ressource'].to_s }
                                                          .reverse_each do |ressource|
              ressource['icone'] = '08_ressources.svg'
              ressource['icone'] = '05_validationcompetences.svg'  if ressource['type_ressource'] == 'MANUEL'
              ressource['icone'] = '07_blogs.svg'                  if ressource['type_ressource'] == 'AUTRE'
            end

            # Associer les couleurs des carrés
            json colorize( ressources )
          end

          #
          # Lien d'aide contextuels
          #
          app.get "#{APP_PATH}/api/user/help-links/?" do
            content_type :json

            links = config[:help_links].select do |link|
              link[:profils].include?( user[:user_detailed]['profil_actif']['profil_id'] )
            end

            json links
          end
        end
      end
    end
  end
end
