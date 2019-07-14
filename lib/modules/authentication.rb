require 'sinatra'

module Sinatra
  module Authentication
    def self.registered(app)

	  #set authentication to check if session id is not null and user exists
      app.set(:auth) do |*roles|
          condition do
            unless session[:id].nil?.! && User.exists?(:id => session[:id])
              redirect '/unauthorized', 401
            end
          end
      end

    app.get "/unauthorized" do
      return 401
    end

	  #register user
      #/user
      app.post "/user" do
        if User.exists?(:username => params[:username])
          return 500
        else
        password_salt = BCrypt::Engine.generate_salt
        password_hash = BCrypt::Engine.hash_secret(params[:password], password_salt)
        @user = User.new(params[:user])
        @user.username = params[:username]
        @user.password_hash = password_hash
        @user.salt = password_salt
		    @user.currency = params[:currency]
          if @user.save
            @newSavedUser = User.where(username: params[:username])
            session[:id] = @newSavedUser.first.id
            redirect to('/')
            return 200
          else
            return 500
          end
        end
      end

	  #user login
	  #/login
      app.post '/api/login' do
        @json = JSON.parse(request.body.read)
        if @json["username"].empty? ||  @json["password"].empty?
          return 400
        end
        if User.exists?(:username => @json["username"])
          @user = User.where(username: @json["username"])
          if @user.first.password_hash == BCrypt::Engine.hash_secret(@json["password"], @user.first.salt)
            session[:id] = @user.first.id
            return 204
          else
            return 401
          end
        else
            return 404
        end
      end

	  #user logout, clears session
	  #/logout
      app.post '/api/logout' do
        session.clear
        return 204
      end

    end
  end
end
