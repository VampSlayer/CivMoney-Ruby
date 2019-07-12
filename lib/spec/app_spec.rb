require File.expand_path '../spec_helper.rb', __FILE__

describe "Civ Money" do
  it "should not allow accessing the home page without logging in" do
    get '/CivMoneyHome'
    expect(last_response).to be_redirect  # This works, but I want it to be more specific
    follow_redirect!
    expect(last_request.url).to eq('http://example.org/login')
  end
end

describe "Civ Money" do
  @user = User.where(:username => 'TestUser').destroy_all
      it "should register new user" do
        post '/user', :username => 'TestUser', :password =>'123456', :currency => 'CHF'
        expect(last_response).to be_redirect  # This works, but I want it to be more specific
        follow_redirect!
	expect(last_request.url).to eq('http://example.org/CivMoneyHome')
        expect(last_response.status).to eq(200)
      end
end

describe "Civ Money" do
      it "should login" do
        post '/login', :username => 'TestUser', :password =>'123456'
        expect(last_response).to be_redirect  # This works, but I want it to be more specific
        follow_redirect!
        expect(last_request.url).to eq('http://example.org/CivMoneyHome')
	expect(last_response.status).to eq(200)
      end
end

describe "Civ Money" do
  it "should hold session id after logging in" do
    post '/login', :username => 'TestUser', :password =>'123456'
    get '/CivMoneyHome'
    expect(last_request.url).to eq('http://example.org/CivMoneyHome')
  end
end

describe "Civ Money" do
    it "should add a new transaction after logging in" do
    post '/login', :username => 'TestUser', :password =>'123456'
    post '/transaction', :amount => 100, :date => '2016.08.08', :description => 'test'
    expect(last_response.status).to eq(200)
  end
end
