class UserChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end
end