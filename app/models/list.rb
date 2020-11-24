class List < ApplicationRecord
  has_many :todos, -> { order(position: :asc) }

  def name
    if date == nil
      return title
    end

    if date == Date.today
      return "Today's Plan"
    elsif date == Date.today - 1
      return "Yesterday's Plan"
    end

    date.strftime('%m/%d/%Y') + " Plan"
  end
end
