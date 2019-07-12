module Sinatra
  module AdminRoutes
    def self.registered(app)
	
	 #get total number of users
	 #/user/totalNumberOfUsers
     app.get '/user/totalNumberOfUsers' do
        @userCount = User.count
        return_message = {}
        return_message = @userCount
        return_message.to_json
      end

	 #get array of all users
	 #/user/getUsers
     app.get '/user/getUsers' do
        @userNames = User.select("id, username")
        return_message = {}
        return_message = @userNames
        return_message.to_json
      end	 

	end
  end
end
