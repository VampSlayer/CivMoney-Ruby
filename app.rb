#gems
require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/reloader'
require 'json'
require 'date'
require 'bcrypt'
require 'dm-aggregates'
require 'sinatra/base'
require 'sprockets'
require 'time'
require 'google-id-token'
#enviroments
require './config/environments'
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

include BCrypt

register Sinatra::Authentication
register Sinatra::UserRoutes
register Sinatra::TrasnsactionsRoutes
register Sinatra::TotalsRoutes
register Sinatra::AdminRoutes

use Rack::Session::Cookie, :session_secret => ENV['SESSION_SECRET'], :secret => ENV['SESSION_SECRET']
set :session_secret, ENV['SESSION_SECRET']
set :environment, Sprockets::Environment.new
set :client_id, ENV['GOOGLE_CLIENT_ID']

after do
  ActiveRecord::Base.connection.close
end

not_found do
  File.read(File.join('public', 'index.html'))
end

get '/' do
  File.read(File.join('public', 'index.html'))
end

end
