require './models/user'
require 'sinatra/activerecord'
require 'bcrypt'

@user = User.new()
@user.username = "user1"
password_salt = BCrypt::Engine.generate_salt
password_hash = BCrypt::Engine.hash_secret("password", password_salt)
@user.password_hash = password_hash
@user.salt = password_salt
@user.save
