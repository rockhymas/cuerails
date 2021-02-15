class AddArchiveListSetToUsers < ActiveRecord::Migration[6.0]
  def change
    add_reference :users, :archive_list_set, default: nil, foreign_key: { to_table: :list_sets }
  end
end
