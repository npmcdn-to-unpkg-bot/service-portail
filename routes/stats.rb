# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Stats
      def self.registered( app )
        app.get "#{APP_PATH}/stats/?" do
          user_needs_to_be( %w( DIR ), true )

          erb :stats, layout: false
        end
      end
    end
  end
end
