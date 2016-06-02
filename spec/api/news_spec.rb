# coding: utf-8

require_relative '../spec_helper'

feature SinatraApp do
  include Rack::Test::Methods

  def app
    SinatraApp.new
  end

  before :all do
    module AnnuaireWrapper
      module Etablissement
        module Flux
          module_function

          def query_etablissement( uai )
            { whatever: uai }.to_json
          end
        end
      end
    end
    module User
      module News
        module_function

        def query( _uid )
          'http://www.feedforall.com/sample-feed.xml'
        end
      end
    end
  end

  scenario '/api/news' do
    # get 'http://localhost:9292/portail/api/news', {}, 'rack.session' => MOCKED_LOGGED_RACK_SESSION
    # p JSON.parse( last_response.body )
    # expect( last_response.body ).to eq APP_VERSION
  end
end
