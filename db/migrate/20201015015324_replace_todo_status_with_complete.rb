class ReplaceTodoStatusWithComplete < ActiveRecord::Migration[6.0]
  def up
    change_table :todos do |t|
      t.remove :status
      t.boolean :complete, default: false
    end
  end

  def down
    change_table :todos do |t|
      t.remove :complete
      t.integer :status
    end
  end
end
