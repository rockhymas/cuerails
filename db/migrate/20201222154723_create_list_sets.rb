class CreateListSets < ActiveRecord::Migration[6.0]
  def change
    create_table :list_sets do |t|
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_reference :lists, :list_set, foreign_key: true
  end
end
