# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Api
      module Logger
        def self.registered( app )
          #
          # renvoi la version du portail
          #
          app.post "#{APP_PATH}/api/logger/?" do
            params = JSON.parse( request.body.read )

            # param :uid, String, required: true
            # param :uai, String, required: true
            # param :timestamp, BigNum, required: true
            # param :action, String, required: true
            # param :url, String, required: true
            # param :comment, String

            LOGGER.info params

            nil
          end
        end
      end
    end
  end
end
