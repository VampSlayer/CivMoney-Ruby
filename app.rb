require 'sinatra'
require 'sinatra/activerecord'
require './config/environments' #database configuration
require './models/model'        #Model class
require './models/transaction'  
require 'json'
require 'date'

get '/' do
	send_file 'CivMoney/CivMoneyHome.html'
end

get '/CivMoneyHome.html' do
	send_file 'CivMoney/CivMoneyHome.html'
end

get '/Rate.html' do
	send_file 'CivMoney/Rate.html'
end

get '/Manage.html' do
	send_file 'CivMoney/Manage.html'
end

get '/Month.html' do
	send_file 'CivMoney/Month.html'
end

get '/Week.html' do
	send_file 'CivMoney/Week.html'
end

get '/API.html' do
	send_file 'CivMoney/API.html'
end

get '/bower_components/bootstrap/dist/css/bootstrap.css' do
	send_file 'bower_components/bootstrap/dist/css/bootstrap.css'
end

get '/bower_components/font-awesome/fonts/fontawesome-webfont.ttf' do
	send_file 'bower_components/font-awesome/fonts/fontawesome-webfont.ttf'
end

get '/bower_components/font-awesome/fonts/fontawesome-webfont.woff?' do
	send_file 'bower_components/font-awesome/fonts/fontawesome-webfont.woff'
end

get '/Scripts/bootstrap.min.js' do
	send_file 'Scripts/bootstrap.min.js'
end

get '/bower_components/font-awesome/css/font-awesome.min.css' do
	send_file 'bower_components/font-awesome/css/font-awesome.min.css'
end

get '/Scripts/jquery.min.js' do
	send_file 'Scripts/jquery.min.js'
end

get '/Scripts/metisMenu.js' do
	send_file 'Scripts/metisMenu.js'
end

get '/bower_components/metisMenu/dist/metisMenu.min.css' do
	send_file 'bower_components/metisMenu/dist/metisMenu.min.css'
end

get '/bower_components/morrisjs/morris.css' do
	send_file 'bower_components/morrisjs/morris.css'
end

get '/dist/css/sb-admin-2.css' do
	send_file 'dist/css/sb-admin-2.css'
end

get '/Scripts/sb-admin-2.js' do
	send_file 'Scripts/sb-admin-2.js'
end

get '/Content/Site.css' do
	send_file 'Content/Site.css'
end

get '/dist/css/timeline.css' do
	send_file 'dist/css/timeline.css'
end

#add new transaction 
#"http://localhost:4567/transaction?transaction[amount]=1&transaction[description]=hello&transaction[date]=2016.08.08"
post '/transaction' do
	Date.today
	@transaction = Transaction.new(params[:transaction])
	if @transaction.save
		puts(params)
	else
		"Sorry"
	end
end

#get all transactions
get '/transactions' do
	content_type :json
	@transactions = Transaction.all
	return_message = {}
	return_message = @transactions
	return_message.to_json
end

#get transaction for date 
#http://localhost:4567/transactions/date?[date]=2016.08.03 
get '/transactions/date' do
	content_type :json
	@transactions = Transaction.where(date: params[:date])
	return_message = {}
	return_message = @transactions
	return_message.to_json
end

#get total for date
#http://localhost:4567/transactions/dateTotal?[date]=2016.08.03 
get '/transactions/dateTotal' do
	content_type :json
	@transactions = Transaction.select("sum(amount) as total").where(date: params[:date])
	return_message = {}
	return_message = @transactions
	return_message.to_json
end

#get total for week
#http://localhost:4567/transactions/weekTotal?[year]=2016&[month]=08&[day]=06
get '/transactions/weekTotal' do
	content_type :json
	@year = params[:year]
	puts(@year)
	@month = params[:month]
	@day = params[:day]
	@today = Date.new(@year.to_i, @month.to_i, @day.to_i)
	puts(@today)
	@startOfWeek = @today.beginning_of_week
	@endOfWeek = @startOfWeek.next_day(7)
	@transactions = Transaction.select("sum(amount) as total").where(date: (@startOfWeek)..@endOfWeek)
	return_message = {}
	return_message = @transactions
	return_message.to_json
end	

