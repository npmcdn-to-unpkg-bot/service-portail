# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Api
      module Logger
        def self.registered( app )
          #
          # Tell Annuaire to log this
          #
          app.post "#{APP_PATH}/api/logger/?" do
            # param :uid, String, required: true
            # param :uai, String, required: true
            # param :timestamp, BigNum, required: true
            # param :action, String, required: true
            # param :url, String, required: true
            # param :comment, String

            log_entry = JSON.parse( request.body.read )
            log_entry[:ip] = request.env[ 'HTTP_X_FORWARDED_FOR' ]
            AnnuaireWrapper::Logger.add( log_entry )
          end
        end
      end
    end
  end
end
