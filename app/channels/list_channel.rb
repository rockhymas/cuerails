class ListChannel < ApplicationCable::Channel
  def subscribed
    list = List.find params[:list]
    stream_for list
  end
end