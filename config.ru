require 'rack'
require './app'
use Rack::Deflater
run CivMoney