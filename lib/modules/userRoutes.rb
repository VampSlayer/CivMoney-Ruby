module Sinatra
  module UserRoutes
    def self.registered(app)

      # get user
      app.get "/api/user/getme", :auth => [:user] do
        user = User.where(id: session[:id])
        return_user = Hash.new
        return_user["id"] = user.first.id
        return_user["username"] = user.first.username
        return_user["currency"] = user.first.currency
        return_user["theme"] = user.first.theme
        return_user.to_json
      end

      # update user
      # /user/updateme?currency=$&theme=dark
      app.post "/api/user/updateme", :auth => [:user] do
        user = User.where(id: session[:id])
        if user.update(params)
          return_user = Hash.new
          return_user["id"] = user.first.id
          return_user["username"] = user.first.username
          return_user["currency"] = user.first.currency
          return_user["theme"] = user.first.theme
          return_user.to_json
        else
          return 500
        end
      end
    end
  end
end
