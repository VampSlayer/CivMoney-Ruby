module Sinatra
  module TrasnsactionsRoutes
    def self.registered(app)

      #add new transaction
      #/transaction?transaction[amount]=1&transaction[description]=hello&transaction[date]=2016.08.08
      app.post '/transaction', :auth => [:user] do
      	@transaction = Transaction.new(params[:transaction])
        @transaction.user_id = session[:id]
      	if @transaction.save
      		return 200
      	else
      		return 500
      	end
      end

      #get transaction for date
      #/transactions/date?[date]=2016.08.03
      app.get '/transactions/date', :auth => [:user] do
      	content_type :json
      	@transactions = Transaction.where("date = ? AND user_id = ?", params[:date], session[:id])
      	return_message = {}
      	return_message = @transactions
      	return_message.to_json
      end

      #get expenses for date
      #/transactions/expenses?[year]=2016&[month]=08&[day]=06
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
      #/transactions/incomes?[year]=2016&[month]=08&[day]=06
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
      #/transactions/rangeAll?[year0]=2016&[month0]=07&[day0]=06&[year1]=2016&[month1]=08&[day1]=06
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
      #/transactions/rangeExpenses?[year0]=2016&[month0]=07&[day0]=06&[year1]=2016&[month1]=08&[day1]=06
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
      #/transactions/rangeIncomes?[year0]=2016&[month0]=07&[day0]=06&[year1]=2016&[month1]=08&[day1]=06
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
      #/transactions/delete?[id]=1
      app.delete '/transactions/delete', :auth => [:user] do
      	@transaction = Transaction.find(params[:id]).destroy
      	if @transaction.save
      		return 200
      	else
      		return 500
      	end
      end

      #delete transaction
      #/transactions/delete?[id]=1
      app.post '/transactions/delete', :auth => [:user] do
      	@transaction = Transaction.find(params[:id]).destroy
      	if @transaction.save
      		return 200
      	else
      		return 500
      	end
      end

      #add monthly fixed Transaction
      #/transactions/addMonthlyFixedTransaction?[amount]=500&[description]=monthly&[year]=2000&[month]=1
      app.post '/transactions/addMonthlyFixedTransaction', :auth => [:user] do
        @amount = params[:amount]
	      @description = params[:description]
	      @year = params[:year]
        @month = params[:month]
	      numberOfDaysInMonth = Time.days_in_month(@month.to_i, @year.to_i)
        @dailyAmount = (@amount.to_f / numberOfDaysInMonth).round(2)
          for i in 1..numberOfDaysInMonth
            @transaction = Transaction.new()
            @transaction.amount = @dailyAmount
            @transaction.date = Date.new(@year.to_i, @month.to_i, i)
            @transaction.user_id = session[:id]
            @transaction.description = @description
            @transaction.save
          end
          return 200
      end

    end
  end
end
