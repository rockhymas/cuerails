class List < ApplicationRecord
  has_many :todos, -> { order(position: :asc) }
  belongs_to :user
  belongs_to :list_set, optional: true

  def name
    if date == nil
      return title
    end

    zone = ActiveSupport::TimeZone.new(user.time_zone)
    today = zone.now.to_date

    if date == today
      return "Today's Plan"
    elsif date == today - 1
      return "Yesterday's Plan"
    end

    date.strftime('%m/%d/%Y') + " Plan"
  end
end
