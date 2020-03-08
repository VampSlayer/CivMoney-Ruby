require './app'
use Rack::Deflater
use Rack::Static,
    :urls => ["/js", "/css"],
    :root => "public"
run CivMoney
