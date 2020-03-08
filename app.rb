#gems
require "sinatra"
require "sinatra/activerecord"
require "sinatra/reloader"
require "json"
require "date"
require "dm-aggregates"
require "sinatra/base"
require "sprockets"
require "time"
require "google-id-token"
require "rack/ssl-enforcer"
#enviroments
require "./config/environments"
#models
require "./lib/models/transaction"
require "./lib/models/user"
#modules
require "./lib/modules/authentication"
require "./lib/modules/userRoutes"
require "./lib/modules/transactionsRoutes"
require "./lib/modules/totalsRoutes"
require "./lib/modules/adminRoutes"
require "./lib/modules/seedRoutes"

class CivMoney < Sinatra::Base
  register Sinatra::Authentication
  register Sinatra::UserRoutes
  register Sinatra::TransactionsRoutes
  register Sinatra::TotalsRoutes
  register Sinatra::AdminRoutes
  register Sinatra::SeedRoutes

  use Rack::MethodOverride
  use Rack::SslEnforcer if production?
  use Rack::Session::Cookie, :session_secret => ENV["SESSION_SECRET"], :secret => ENV["SESSION_SECRET"]
  set :session_secret, ENV["SESSION_SECRET"]
  set :environment, Sprockets::Environment.new
  set :client_id, ENV["GOOGLE_CLIENT_ID"]

  after do
    ActiveRecord::Base.connection.close
  end

  not_found do
    File.read(File.join("public", "index.html"))
  end

  get "/" do
    File.read(File.join("public", "index.html"))
  end
end
