class CreateTodos < ActiveRecord::Migration[6.0]
  def change
    create_table :todos do |t|
      t.string :title
      t.integer :status
      t.boolean :pinned
      t.references :list, null: false, foreign_key: true

      t.timestamps
    end
  end
end
