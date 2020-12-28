class AddUserManagedToListSet < ActiveRecord::Migration[6.0]
  def change
    add_column :list_sets, :user_managed, :boolean, default: false
  end
end
