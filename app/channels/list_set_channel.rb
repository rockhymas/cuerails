class ListSetChannel < ApplicationCable::Channel
  def subscribed
    list_set = ListSet.find params[:id]
    stream_for list_set
  end
end