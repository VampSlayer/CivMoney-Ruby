module Sinatra
  module TransactionsRoutes
    def self.registered(app)

      # add new transaction
      # /api/transaction?transaction[amount]=1&transaction[description]=hello&transaction[date]=2016.08.08
      app.post "/api/transaction", :auth => [:user] do
        transaction = Transaction.new(params[:transaction])
        transaction.user_id = session[:id]
        if transaction.save
          return 200
        else
          return 500
        end
      end

      # get transaction for date
      # /api/transactions/date?date=2016.08.03
      app.get "/api/transactions/date", :auth => [:user] do
        transactions = Transaction.where("date = ? AND user_id = ?", params[:date], session[:id])
        transactions.to_json
      end

      # get transactions for range
      # /api/transactions/rangeAll?dateStart=2019.01.01&dateEnd=2019.01.02
      app.get "/api/transactions/rangeAll", :auth => [:user] do
        date_start = Date.parse(params[:dateStart])
        date_end = Date.parse(params[:dateEnd])
        transactions = Transaction.where("date IN (?) AND user_id = ?", (date_start)..date_end, session[:id]).order("date ASC")
        transactions.to_json
      end

      # delete transaction
      # /api/transactions/delete?id=1
      app.delete "/api/transactions/delete", :auth => [:user] do
        if Transaction.destroy(params[:id])
          return 204
        else
          return 500
        end
      end

      # add monthly fixed transaction
      # /api/transactions/addMonthlyFixedTransaction?amount=500&description=monthly&year=2000&month=1
      app.post "/api/transactions/addMonthlyFixedTransaction", :auth => [:user] do
        amount = params[:amount]
        description = params[:description]
        year = params[:year]
        month = params[:month]
        number_of_days_in_month = Time.days_in_month(month.to_i, year.to_i)
        daily_amount = (amount.to_f / number_of_days_in_month).round(2)
        (1..number_of_days_in_month).each do |i|
          transaction = Transaction.new()
          transaction.amount = daily_amount
          transaction.date = Date.new(year.to_i, month.to_i, i)
          transaction.user_id = session[:id]
          transaction.description = description
          transaction.save
        end
        return 200
      end
    end
  end
end
