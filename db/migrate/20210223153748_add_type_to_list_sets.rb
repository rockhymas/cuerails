class AddTypeToListSets < ActiveRecord::Migration[6.0]
  def change
    add_column :list_sets, :type, :string
  end
end
