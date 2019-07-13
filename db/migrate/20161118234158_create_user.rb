class CreateUser < ActiveRecord::Migration
  def up
  	create_table :users do |t|
                t.string :username
				t.string :currency
                t.string :password_hash
                t.string :salt
                t.timestamps
  	end
  end

  def down
  	drop_table :users
  end
end
