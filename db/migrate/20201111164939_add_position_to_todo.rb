class AddPositionToTodo < ActiveRecord::Migration[6.0]
  def change
    add_column :todos, :position, :integer
    Todo.order(:created_at).each.with_index(1) do |todo, index|
      todo.update_column :position, index
    end
  end
end
