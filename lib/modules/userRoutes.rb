module Sinatra
  module UserRoutes
    def self.registered(app)

   #get user
   #/user/username
   app.get '/api/user/getme', :auth => [:user] do
       @user = User.where(id: session[:id])
       return_message = Hash.new
       return_message["id"] = @user.first.id
       return_message["firstName"] = @user.first.username
       return_message["currency"] = @user.first.currency
       return_message.to_json
    end

	  #get user name
	  #/user/username
      app.get '/user/username', :auth => [:user] do
        @user = User.where(id: session[:id])
        return_message = {}
        return_message = @user.first.username
        return_message.to_json
      end

	  #get user currency
      #/user/currency
	  app.get '/user/currency', :auth => [:user] do
        @user = User.where(id: session[:id])
        return_message = {}
        return_message = @user.first.currency
        return_message.to_json
      end

	 #change user currency
	 #/user/changeCurrency?curreny=[CHF]"
      app.patch '/user/changeCurrency', :auth => [:user] do
      	@user = User.where(id: session[:id])
      	if @user.update(params)
      		return 200
      	else
      		return 500
      	end
      end

     #change user currency
	 #/user/changeCurrency?curreny=[CHF]
      app.post '/user/changeCurrency', :auth => [:user] do
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
