class AddPositionToList < ActiveRecord::Migration[6.0]
  def change
    add_column :lists, :position, :integer
  end
end
