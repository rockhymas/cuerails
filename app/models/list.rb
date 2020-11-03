class List < ApplicationRecord
  has_many :todos, -> { order("id") }

  def name
    if date == nil
      return title
    end

    date.to_s + " Plan"
  end
end
