module Sinatra
  module AdminRoutes
    def self.registered(app)

      # seed some data for user a few years
      # /api/seed
      app.get "/api/seed", :auth => [:user] do
        transactions = Transaction.where(user_id: session[:id]).delete_all

        years = [Time.new.year - 1, Time.new.year, Time.new.year + 1]
        months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        years.each do |year|
          months.each do |month|
            numberOfDaysInMonth = Time.days_in_month(month.to_i, year.to_i)
            dailyAmounts = []

            for i in 1..Random.new.rand(2..4)
              dailyAmounts.push((Random.new.rand(0..1000).to_f / numberOfDaysInMonth).round(2))
              dailyAmounts.push((Random.new.rand(-1000..0).to_f / numberOfDaysInMonth).round(2))
            end

            dailyAmounts.each do |dailyAmount|
              description = (0..10).map { ("a".."z").to_a[rand(26)] }.join
              for i in 1..numberOfDaysInMonth
                @transaction = Transaction.new()
                @transaction.amount = dailyAmount
                @transaction.date = Date.new(year.to_i, month.to_i, i)
                @transaction.user_id = session[:id]
                @transaction.description = description
                @transaction.save
              end
            end
          end
        end

        return 200
      end
    end
  end
end
