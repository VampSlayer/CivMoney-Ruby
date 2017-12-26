module Sinatra
  module TrasnsactionsRoutes
    def self.registered(app)

      #add new transaction
      #"http://localhost:4567/transaction?transaction[amount]=1&transaction[description]=hello&transaction[date]=2016.08.08"
      app.post '/transaction', :auth => [:user] do
      	Date.today
      	@transaction = Transaction.new(params[:transaction])
        @transaction.user_id = session[:id]
      	if @transaction.save
      		return 200
      	else
      		return 500
      	end
      end

      #get transaction for date
      #http://localhost:4567/transactions/date?[date]=2016.08.03
      app.get '/transactions/date', :auth => [:user] do
      	content_type :json
      	@transactions = Transaction.where("date = ? AND user_id = ?", params[:date], session[:id])
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get total for date
      #http://localhost:4567/transactions/dateTotal?[date]=2016.08.03
      app.get '/transactions/dateTotal', :auth => [:user] do
      	content_type :json
      	@transactions = Transaction.select("sum(amount) as total").where("date = ? AND user_id = ?", params[:date], session[:id])
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get total for week
      #http://localhost:4567/transactions/weekTotal?[year]=2016&[month]=08&[day]=06
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
      #http://localhost:4567/transactions/monthTotal?[year]=2016&[month]=08&[day]=06
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

      #get total per day for month
      #http://localhost:4567/transactions/dailyTotalMonth?[year]=2016&[month]=08
      app.get '/transactions/dailyTotalMonth', :auth => [:user] do
      	content_type :json
      	@year = params[:year]
      	@month = params[:month]
      	@day = 1
      	@today = Date.new(@year.to_i, @month.to_i, @day.to_i)
      	@startOfMonth = @today.beginning_of_month
      	@endOfMonth = @startOfMonth.beginning_of_month.next_month - 1.day
      	@transactions = Transaction.select("date,sum(amount) as amount").where("date IN (?) AND user_id = ?", (@startOfMonth)..@endOfMonth, session[:id]).group("date").order("date ASC")
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get expenses for date
      #http://localhost:4567/transactions/expenses?[year]=2016&[month]=08&[day]=06
      app.get '/transactions/expenses', :auth => [:user] do
      	content_type :json
      	@year = params[:year]
      	@month = params[:month]
      	@day = params[:day]
      	@today = Date.new(@year.to_i, @month.to_i, @day.to_i)
      	@transactions = Transaction.select("date, amount").where('amount < 0').where("date = ? AND user_id = ?", @today, session[:id])
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end


      #get incomes for date
      #http://localhost:4567/transactions/incomes?[year]=2016&[month]=08&[day]=06
      app.get '/transactions/incomes', :auth => [:user] do
      	content_type :json
      	@year = params[:year]
      	@month = params[:month]
      	@day = params[:day]
      	@today = Date.new(@year.to_i, @month.to_i, @day.to_i)
      	@transactions = Transaction.select("date, amount").where('amount > 0').where("date = ? AND user_id = ?", @today, session[:id])
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get transactions for range
      #http://localhost:4567/transactions/rangeAll?[year0]=2016&[month0]=07&[day0]=06&[year1]=2016&[month1]=08&[day1]=06
      app.get '/transactions/rangeAll', :auth => [:user] do
      	content_type :json
      	@year0 = params[:year0]
      	@month0 = params[:month0]
      	@day0 = params[:day0]
      	@date0 = Date.new(@year0.to_i, @month0.to_i, @day0.to_i)
      	@year1 = params[:year1]
      	@month1 = params[:month1]
      	@day1 = params[:day1]
      	@date1 = Date.new(@year1.to_i, @month1.to_i, @day1.to_i)
      	@transactions = Transaction.where("date IN (?) AND user_id = ?", (@date0)..@date1, session[:id]).order("date ASC")
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get expenses for range
      #http://localhost:4567/transactions/rangeExpenses?[year0]=2016&[month0]=07&[day0]=06&[year1]=2016&[month1]=08&[day1]=06
      app.get '/transactions/rangeExpenses', :auth => [:user] do
      	content_type :json
      	@year0 = params[:year0]
      	@month0 = params[:month0]
      	@day0 = params[:day0]
      	@date0 = Date.new(@year0.to_i, @month0.to_i, @day0.to_i)
      	@year1 = params[:year1]
      	@month1 = params[:month1]
      	@day1 = params[:day1]
      	@date1 = Date.new(@year1.to_i, @month1.to_i, @day1.to_i)
      	@transactions = Transaction.where("date IN (?) AND amount < 0 AND user_id = ?", (@date0)..@date1, session[:id]).order("date ASC")
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get incomes for range
      #http://localhost:4567/transactions/rangeIncomes?[year0]=2016&[month0]=07&[day0]=06&[year1]=2016&[month1]=08&[day1]=06
      app.get '/transactions/rangeIncomes', :auth => [:user] do
      	content_type :json
      	@year0 = params[:year0]
      	@month0 = params[:month0]
      	@day0 = params[:day0]
      	@date0 = Date.new(@year0.to_i, @month0.to_i, @day0.to_i)
      	@year1 = params[:year1]
      	@month1 = params[:month1]
      	@day1 = params[:day1]
      	@date1 = Date.new(@year1.to_i, @month1.to_i, @day1.to_i)
      	@transactions = Transaction.where("date IN (?) AND amount > 0 AND user_id = ?", (@date0)..@date1, session[:id]).order("date ASC")
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #delete transaction
      #http://localhost:4567/transactions/delete?[id]=1
      app.delete '/transactions/delete', :auth => [:user] do
        Date.today
      	@transaction = Transaction.find(params[:id]).destroy
      	if @transaction.save
      		return 200
      	else
      		return 500
      	end
      end

      #delete transaction
      #http://localhost:4567/transactions/delete?[id]=1
      app.post '/transactions/delete', :auth => [:user] do
        Date.today
      	@transaction = Transaction.find(params[:id]).destroy
      	if @transaction.save
      		return 200
      	else
      		return 500
      	end
      end

      #get monthly totals for year
      #http://localhost:4567/transactions/yearsTotals
      app.get '/transactions/yearsTotals', :auth => [:user] do
      	content_type :json
      	@transactions = Transaction.find_by_sql ["SELECT
        	date_part('year', transactions.date) AS Dateyear,
        	SUM(transactions.amount) AS amount
      	FROM public.transactions
      	WHERE user_id = ?
       	GROUP BY Dateyear
       	ORDER BY 1 ASC", session[:id]]
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get monthly totals for year
      #http://localhost:4567/transactions/yearsMonthTotals
      app.get '/transactions/yearsMonthTotals', :auth => [:user] do
      	content_type :json
      	@transactions = Transaction.find_by_sql ["SELECT
        	date_part('month', transactions.date) AS Datemonth,
        	SUM(transactions.amount) AS amount
      	FROM public.transactions
      	WHERE date_part('year', transactions.date) = date_part('year', current_date) AND user_id = ?
       	GROUP BY Datemonth
       	ORDER BY 1 ASC", session[:id]]
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get weekly totals for month
      #http://localhost:4567/transactions/monthsWeekTotals
      app.get '/transactions/monthsWeekTotals', :auth => [:user] do
      	content_type :json
        #Post.find_by_sql ["SELECT title FROM posts WHERE author = ? AND created > ?", author_id, start_date]
      	@transactions = Transaction.find_by_sql ["SELECT
        	date_part('week', transactions.date) AS Dateweek,
        	SUM(transactions.amount) AS amount
      	FROM public.transactions
      	WHERE date_part('month', transactions.date) = date_part('month', current_date) AND user_id = ?
       	GROUP BY Dateweek
       	ORDER BY 1 ASC", session[:id]]
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #post montly rates TODO methodize
      app.post '/transactions/addMonthsIncomesExpenses', :auth => [:user] do
        @totalIncome = params[:income]
        @totalExpense = params[:expense]
        @month = params[:month]
        if [4,6,9,11].include? @month.to_i
          @dailyIncome = @totalIncome.to_i / 30
          @dailyExpense = ((@totalExpense.to_i / 30) * -1)
          for i in 1..30
            @transactionI = Transaction.new()
            @transactionE = Transaction.new()
            @transactionI.amount = @dailyIncome
            @transactionI.date = Date.new(Time.new.year.to_i,@month.to_i,i)
            @transactionI.user_id = session[:id]
            @transactionI.description = "Daily Income"
            @transactionI.save
            @transactionE.amount = @dailyExpense
            @transactionE.date = Date.new(Time.new.year.to_i,@month.to_i,i)
            @transactionE.user_id = session[:id]
            @transactionE.description = "Daily Expenses"
            @transactionE.save
          end
          return 200
        elsif [2].include? @month.to_i
          @dailyIncome = @totalIncome.to_i / 28
          @dailyExpense = ((@totalExpense.to_i / 28) * -1)
          for i in 1..28
            @transactionI = Transaction.new()
            @transactionE = Transaction.new()
            @transactionI.amount = @dailyIncome
            @transactionI.date = Date.new(Time.new.year.to_i,@month.to_i,i)
            @transactionI.user_id = session[:id]
            @transactionI.description = "Daily Income"
            @transactionI.save
            @transactionE.amount = @dailyExpense
            @transactionE.date = Date.new(Time.new.year.to_i,@month.to_i,i)
            @transactionE.user_id = session[:id]
            @transactionE.description = "Daily Expenses"
            @transactionE.save
          end
          return 200
        elsif [1,3,5,7,8,10,12].include? @month.to_i
          @dailyIncome = @totalIncome.to_i / 31
          @dailyExpense = ((@totalExpense.to_i / 31) * -1)
          for i in 1..31
            @transactionI = Transaction.new()
            @transactionE = Transaction.new()
            @transactionI.amount = @dailyIncome
            @transactionI.date = Date.new(Time.new.year.to_i,@month.to_i,i)
            @transactionI.user_id = session[:id]
            @transactionI.description = "Daily Income"
            @transactionI.save
            @transactionE.amount = @dailyExpense
            @transactionE.date = Date.new(Time.new.year.to_i,@month.to_i,i)
            @transactionE.user_id = session[:id]
            @transactionE.description = "Daily Expenses"
            @transactionE.save
          end
          return 200
        else
          return 500
        end
      end

    end
  end
end
