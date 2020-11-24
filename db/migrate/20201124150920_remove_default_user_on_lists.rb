class RemoveDefaultUserOnLists < ActiveRecord::Migration[6.0]
  def change
    change_column_default(:lists, :user_id, nil)
  end
end
