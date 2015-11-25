# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Api
      module Log
        def self.registered( app )
          # app.get "#{APP_PATH}/api/log/?" do
          #   AnnuaireWrapper::Log.query( params ).to_json
          # end

          app.get "#{APP_PATH}/api/log/stats/?" do
            stats = AnnuaireWrapper::Log.stats.to_json
            # if user[:user_detailed]['profil_actif']['etablissement_code_uai']

            # end

            stats
          end

          #
          # Tell Annuaire to log this
          #
          app.post "#{APP_PATH}/api/log/?" do
            # param :uid, String, required: true
            # param :uai, String, required: true
            # param :timestamp, BigNum, required: true
            # param :action, String, required: true
            # param :url, String, required: true
            # param :comment, String

            log_entry = JSON.parse( request.body.read )
            log_entry['ip'] = request.env[ 'HTTP_X_FORWARDED_FOR' ]
            AnnuaireWrapper::Log.add( log_entry )
          end
        end
      end
    end
  end
end
