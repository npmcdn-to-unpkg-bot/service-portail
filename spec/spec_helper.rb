require 'simplecov'

require 'rspec'
require 'rack/test'
require 'capybara/rspec'
require 'capybara/poltergeist'

ENV['RACK_ENV'] = 'development'

require_relative '../config/init'
require_relative '../app'

# Requires supporting ruby files with custom matchers and macros, etc,
# from spec/support/ and its subdirectories.
Dir[File.expand_path('spec/support/**/*.rb')].each { |f| require f }

RSpec.configure do |config|
  config.include Capybara::DSL
  config.include Capybara::RSpecMatchers
end

Capybara.app = SinatraApp
Capybara.javascript_driver = :poltergeist