#get total for month
#http://localhost:4567/transactions/monthTotal?[year]=2016&[month]=08&[day]=06
get '/transactions/monthTotal' do
	content_type :json
	@year = params[:year]
	puts(@year)
	@month = params[:month]
	@day = params[:day]
	@today = Date.new(@year.to_i, @month.to_i, @day.to_i)
	puts(@today)
	@startOfWeek = @today.beginning_of_month
	@endOfWeek = @startOfWeek.beginning_of_month.next_month - 1.day
	@transactions = Transaction.select("sum(amount) as total").where(date: (@startOfWeek)..@endOfWeek)
	return_message = {}
	return_message = @transactions
	return_message.to_json
end

#get total per day for month
#http://localhost:4567/transactions/dailyTotalMonth?[year]=2016&[month]=08
get '/transactions/dailyTotalMonth' do
	content_type :json
	@year = params[:year]
	puts(@year)
	@month = params[:month]
	@day = 1
	@today = Date.new(@year.to_i, @month.to_i, @day.to_i)
	puts(@today)
	@startOfWeek = @today.beginning_of_month
	@endOfWeek = @startOfWeek.beginning_of_month.next_month - 1.day
	@transactions = Transaction.select("date,sum(amount) as amount").where(date: (@startOfWeek)..@endOfWeek).group("date").order("date ASC")
	return_message = {}
	return_message = @transactions
	return_message.to_json
end

#get expenses for date
#http://localhost:4567/transactions/expenses?[year]=2016&[month]=08&[day]=06
get '/transactions/expenses' do
	content_type :json
	@year = params[:year]
	puts(@year)
	@month = params[:month]
	@day = params[:day]
	@today = Date.new(@year.to_i, @month.to_i, @day.to_i)
	puts(@today)
	@transactions = Transaction.select("date, amount").where('amount < 0').where(date: @today)
	return_message = {}
	return_message = @transactions
	return_message.to_json
end


#get incomes for date
#http://localhost:4567/transactions/incomes?[year]=2016&[month]=08&[day]=06
get '/transactions/incomes' do
	content_type :json
	@year = params[:year]
	puts(@year)
	@month = params[:month]
	@day = params[:day]
	@today = Date.new(@year.to_i, @month.to_i, @day.to_i)
	puts(@today)
	@transactions = Transaction.select("date, amount").where('amount > 0').where(date: @today)
	return_message = {}
	return_message = @transactions
	return_message.to_json
end

#get transactions for range
#http://localhost:4567/transactions/range?[year0]=2016&[month0]=07&[day0]=06&[year1]=2016&[month1]=08&[day1]=06
get '/transactions/range' do
	content_type :json
	@year0 = params[:year0]
	@month0 = params[:month0]
	@day0 = params[:day0]
	@date0 = Date.new(@year0.to_i, @month0.to_i, @day0.to_i)
	@year1 = params[:year1]
	@month1 = params[:month1]
	@day1 = params[:day1]
	@date1 = Date.new(@year1.to_i, @month1.to_i, @day1.to_i)
	@transactions = Transaction.where(date: (@date0)..@date1).order("date ASC")
	return_message = {}
	return_message = @transactions
	return_message.to_json
end

#delete transaction
#http://localhost:4567/transactions/delete?[id]=1
delete '/transactions/delete' do
  	Date.today
	@transaction = Transaction.find(params[:id]).destroy
	if @transaction.save
		puts(params)
	else
		"Sorry"
	end
end

#get monthly totals for year
#http://localhost:4567/transactions/yearsMonthTotals
get '/transactions/yearsMonthTotals' do
	content_type :json
	@transactions = Transaction.find_by_sql("SELECT 
  	date_part('month', transactions.date) AS Datemonth,
  	SUM(transactions.amount) AS amount
	FROM public.transactions
	WHERE date_part('year', transactions.date) = date_part('year', current_date) 
 	GROUP BY Datemonth
 	ORDER BY 1 ASC")
	return_message = {}
	return_message = @transactions
	return_message.to_json
end

#get weekly totals for month
#http://localhost:4567/transactions/monthsWeekTotals
get '/transactions/monthsWeekTotals' do
	content_type :json
	@transactions = Transaction.find_by_sql("SELECT 
  	date_part('week', transactions.date) AS Datemonth,
  	SUM(transactions.amount) AS amount
	FROM public.transactions
	WHERE date_part('month', transactions.date) = date_part('month', current_date) 
 	GROUP BY Datemonth
 	ORDER BY 1 ASC")
	return_message = {}
	return_message = @transactions
	return_message.to_json
end
