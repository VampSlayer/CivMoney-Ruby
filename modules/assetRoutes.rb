module Sinatra
  module AssetRoutes
    def self.registered(app)

      app.get "/assets/*" do
      	env["PATH_INFO"].sub!("/assets", "")
      	settings.environment.call(env)
      end

    end
  end
end
