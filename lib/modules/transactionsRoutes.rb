module Sinatra
  module TrasnsactionsRoutes
    def self.registered(app)

      #add new transaction
      #/api/transaction?transaction[amount]=1&transaction[description]=hello&transaction[date]=2016.08.08
      app.post "/api/transaction", :auth => [:user] do
        @transaction = Transaction.new(params[:transaction])
        @transaction.user_id = session[:id]
        if @transaction.save
          return 200
        else
          return 500
        end
      end

      #get transaction for date
      #/api/transactions/date?[date]=2016.08.03
      app.get "/api/transactions/date", :auth => [:user] do
        content_type :json
        @transactions = Transaction.where("date = ? AND user_id = ?", params[:date], session[:id])
        return_message = {}
        return_message = @transactions
        return_message.to_json
      end

      #get transactions for range
      #/api/transactions/rangeAll?dateStart=2019.01.01&dateEnd=2019.01.02
      app.get "/api/transactions/rangeAll", :auth => [:user] do
        content_type :json
        @date0 = Date.parse(params[:dateStart])
        @date1 = Date.parse(params[:dateEnd])
        @transactions = Transaction.where("date IN (?) AND user_id = ?", (@date0)..@date1, session[:id]).order("date ASC")
        return_message = {}
        return_message = @transactions
        return_message.to_json
      end

      #delete transaction
      #/api/transactions/delete?[id]=1
      app.delete "/api/transactions/delete", :auth => [:user] do
        @transaction = Transaction.find(params[:id]).destroy
        if @transaction.save
          return 204
        else
          return 500
        end
      end

      #add monthly fixed Transaction
      #/api/transactions/addMonthlyFixedTransaction?[amount]=500&[description]=monthly&[year]=2000&[month]=1
      app.post "/api/transactions/addMonthlyFixedTransaction", :auth => [:user] do
        amount = params[:amount]
        description = params[:description]
        year = params[:year]
        month = params[:month]
        numberOfDaysInMonth = Time.days_in_month(month.to_i, year.to_i)
        dailyAmount = (amount.to_f / numberOfDaysInMonth).round(2)
        for i in 1..numberOfDaysInMonth
          transaction = Transaction.new()
          transaction.amount = dailyAmount
          transaction.date = Date.new(year.to_i, month.to_i, i)
          transaction.user_id = session[:id]
          transaction.description = @description
          transaction.save
        end
        return 200
      end
    end
  end
end
