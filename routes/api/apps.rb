# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Api
      module Apps
        # rubocop:disable Metrics/CyclomaticComplexity
        # rubocop:disable Metrics/PerceivedComplexity
        def self.registered( app )
          #
          # Service liste des applications
          #
          app.get "#{APP_PATH}/api/apps/default/?" do
            content_type :json

            return [] unless logged?

            AnnuaireWrapper::Apps.query_defaults
                                 .map do |appli|
              next if %w(ANNUAIRE ANN_ENT PORTAIL SSO STARTBOX).include? appli['id']

              default = config[:apps][:default][ appli['id'].to_sym ]

              appli.merge! default unless default.nil?

              appli[ 'application_id' ] = appli[ 'id' ]
              appli.delete( 'id' )
              appli[ 'type' ] = 'INTERNAL'

              appli
            end.compact.to_json
          end

          app.get "#{APP_PATH}/api/apps/?" do
            content_type :json

            is_it_summer_yet = !config.key?( :closed_for_summer ) || config[:closed_for_summer] ? 6 < Time.now.month && Time.now.month < 9 : false

            sleep 0.1 # FIXME, race condition

            return [] unless logged?

            apps = AnnuaireWrapper::Etablissement::Apps
                     .query_etablissement( user[:user_detailed]['profil_actif']['etablissement_code_uai'] )
            if apps.empty?
              apps = AnnuaireWrapper::Apps.query_defaults
                                          .map do |appli|
                default = config[:apps][:default][ appli['id'].to_sym ]
                next if default.nil?
                next unless default[:default]

                appli.merge!( default ) unless default.nil?

                appli[ 'application_id' ] = appli[ 'id' ]
                appli.delete( 'id' )
                appli[ 'type' ] = 'INTERNAL'

                Hash[ appli.map { |k, v| [k.to_sym, v] } ] # all keys to symbols
              end.compact

              apps.each { |appli| AnnuaireWrapper::Etablissement::Apps.create( user[:user_detailed]['profil_actif']['etablissement_code_uai'], appli ) }
            end

            apps.map do |application|
              default = config[:apps][:default][ application['application_id'].to_sym ] unless application['application_id'].nil?

              application[ 'hidden' ] = []

              unless default.nil?
                application[ 'icon' ] = default[ :icon ] if application[ 'icon' ].nil?
                application[ 'color' ] = default[ :color ] if application[ 'color' ].nil?
                application[ 'index' ] = default[ :index ] if application[ 'index' ] == -1

                # FIXME: ideally this should come from Annuaire
                application[ 'hidden' ] = default[ :hidden ]
              end

              # FIXME: ideally this should come from Annuaire
              application[ 'hidden' ] = default.nil? || default[ :hidden ].nil? ? [] : default[ :hidden ]

              application[ 'hidden' ] += %w(ELV TUT) if application['type'] == 'INTERNAL' && ( default.nil? || ( !default[:summer] && is_it_summer_yet ) )

              application
            end

            indexes = apps.map { |a| a['index'] }.sort
            duplicates = indexes.select { |e| indexes.count( e ) > 1 }.uniq
            free_indexes = (0..15).to_a - indexes

            duplicates.each do |i|
              next if free_indexes.empty?

              dup_app = apps.reverse.find { |a| a['index'] == i }
              dup_app['index'] = free_indexes.pop

              dup_app = Hash[ dup_app.map { |k, v| [k.to_sym, v] } ] # all keys to symbols

              AnnuaireWrapper::Etablissement::Apps.update( dup_app[:id], dup_app )
            end

            json apps
          end

          app.get "#{APP_PATH}/api/apps/:id" do
            content_type :json
            param :id, Integer, required: true

            return [] unless logged?

            json AnnuaireWrapper::Etablissement::Apps.app.get( params[:id] )
          end

          app.post "#{APP_PATH}/api/apps/?" do
            content_type :json
            param :index, Integer, required: true
            param :type, String, required: true, in: %w(INTERNAL EXTERNAL)
            param :application_id, String, required: false
            param :libelle, String, required: false
            param :description, String, required: false
            param :url, String, required: false
            param :active, TrueClass, required: false
            param :icon, String, required: false
            param :color, String, required: false

            json AnnuaireWrapper::Etablissement::Apps.create( user[:user_detailed]['profil_actif']['etablissement_code_uai'], params )
          end

          app.put "#{APP_PATH}/api/apps/:id" do
            content_type :json
            param :id, Integer, required: true
            param :index, Integer, required: true
            param :active, TrueClass, required: false
            param :url, String, required: false
            param :libelle, String, required: false
            param :description, String, required: false
            param :icon, String, required: false
            param :color, String, required: false

            json AnnuaireWrapper::Etablissement::Apps.update( params[:id], params )
          end

          app.delete "#{APP_PATH}/api/apps/:id" do
            content_type :json
            param :id, Integer, required: true

            json AnnuaireWrapper::Etablissement::Apps.delete( params[:id] )
          end
        end
        # rubocop:enable Metrics/PerceivedComplexity
        # rubocop:enable Metrics/CyclomaticComplexity
      end
    end
  end
end
