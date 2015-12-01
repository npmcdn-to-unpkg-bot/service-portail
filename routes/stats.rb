# -*- coding: utf-8 -*-

module Portail
  module Routes
    module Stats
      def self.registered( app )
        app.get "#{APP_PATH}/stats/?" do
          halt 401, 'Accès interdit' unless user_is_admin?

          erb :stats, layout: false
        end

        app.get "#{APP_PATH}/mstats/?" do
          halt 401, 'Accès interdit' unless user_is_admin?

          erb :materialstats, layout: false
        end
      end
    end
  end
end
