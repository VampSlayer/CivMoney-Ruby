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

      # get user top 10 descriptions
      app.get "/api/user/gettopdeescriptions", :auth => [:user] do
        descriptions = Transaction.select("description").where(user_id: session[:id]).limit(10).distinct

        parsed_descriptions = Array[]
        descriptions.each do |description|
          parsed_descriptions.push(description.description)
        end
        parsed_descriptions.to_json
      end
    end
  end
end
