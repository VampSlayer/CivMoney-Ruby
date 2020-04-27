module Sinatra
  module AdminRoutes
    def self.registered(app)

      # get total number of users
      app.get "/api/user/totalNumberOfUsers" do
        user_count = User.count
        user_count.to_json
      end

    end
  end
end
