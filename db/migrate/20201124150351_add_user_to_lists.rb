class AddUserToLists < ActiveRecord::Migration[6.0]
  def change
    add_reference :lists, :user, null: false, default: 2, foreign_key: true
  end
end
