# coding: utf-8

require_relative '../spec_helper'

feature SinatraApp do
  include Rack::Test::Methods

  def app
    SinatraApp.new
  end

  scenario '/api/version' do
    get 'http://localhost:9292/portail/api/version', {}, 'rack.session' => MOCKED_LOGGED_RACK_SESSION

    expect( last_response.body ).to eq APP_VERSION
  end
end
