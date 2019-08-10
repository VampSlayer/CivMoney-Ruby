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
