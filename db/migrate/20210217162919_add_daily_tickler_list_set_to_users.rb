class AddDailyTicklerListSetToUsers < ActiveRecord::Migration[6.0]
  def change
    add_reference :users, :daily_tickler_list_set, default: nil, foreign_key: { to_table: :list_sets }
  end
end
