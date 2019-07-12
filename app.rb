#gems
require 'sinatra'
require 'sinatra/cross_origin'
require 'sinatra/activerecord'
require 'sinatra/reloader'
require 'json'
require 'date'
require 'bcrypt'
require 'dm-aggregates'
require 'sinatra/base'
require 'sprockets'
require 'time'
#enviroments
require './lib/config/environments'
#models
require './lib/models/transaction'
require './lib/models/user'
#modules
require './lib/modules/authentication'
require './lib/modules/userRoutes'
require './lib/modules/transactionsRoutes'
require './lib/modules/totalsRoutes'
require './lib/modules/adminRoutes'

class CivMoney < Sinatra::Base
configure :development do
  register Sinatra::Reloader
end

include BCrypt

register Sinatra::Authentication
register Sinatra::UserRoutes
register Sinatra::TrasnsactionsRoutes
register Sinatra::TotalsRoutes
register Sinatra::AdminRoutes

use Rack::Session::Cookie, :session_secret => "supersecret", :secret => "supersecret"
set :session_secret, "supersecret"
set :environment, Sprockets::Environment.new

after do
  ActiveRecord::Base.connection.close
end

not_found do
  File.read(File.join('public', 'index.html'))
end

get '/' do
  File.read(File.join('public', 'index.html'))
end

configure do
    enable :cross_origin
  end

before do
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
  end

end
