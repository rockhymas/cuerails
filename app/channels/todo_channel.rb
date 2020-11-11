class TodoChannel < ApplicationCable::Channel
  def subscribed
    todo = Todo.find params[:id]
    stream_for todo
  end
end