# coding: utf-8

require 'rubygems'
require 'bundler'
require 'sinatra/reloader'
require 'open-uri'
require 'uri'
require 'json'
require 'yaml'

Bundler.require( :default, ENV['RACK_ENV'].to_sym )     # require tout les gems définis dans Gemfile

require_relative './config/options'
require_relative './lib/AuthenticationHelpers'
require_relative './lib/ConfigHelpers'
require_relative './lib/annuaire'

# https://gist.github.com/chastell/1196800
class Hash
  def to_html
    [ '<ul>',
      map { |k, v|
        [ "<li><strong>#{k}</strong> : ", v.respond_to?(:to_html) ? v.to_html : "<span>#{v}</span></li>" ]
      },
      '</ul>'
    ].join
  end
end

# Application Sinatra servant de base
class SinatraApp < Sinatra::Base
  @ent_notifs=[]

  configure do
    set :app_file, __FILE__
    set :root, APP_ROOT
    set :public_folder, proc { File.join( root, 'public' ) }
    set :inline_templates, true
    set :protection, true #, except: :frame_options
  end

  configure :development do
    register Sinatra::Reloader
    # also_reload '/path/to/some/file'
    # dont_reload '/path/to/other/file'
  end

  helpers AuthenticationHelpers
  helpers ConfigHelpers

  # routes
  get "#{APP_PATH}/" do
    erb :app
  end

  # {{{ API
  #
  # Gestion de session côtế client
  #
  get "#{APP_PATH}/api/user" do
    return { user: '',
      info: { },
      is_logged: false }.to_json unless session[:authenticated]

    session[:current_user][:is_logged] = true
    user_annuaire = Annuaire.get_user( session[:current_user][:info][:uid] )
    session[:current_user][:sexe] = user_annuaire[:sexe]
    session[:current_user][:ENTStructureNomCourant] = user_annuaire[:ENTStructureNomCourant]
    session[:current_user][:profils] = user_annuaire['profils'].map.with_index {
      |profil, i|
      { index: i,
        type: profil['profil_id'],
        uai: profil['etablissement_code_uai'],
        etablissement: profil['etablissement_nom'],
        nom: profil['profil_nom'] }
    }
    session[:current_user][:profil_actif] = 0

    session[:current_user].to_json
  end
  
  put "#{APP_PATH}/api/user/profil_actif/:index" do
    session[:current_user][:profil_actif] = params[ :index ].to_i

    session[:current_user].to_json
  end

  #
  # Agrégateur RSS
  #
  get "#{APP_PATH}/api/news" do
    rss = SimpleRSS.parse open( config[:url_news] )

    rss.items
    .first( 10 )
    .map { |news|     
      news.each { |k,v| news[k] = news[k].force_encoding("UTF-8").encode! if news[k].is_a? String }
      news[:description] = news[:content_encoded] if news.has? :content_encoded
      news[:image] = news[:content]

      news
    }.to_json
  end

  #
  # Configuration des canaux de notifications
  #
  get "#{APP_PATH}/api/notifications" do
    #redirect login! unless session[:authenticated]
    if is_logged?
      profil=session[:current_user][:info].ENTPersonProfils.split(":")[0]
      uai=session[:current_user][:info].ENTPersonProfils.split(":")[1]
      etb=Annuaire.get_etablissement(uai)
      opts= { :serveur =>"http://localhost:9292/#{APP_PATH}/faye", 
        :profil => profil,  
        :uai => uai,  
        :uid => session[:current_user][:info].uid,  
        :classes => etb["classes"].map{ |c| c["libelle"]},
        :groupes => etb["groupes_eleves"].map{ |g| g["libelle"]},
        :groupes_libres => etb["groupes_libres"].map{ |g| g["libelle"]}
      }
      @ent_notifs=EntNotifs.new opts
      #### @ent_notifs.notifier(:moi, "Salut tous le monde !")
      @ent_notifs.my_channels.to_json
    end
  end

  #
  # Service liste des applications
  #
  get "#{APP_PATH}/api/apps" do
    user_applications = Annuaire.get_user( session[:current_user][:info][:uid] )['applications']
    # traitement des apps renvoyées par l'annuaire
    user_applications.each { |application|
      config_apps = config[ :apps_tiles ][ application[ 'id' ] ]
      unless config_apps.nil?
        # On regarde si le profils actif de l'utilisateur comporte le code détablissement pour lequel l'application est activée
        config_apps[ :active ] = application[ 'active' ] && application[ 'etablissement_code_uai' ] == session[:current_user][:profils][ session[:current_user][:profil_actif] ][:uai]
        config_apps[ :nom ] = application[ 'libelle' ]
        config_apps[ :survol ] = application[ 'description' ]
        config_apps[ :lien ] = "/portail/#/show-app?app=#{application[ 'id' ]}"
        url = "#{application[ 'url' ]}"
        url = ENT_SERVER + url unless application[ 'url' ].to_s.start_with? "http"
        config_apps[ :url ] = url
        # Gérer les notifications sur chaque application
        config_apps[ :notifications ] = 0
        # THINK : Peut-être qu'il faut faire ce travail côté client AngularJS, afin de le rendre asynchrone et non bloquant.
        unless config_apps[ :url_notif ].empty?
          resp = Net::HTTP.get_response(URI.parse config_apps[ :url_notif ])
          config_apps[ :notifications ] = resp.body if resp.body.is_a? Numeric
        end
      end
    }

    config[:apps_tiles].map { |id, app|
      app[ :id ] = id
      app
    }.to_json
  end
  # }}}

  # {{{ auth
  get "#{APP_PATH}/auth/:provider/callback" do
    init_session( request.env )
    redirect params[:url] if params[:url] !=  "#{env['rack.url_scheme']}://env['HTTP_HOST']#{APP_PATH}/"
    redirect APP_PATH + '/'
  end

  get "#{APP_PATH}/auth/failure" do
    erb :auth_failure
  end

  get "#{APP_PATH}/auth/:provider/deauthorized" do
    erb :auth_deauthorized
  end

  get "#{APP_PATH}/protected" do
    throw( :halt, [ 401, "Not authorized\n" ] ) unless session[:authenticated]
    erb :auth_protected
  end

  get "#{APP_PATH}/login" do
    login! "#{APP_PATH}/"
  end

  get "#{APP_PATH}/logout" do
    logout! "#{env['rack.url_scheme']}://#{env['HTTP_HOST']}#{APP_PATH}/"
  end
  # }}}
end

SinatraApp.run! if __FILE__ == $PROGRAM_NAME
