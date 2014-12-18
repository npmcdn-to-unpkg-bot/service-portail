# -*- coding: utf-8 -*-

module Sinatra
  module Portail
    module Api
      module Apps
        def self.registered( app )

          #
          # Service liste des applications
          #
          app.get "#{APP_PATH}/api/apps/default/?" do
            content_type :json

            return [] unless is_logged? && !user.profil_actif.nil?

            AnnuaireWrapper::Apps.query_defaults
                                 .map do |app|
              default = config[:apps][:default][ app['id'].to_sym ]

              app.merge! default unless default.nil?

              app[ 'application_id' ] = app[ 'id' ]
              app.delete( 'id' )
              app[ 'type' ] = 'INTERNAL'

              app
            end.to_json
          end

          app.get "#{APP_PATH}/api/apps/?" do
            content_type :json

            STDERR.puts '/!\ FIXME WITH THE FORCE OF A THOUSAND SUNS!!!!'
            STDERR.puts '/!\ OH HAI!'
            STDERR.puts '/!\ U CAN HAZ APPS!'
            STDERR.puts '/!\ SO AWESOME!'
            STDERR.puts '/!\ Trève de plaisanterie ce pourrissage de log n\'a pour but'
            STDERR.puts '/!\ que de donner le temps aux bits d\'arriver à destination.'
            STDERR.puts '/!\ Dijkstra, pardonnez-leurs, ils ne savent pas ce qu\'ils font.'
            STDERR.puts '/!\ (désolé)'
            STDERR.puts '/!\ KTHXBYE.'

            return [] unless is_logged? && !user.profil_actif.nil?

            apps = AnnuaireWrapper::Etablissement::Apps.query_etablissement( user.profil_actif['uai'] )
                                                       .map do |app|
              default = config[:apps][:default][ app['application_id'].to_sym ] unless app['application_id'].nil?

              unless default.nil?
                app[ 'icon' ] = default[ :icon ] if app[ 'icon' ].nil?
                app[ 'color' ] = default[ :color ] if app[ 'color' ].nil?
                app[ 'index' ] = default[ :index ] if app[ 'index' ] == -1
              end

              app
            end

            indexes = apps.map { |a| a['index'] }.sort
            duplicates = indexes.select { |e| indexes.count( e ) > 1 }.uniq
            free_indexes = (0..15).to_a - indexes

            duplicates.each do |i|
              unless free_indexes.empty?
                app = apps.select { |a| a['index'] == i }.last
                STDERR.puts "From #{app['index']}... "
                app['index'] = free_indexes.pop
                STDERR.puts "... to #{app['index']}"

                AnnuaireWrapper::Etablissement::Apps.update( app['id'], app )
              end
            end

            apps.to_json
          end

          app.get "#{APP_PATH}/api/apps/:id" do
            content_type :json
            param :id, Integer, required: true

            return [] unless is_logged? && !user.profil_actif.nil?

            AnnuaireWrapper::Etablissement::Apps.app.get( params[:id] ).to_json
          end

          app.post "#{APP_PATH}/api/apps/?" do
            content_type :json
            param :index, Integer, required: true
            param :type, String, required: true, in: %w(INTERNAL EXTERNAL)
            param :application_id, String, required: false
            param :libelle, String, required: false
            param :description, String, required: false
            param :url, String, required: false
            param :active, Boolean, required: false
            param :icon, String, required: false
            param :color, String, required: false

            AnnuaireWrapper::Etablissement::Apps.create( user.profil_actif['uai'], params ).to_json
          end

          app.put "#{APP_PATH}/api/apps/:id" do
            content_type :json
            param :id, Integer, required: true
            param :index, Integer, required: true
            param :active, Boolean, required: false
            param :url, String, required: false
            param :libelle, String, required: false
            param :description, String, required: false
            param :icon, String, required: false
            param :color, String, required: false

            AnnuaireWrapper::Etablissement::Apps.update( params[:id], params ).to_json
          end

          app.delete "#{APP_PATH}/api/apps/:id" do
            content_type :json
            param :id, Integer, required: true

            AnnuaireWrapper::Etablissement::Apps.delete( params[:id] ).to_json
          end
        end
      end
    end
  end
end
