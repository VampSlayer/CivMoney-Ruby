require 'sinatra'

module Sinatra
  module Authentication
    def self.registered(app)

	  #set authentication to check if session id is not null and user exists
      app.set(:auth) do |*roles|
          condition do
            unless session[:id].nil?.! && User.exists?(:id => session[:id])
              redirect '/login', 303
            end
          end
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
      app.post '/login' do
        if User.exists?(:username => params[:username])
          @user = User.where(username: params[:username])
          if @user.first.password_hash == BCrypt::Engine.hash_secret(params[:password], @user.first.salt)
            session[:id] = @user.first.id
            redirect to('/')
          else
            return 401
          end
        else
            return 404
        end
      end

	  #user logout, clears session
	  #/logout
      app.post '/logout' do
        session.clear
        redirect('/login')
      end

    end
  end
end
