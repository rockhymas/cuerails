class ListChannel < ApplicationCable::Channel
  def subscribed
    list = List.find params[:id]
    stream_for list
  end
end