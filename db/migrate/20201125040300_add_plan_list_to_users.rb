class AddPlanListToUsers < ActiveRecord::Migration[6.0]
  def change
    add_reference :users, :plan_list, default: nil, foreign_key: { to_table: :lists }
  end
end
