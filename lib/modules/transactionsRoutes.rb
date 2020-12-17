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

      # get transactions for date
      # /api/transactions/date?date=2016.08.03
      app.get "/api/transactions/date", :auth => [:user] do
        transactions = Transaction.where(date: params[:date], user_id: session[:id])
        transactions.to_json
      end

      # get transactions for year
      # /api/transactions/year?year=2020
      app.get "/api/transactions/year", :auth => [:user] do
        transactions = Transaction.find_by_sql ["SELECT *
          FROM public.transactions
          WHERE date_part('year', transactions.date) = ? AND user_id = ?
          ORDER BY 1 ASC", params[:year], session[:id]]
        transactions.to_json
      end

      # get transactions for range
      # /api/transactions/rangeAll?dateStart=2019.01.01&dateEnd=2019.01.02
      app.get "/api/transactions/rangeAll", :auth => [:user] do
        date_start = Date.parse(params[:dateStart])
        date_end = Date.parse(params[:dateEnd])
        transactions = Transaction.where(date: (date_start)..date_end, user_id: session[:id]).order(:date)
        transactions.to_json
      end

      # delete transaction
      # /api/transactions/delete?id=1
      app.delete "/api/transactions/delete", :auth => [:user] do
        if Transaction.where(id: params[:id].to_i, user_id: session[:id]).delete_all()
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
