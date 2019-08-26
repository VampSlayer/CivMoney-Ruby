module Sinatra
  module TotalsRoutes
    def self.registered(app)

      #get total for week
      #/transactions/weekTotal?[year]=2016&[month]=08&[day]=06
      app.get '/transactions/weekTotal', :auth => [:user] do
      	content_type :json
      	@year = params[:year]
      	@month = params[:month]
      	@day = params[:day]
      	@today = Date.new(@year.to_i, @month.to_i, @day.to_i)
      	@startOfWeek = @today.beginning_of_week
      	@endOfWeek = @startOfWeek.next_day(7)
      	@transactions = Transaction.select("sum(amount) as total").where("date BETWEEN ? AND ? AND user_id = ?", @startOfWeek, @endOfWeek, session[:id])
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get total for month
      #/transactions/monthTotal?[year]=2016&[month]=08&[day]=06
      app.get '/transactions/monthTotal', :auth => [:user] do
      	content_type :json
      	@year = params[:year]
      	@month = params[:month]
      	@day = params[:day]
      	@today = Date.new(@year.to_i, @month.to_i, @day.to_i)
      	@startOfMonth = @today.beginning_of_month
      	@endOfMonth = @startOfMonth.beginning_of_month.next_month - 1.day
      	@transactions = Transaction.select("sum(amount) as total").where("date BETWEEN ? AND ? AND user_id = ?", @startOfMonth, @endOfMonth, session[:id])
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

	  #get total for year
      #/transactions/yearTotal?[year]=2016&[month]=08&[day]=06
      app.get '/api/transactions/yearTotal', :auth => [:user] do
      	content_type :json
      	@year = params[:year]
      	@month = params[:month]
      	@day = params[:day]
      	@startOfYear = Date.new(@year.to_i, 1, 1)
      	@endOfMonth = Date.new(@year.to_i, 12, 31)
      	@transactions = Transaction.select("sum(amount) as total").where("date BETWEEN ? AND ? AND user_id = ?", @startOfYear, @endOfYear, session[:id])
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get total per day for month
      #/transactions/dailyTotalMonth?[year]=2016&[month]=08
      app.get '/api/transactions/dailyTotalMonth', :auth => [:user] do
      	content_type :json
      	@year = params[:year]
      	@month = params[:month]
      	@day = 1
      	@today = Date.new(@year.to_i, @month.to_i, @day.to_i)
      	@startOfMonth = @today.beginning_of_month
      	@endOfMonth = @startOfMonth.beginning_of_month.next_month - 1.day
      	@transactions = Transaction.select("date, sum(amount) as amount").where("date IN (?) AND user_id = ?", (@startOfMonth)..@endOfMonth, session[:id]).group("date").order("date ASC")
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get total for date
      #/transactions/dateTotal?[date]=2016.08.03
      app.get '/transactions/dateTotal', :auth => [:user] do
      	content_type :json
      	@transactions = Transaction.select("sum(amount) as total").where("date = ? AND user_id = ?", params[:date], session[:id])
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get yearly totals for user
      #/transactions/yearsTotals
      app.get '/api/transactions/yearsTotals', :auth => [:user] do
      	content_type :json
      	@transactions = Transaction.find_by_sql ["SELECT
        	date_part('year', transactions.date) AS Dateyear,
        	SUM(transactions.amount) AS amount
      	FROM public.transactions
      	WHERE user_id = ?
       	GROUP BY Dateyear
       	ORDER BY Dateyear DESC", session[:id]]
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

	  #get grouped transactions sum for month
	  #/transactions/monthGroupedToals?month=01&year=2019
	  app.get '/api/transactions/monthGroupedToals', :auth => [:user] do 
		content_type :json
		@transactions = Transaction.find_by_sql ["SELECT
		  	description,
		  	ROUND(SUM(transactions.amount)::numeric,2) AS amount
		FROM public.transactions
		WHERE date_part('month', transactions.date) = ? AND date_part('year', transactions.date) = ? AND user_id = ?
		GROUP BY description
		ORDER BY 1 ASC", params[:month], params[:year], session[:id]]
		return_message = {}
		return_message = @transactions
		return_message.to_json
	  end

      #get monthly totals for year
      #/transactions/yearsMonthTotals?year=2019
      app.get '/api/transactions/yearsMonthTotals', :auth => [:user] do
      	content_type :json
      	@transactions = Transaction.find_by_sql ["SELECT
        	date_part('month', transactions.date) AS Datemonth,
        	ROUND(SUM(transactions.amount)::numeric,2) AS amount
      	FROM public.transactions
      	WHERE date_part('year', transactions.date) = ? AND user_id = ?
       	GROUP BY Datemonth
       	ORDER BY 1 ASC", params[:year], session[:id]]
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get weekly totals for month
      #/transactions/monthsWeekTotals?month=1
      app.get '/transactions/monthsWeekTotals', :auth => [:user] do
      	content_type :json
      	@transactions = Transaction.find_by_sql ["SELECT
        	date_part('week', transactions.date) AS Dateweek,
        	SUM(transactions.amount) AS amount
      	FROM public.transactions
      	WHERE date_part('month', transactions.date) = #{params[:month]} AND date_part('year', transactions.date) = date_part('year', current_date) AND user_id = ?
       	GROUP BY Dateweek
       	ORDER BY 1 ASC", session[:id]]
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get weekly totals for year
      #/transactions/yearsWeekTotals?year=2018
      app.get '/transactions/yearsWeekTotals', :auth => [:user] do
      	content_type :json
      	@transactions = Transaction.find_by_sql ["SELECT
        	date_part('week', transactions.date) AS Dateweek,
        	SUM(transactions.amount) AS amount
      	FROM public.transactions
      	WHERE date_part('year', transactions.date) = #{params[:year]} AND user_id = ?
       	GROUP BY Dateweek
       	ORDER BY 1 ASC", session[:id]]
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

    end
  end
end
