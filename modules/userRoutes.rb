module Sinatra
  module UserRoutes
    def self.registered(app)

      app.get '/user/username', :auth => [:user] do
        @user = User.where(id: session[:id])
        return_message = {}
        return_message = @user.first.username
        return_message.to_json
      end

    end
  end
end
