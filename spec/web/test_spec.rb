# coding: utf-8
require 'rspec'
require 'watir'

browser = Watir::Browser.new

RSpec.configure do |config|
  config.before(:each) { @browser = browser }
  config.after(:suite) { browser.close unless browser.nil? }
end

describe 'a simple demonstration of watir and RSpec' do
  before(:each) do
    @browser.goto( 'http://localhost:9292/portail/inscription_CCN_2016/index.html' )
  end

  it 'should include the title' do
    expect( @browser.text ).to include('PRÉ-INSCRIPTIONS POUR LA RENTRÉE 2016-2017 !')
  end
end
