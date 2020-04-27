module Sinatra
  module SeedRoutes
    def self.registered(app)

      # seed some data for user for last year and this year up to current month
      app.get "/api/seed", :auth => [:user] do
        Transaction.where(user_id: session[:id]).delete_all

        current = Time.new

        years = [Time.new.year - 1, Time.new.year]
        months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

        years.each do |year|
          months.each do |month|
            break if year == current.year && month > current.month
            number_of_days_in_month = Time.days_in_month(month.to_i, year.to_i)
            daily_amounts = []

            (1..Random.new.rand(2..4)).each do |_|
              daily_amounts.push((Random.new.rand(0..1000).to_f / number_of_days_in_month).round(2))
              daily_amounts.push((Random.new.rand(-1000..0).to_f / number_of_days_in_month).round(2))
            end

            incomes = ["Wages", "Bonus", "Commission", "Tax Rebate", "Refund", "eBay Selling", "Birthday", "Christmas", "Tournament"]
            expenses = ["Rent", "Phone", "Gym", "Utilities", "Avg/Day", "Food", "Clothes", "Flights", "Holidays", "Credit Card", "Savings"]

            daily_amounts.each do |dailyAmount|
              description = ""
              if dailyAmount > 0
                incomes_length = incomes.length - 1
                description = incomes[Random.new.rand(0..incomes_length)]
              else
                expenses_length = expenses.length - 1
                description = expenses[Random.new.rand(0..expenses_length)]
              end
              (1..number_of_days_in_month).each do |i|
                transaction = Transaction.new()
                transaction.amount = dailyAmount
                transaction.date = Date.new(year.to_i, month.to_i, i)
                transaction.user_id = session[:id]
                transaction.description = description
                transaction.save
              end
            end
          end
        end

        return 204
      end
    end
  end
end
