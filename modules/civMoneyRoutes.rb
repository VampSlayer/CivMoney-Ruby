module Sinatra
  module CivMoneyRoutes
    def self.registered(app)

      app.get '/' do
        redirect '/CivMoneyHome', 303
      end

      app.get '/login' do
        send_file 'CivMoney/login.html'
      end

      app.get '/register' do
        send_file 'CivMoney/register.html'
      end

      app.get '/CivMoneyHome', :auth => [:user] do
        send_file 'CivMoney/CivMoneyHome.html'
      end

      app.get '/Rate', :auth => [:user] do
        send_file 'CivMoney/Rate.html'
      end

      app.get '/Manage', :auth => [:user] do
        send_file 'CivMoney/Manage.html'
      end

      app.get '/Month', :auth => [:user] do
        send_file 'CivMoney/Month.html'
      end

      app.get '/Week', :auth => [:user] do
        send_file 'CivMoney/Week.html'
      end

      app.get '/Year', :auth => [:user] do
        send_file 'CivMoney/Year.html'
      end

      app.get '/API' do
        send_file 'CivMoney/API.html'
      end

    end
  end
end
