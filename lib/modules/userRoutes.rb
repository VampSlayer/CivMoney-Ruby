module Sinatra
  module UserRoutes
    def self.registered(app)

      # get user
      app.get "/api/user/getme", :auth => [:user] do
        user = User.find(session[:id])
        return_user = Hash.new
        return_user["username"] = user.username
        return_user["currency"] = user.currency
        return_user["theme"] = user.theme
        return_user.to_json
      end

      # update user
      # /user/updateme?currency=$&theme=dark
      app.post "/api/user/updateme", :auth => [:user] do
        user = User.find(session[:id])
        if user.update(params)
          return_user = Hash.new
          return_user["username"] = user.username
          return_user["currency"] = user.currency
          return_user["theme"] = user.theme
          return_user.to_json
        else
          return 500
        end
      end
    end
  end
end
