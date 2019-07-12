class CreateTransaction < ActiveRecord::Migration
  def up
  	create_table :transactions do |t|
                t.date :date
                t.float :amount
  		t.text :description
                t.belongs_to :user, index: true
                t.timestamps
  	end
  end

  def down
  	drop_table :transactions
  end
end
