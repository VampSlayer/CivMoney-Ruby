module Sinatra
  module UserRoutes
    def self.registered(app)

      app.get '/user/username', :auth => [:user] do
        @user = User.where(id: session[:id])
        return_message = {}
        return_message = @user.first.username
        return_message.to_json
      end

	  app.get '/user/currency', :auth => [:user] do
        @user = User.where(id: session[:id])
        return_message = {}
        return_message = @user.first.currency
        return_message.to_json
      end

	 #Change user currency
	 #"http://localhost:4567/user/changeCurrency?curreny=[CHF]"
      app.patch '/user/changeCurrency', :auth => [:user] do
      	@user = User.where(id: session[:id])
      	if @user.update(params)
      		return 200
      	else
      		return 500
      	end
      end

    end
  end
end
