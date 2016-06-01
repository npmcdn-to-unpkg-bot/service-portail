require 'rspec'
require 'rack/test'
require 'capybara/rspec'
require 'capybara/poltergeist'

ENV['RACK_ENV'] = 'development'

require_relative '../config/init'
require_relative '../app'

RSpec.configure do |config|
  config.include Capybara::DSL
  config.include Capybara::RSpecMatchers
end

Capybara.app = Rack::Builder.new do eval File.read( 'config.ru' ) end # rubocop:disable Lint/Eval
Capybara.javascript_driver = :poltergeist
