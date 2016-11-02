class CreateTransaction < ActiveRecord::Migration
  def up
  	create_table :transactions do |t|
                t.date :date
                t.decimal :amount
  		t.text :description
  	end
  end

  def down
  	drop_table :transactions
  end
end
