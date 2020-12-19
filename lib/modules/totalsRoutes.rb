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
                  ROUND(SUM(transactions.amount)::numeric,2) AS amount
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
                date_part('month', transactions.date) AS datemonth,
              ROUND(SUM(CASE WHEN transactions.amount < 0 THEN ABS(transactions.amount) ELSE 0 END)::numeric,2) AS spent,
              ROUND((SUM(CASE WHEN transactions.amount > 0 THEN transactions.amount ELSE 0 END)
              - SUM(CASE WHEN transactions.amount < 0 THEN ABS(transactions.amount) ELSE 0 END))::numeric,2) AS saved
              FROM public.transactions
              WHERE date_part('year', transactions.date) = ? AND user_id = ?
              GROUP BY datemonth
              ORDER BY 1 ASC", params[:year], session[:id]]

        parsed_stats = Array[]

        stats.each do |stat|
          parsed = Hash.new
          parsed[:id] = stat[:datemonth]
          parsed[:spent] = stat[:spent]
          parsed[:saved] = stat[:saved]
          parsed[:date] = DateTime.new(params[:year].to_i, stat[:datemonth], 1).strftime('%B')
          parsed_stats.push(parsed)
        end

        parsed_stats.to_json
      end

      # get month transaction averages for year
      # /api/transactions/yearMonthAvgs?year=2019
      app.get "/api/transactions/yearMonthAvgs", :auth => [:user] do
        averages = Transaction.find_by_sql ["SELECT
              date_part('month', transactions.date) AS datemonth,
              SUM(CASE WHEN transactions.amount < 0 THEN ABS(transactions.amount) ELSE 0 END)::numeric AS spent,
              (SUM(CASE WHEN transactions.amount > 0 THEN transactions.amount ELSE 0 END)
              - SUM(CASE WHEN transactions.amount < 0 THEN ABS(transactions.amount) ELSE 0 END))::numeric AS saved
            FROM public.transactions
            WHERE date_part('year', transactions.date) = ? AND user_id = ?
            GROUP BY datemonth
            ORDER BY 1 ASC", params[:year], session[:id]]
        
        parsed_averages = Array[]

        averages.each do |average|
          number_of_days_in_month = Time.days_in_month(average[:datemonth].to_i, params[:year].to_i)
          parsed = Hash.new
          parsed[:spent] = (average[:spent] / number_of_days_in_month).to_f.round(2)
          parsed[:saved] = (average[:saved] / number_of_days_in_month).to_f.round(2)
          parsed[:id] = average[:datemonth].to_i
          parsed[:date] = DateTime.new(params[:year].to_i, average[:datemonth], 1).strftime('%F')
          parsed_averages.push(parsed)
        end

        parsed_averages.to_json
      end

      # get grouped transactions sum for date
      # /api/transactions/dateGroupedTotals?date=2016.08.03
      app.get "/api/transactions/dateGroupedTotals", :auth => [:user] do
        sums = Transaction.select(:description, :amount).where(date: params[:date], user_id: session[:id]).group(:description, :amount)

        data = Hash.new
        data[:incomes] = Array[]
        data[:expenses] = Array[]
        data[:total] = 0

        sums.each do |sum|
          data[:total] += sum.amount
          if sum.amount > 0 
            data[:incomes].push(sum)
          else 
            data[:expenses].push(sum)
          end
        end
        
        data.to_json
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

        data = Hash.new
        data[:incomes] = Array[]
        data[:expenses] = Array[]
        data[:total] = 0

        sums.each do |sum|
          data[:total] += sum.amount
          if sum.amount > 0 
            data[:incomes].push(sum)
          else 
            data[:expenses].push(sum)
          end
        end
        
        data.to_json
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

        data = Hash.new
        data[:incomes] = Array[]
        data[:expenses] = Array[]
        data[:total] = 0

        sums.each do |sum|
          data[:total] += sum.amount
          if sum.amount > 0 
            data[:incomes].push(sum)
          else 
            data[:expenses].push(sum)
          end
        end
        
        data.to_json
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

        parsed_totals = Array[]

        totals.each do |total|
          parsed_total = Hash.new
          parsed_total[:id] = total[:datemonth].to_i
          if months.include?(parsed_total[:id])
            months -= [parsed_total[:id]]
          end
          parsed_total[:date] = DateTime.new(params[:year].to_i, total[:datemonth].to_i, 1).strftime('%FT%T%:z')
          parsed_total[:amount] = total[:amount]
          parsed_totals.push(parsed_total)
        end

        # fill in missing months with 0 amount
        months.each do |month|
          parsed_total = Hash.new
          parsed_total[:id] = month
          parsed_total[:date] = DateTime.new(params[:year].to_i, month, 1).strftime('%FT%T%:z')
          parsed_total[:amount] = 0.0
          parsed_totals.push(parsed_total)
        end

        parsed_totals.to_json
      end
    end
  end
end
