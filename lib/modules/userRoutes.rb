module Sinatra
  module UserRoutes
    def self.registered(app)

   #get user
   #/user/user/getme
   app.get '/api/user/getme', :auth => [:user] do
       @user = User.where(id: session[:id])
       return_message = Hash.new
       return_message["id"] = @user.first.id
       return_message["username"] = @user.first.username
       return_message["currency"] = @user.first.currency
       return_message.to_json
    end

   #update user
	 #/user/updateme?currency=$
      app.post '/api/user/updateme', :auth => [:user] do
      	@user = User.where(id: session[:id])
        if @user.update(params)
          return_message = Hash.new
          return_message["id"] = @user.first.id
          return_message["username"] = @user.first.username
          return_message["currency"] = @user.first.currency
      		return_message.to_json
      	else
      		return 500
      	end
      end

    end
  end
end
