#gems
require 'sinatra'
require 'sinatra/cross_origin'
require 'sinatra/activerecord'
require 'json'
require 'date'
require 'bcrypt'
require 'dm-aggregates'
require 'sinatra/base'
require 'sprockets'
require 'time'
#enviroments
require './config/environments'
#models
require './models/transaction'
require './models/user'
#modules
require './modules/authentication'
require './modules/userRoutes'
require './modules/civMoneyRoutes'
require './modules/assetRoutes'
require './modules/transactionsRoutes'
require './modules/totalsRoutes'
require './modules/adminRoutes'

class CivMoney < Sinatra::Base

include BCrypt

register Sinatra::Authentication
register Sinatra::UserRoutes
register Sinatra::TrasnsactionsRoutes
register Sinatra::CivMoneyRoutes
register Sinatra::AssetRoutes
register Sinatra::TotalsRoutes
register Sinatra::AdminRoutes

use Rack::Session::Cookie, :session_secret => "supersecret", :secret => "supersecret"
set :session_secret, "supersecret"
set :environment, Sprockets::Environment.new

environment.append_path "assets/stylesheets"
environment.append_path "assets/javascripts"
environment.append_path "assets/less"
environment.append_path "assets/fonts"

after do
  ActiveRecord::Base.connection.close
end

configure do
    enable :cross_origin
  end

before do
    response.headers['Access-Control-Allow-Origin'] = ENV['REACT_URL'] || 'http://localhost:5000'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
  end

end
