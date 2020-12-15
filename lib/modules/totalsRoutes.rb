module Sinatra
  module TotalsRoutes
    def self.registered(app)

      # get total per day for month
      # /api/transactions/dailyTotalMonth?year=2016&month=08
      app.get "/api/transactions/dailyTotalMonth", :auth => [:user] do
        year = params[:year]
        month = params[:month]
        today = Date.new(year.to_i, month.to_i, 1.to_i)
        start_of_month = today.beginning_of_month
        end_of_month = start_of_month.beginning_of_month.next_month - 1.day
        totals = Transaction.select("date, sum(amount) as amount").where(date: (start_of_month)..end_of_month, user_id: session[:id]).group(:date).order(:date)
        totals.to_json
      end

      # get yearly totals for user
      app.get "/api/transactions/yearsTotals", :auth => [:user] do
        totals = Transaction.find_by_sql ["SELECT
                  date_part('year', transactions.date) AS Dateyear,
                  SUM(transactions.amount) AS amount
                FROM public.transactions
                WHERE user_id = ?
                GROUP BY Dateyear
                ORDER BY Dateyear DESC", session[:id]]
        totals.to_json
      end

      # get yearly stats(spent, saved) for year
      # # /api/transactions/yearsStats?year=2019
      app.get "/api/transactions/yearsStats", :auth => [:user] do
        stats = Transaction.find_by_sql ["SELECT
                date_part('year', transactions.date) AS Dateyear,
                ROUND(SUM(CASE WHEN transactions.amount < 0 THEN ABS(transactions.amount) ELSE 0 END)::numeric,2) AS spent,
                ROUND((SUM(CASE WHEN transactions.amount > 0 THEN transactions.amount ELSE 0 END)
                - SUM(CASE WHEN transactions.amount < 0 THEN ABS(transactions.amount) ELSE 0 END))::numeric,2) AS saved
                  FROM public.transactions
                  WHERE date_part('year', transactions.date) = ? AND user_id = ?
                  GROUP BY Dateyear
                  ORDER BY Dateyear DESC", params[:year], session[:id]]
        stats.first.to_json
      end

      # get monthly stats(spent, saved) for year
      # /api/transactions/yearMonthsStats?year=2019
      app.get "/api/transactions/yearMonthStats", :auth => [:user] do
        stats = Transaction.find_by_sql ["SELECT
                date_part('month', transactions.date) AS Datemonth,
              ROUND(SUM(CASE WHEN transactions.amount < 0 THEN ABS(transactions.amount) ELSE 0 END)::numeric,2) AS spent,
              ROUND((SUM(CASE WHEN transactions.amount > 0 THEN transactions.amount ELSE 0 END)
              - SUM(CASE WHEN transactions.amount < 0 THEN ABS(transactions.amount) ELSE 0 END))::numeric,2) AS saved
              FROM public.transactions
              WHERE date_part('year', transactions.date) = ? AND user_id = ?
              GROUP BY Datemonth
              ORDER BY 1 ASC", params[:year], session[:id]]
        stats.to_json
      end

      # get month transaction averages for year
      # /api/transactions/yearMonthAvgs?year=2019
      app.get "/api/transactions/yearMonthAvgs", :auth => [:user] do
        averages = Transaction.find_by_sql ["SELECT
              date_part('month', transactions.date) AS Datemonth,
              SUM(CASE WHEN transactions.amount < 0 THEN ABS(transactions.amount) ELSE 0 END)::numeric AS spent,
              (SUM(CASE WHEN transactions.amount > 0 THEN transactions.amount ELSE 0 END)
              - SUM(CASE WHEN transactions.amount < 0 THEN ABS(transactions.amount) ELSE 0 END))::numeric AS saved
            FROM public.transactions
            WHERE date_part('year', transactions.date) = ? AND user_id = ?
            GROUP BY Datemonth
            ORDER BY 1 ASC", params[:year], session[:id]]
        averages.each do |transaction|
          number_of_days_in_month = Time.days_in_month(transaction[:datemonth].to_i, params[:year].to_i)
          transaction[:spent] = (transaction[:spent] / number_of_days_in_month).to_f.round(2)
          transaction[:saved] = (transaction[:saved] / number_of_days_in_month).to_f.round(2)
        end
        averages.to_json
      end

      # get grouped transactions sum for month
      # /api/transactions/monthGroupedTotals?month=01&year=2019
      app.get "/api/transactions/monthGroupedTotals", :auth => [:user] do
        sums = Transaction.find_by_sql ["SELECT
                description,
                ROUND(SUM(transactions.amount)::numeric,2) AS amount
            FROM public.transactions
            WHERE date_part('month', transactions.date) = ? AND date_part('year', transactions.date) = ? AND user_id = ?
            GROUP BY description
            ORDER BY 1 ASC", params[:month], params[:year], session[:id]]
        sums.to_json
      end

      # get grouped transactions sum for year
      # /api/transactions/yearGroupedTotals?&year=2019
      app.get "/api/transactions/yearGroupedTotals", :auth => [:user] do
        sums = Transaction.find_by_sql ["SELECT
                description,
                ROUND(SUM(transactions.amount)::numeric,2) AS amount
            FROM public.transactions
            WHERE date_part('year', transactions.date) = ? AND user_id = ?
            GROUP BY description
            ORDER BY 1 ASC", params[:year], session[:id]]
        sums.to_json
      end

      # get monthly totals for year
      # /api/transactions/yearsMonthTotals?year=2019
      app.get "/api/transactions/yearsMonthTotals", :auth => [:user] do
        totals = Transaction.find_by_sql ["SELECT
              date_part('month', transactions.date) AS datemonth,
              ROUND(SUM(transactions.amount)::numeric,2) AS amount
            FROM public.transactions
            WHERE date_part('year', transactions.date) = ? AND user_id = ?
            GROUP BY datemonth
            ORDER BY 1 ASC", params[:year], session[:id]]

        months = Array.new(12) { |m| m = m + 1 }

        parsedTotals = Array[]

        totals.each do |total|
          parsedTotal = Hash.new
          parsedTotal[:id] = total[:datemonth].to_i
          if months.include?(parsedTotal[:id])
            months -= [parsedTotal[:id]]
          end
          parsedTotal[:date] = DateTime.new(params[:year].to_i, total[:datemonth].to_i, 1).strftime('%FT%T%:z')
          parsedTotal[:amount] = total[:amount]
          parsedTotals.push(parsedTotal)
        end

        # fill in missing months with 0 amount
        months.each do |month|
          parsedTotal = Hash.new
          parsedTotal[:id] = month
          parsedTotal[:date] = DateTime.new(params[:year].to_i, month, 1).strftime('%FT%T%:z')
          parsedTotal[:amount] = 0.0
          parsedTotals.push(parsedTotal)
        end

        parsedTotals.to_json
      end
    end
  end
end
