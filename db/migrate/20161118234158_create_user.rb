class CreateUser < ActiveRecord::Migration
  def up
  	create_table :users do |t|
                t.string :username
				        t.string :currency
                t.string :email
                t.string :theme
                t.timestamps
  	end
  end

  def down
  	drop_table :users
  end
end
